// Required modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const port = 3000;

// Database connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'escola',
  database: 'store'
});

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Ensure cart is initialized
app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  next();
});

// Helper to fetch products
async function getProducts() {
  const [rows] = await db.query('SELECT * FROM products');
  return rows;
}

// Main page: List products
app.get('/', async (req, res) => {
  const products = await getProducts();
  const message = req.session.message;
  req.session.message = null;
  res.render('index', { products, message });
});

// Add to cart
app.post('/add-to-cart', async (req, res) => {
  const { productId } = req.body;
  if (!req.session.cart.includes(productId)) {
    req.session.cart.push(productId);
  }
  res.redirect('/');
});

// View cart
app.get('/cart', async (req, res) => {
  const cartIds = req.session.cart;
  let items = [];
  if (cartIds.length > 0) {
    const [rows] = await db.query('SELECT * FROM products WHERE id IN (?)', [cartIds]);
    items = rows;
  }
  const message = req.session.cartMessage;
  req.session.cartMessage = null;
  res.render('cart', { items, message });
});

// Remove from cart
app.post('/remove-from-cart', (req, res) => {
  const { productId } = req.body;
  req.session.cart = req.session.cart.filter(id => id !== productId);
  res.redirect('/cart');
});

// Cancel purchase
app.post('/cancel', (req, res) => {
  req.session.cart = [];
  req.session.message = 'Purchase cancelled.';
  res.redirect('/');
});

// Finalize purchase
app.post('/finalize', async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const cartIds = req.session.cart;

    // Check if products still exist
    const [rows] = await conn.query('SELECT id FROM products WHERE id IN (?)', [cartIds]);
    const existingIds = rows.map(row => row.id.toString());
    const missing = cartIds.filter(id => !existingIds.includes(id));

    if (missing.length > 0) {
      req.session.cartMessage = 'Some items were already purchased.';
      return res.redirect('/cart');
    }

    // Remove products
    await conn.query('DELETE FROM products WHERE id IN (?)', [cartIds]);
    await conn.commit();

    req.session.cart = [];
    req.session.message = 'Purchase completed successfully!';
    res.redirect('/');
  } catch (err) {
    await conn.rollback();
    console.error(err);
    req.session.cartMessage = 'An error occurred. Please try again.';
    res.redirect('/cart');
  } finally {
    conn.release();
  }
});

app.listen(port, () => {
  console.log(`Store app listening at http://localhost:${port}`);
});
