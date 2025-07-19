var express = require('express');
var router = express.Router();
var Item = require('../models/item');
var Cart = require('../models/cart');
const { body } = require('express-validator');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function (req, res, next) {
    Item.find((err, docs) => {
        docs = docs.map((doc) => {
            doc.price = doc.price.toFixed(2);
            var desc_length = 128;
            doc.desc = doc.desc.length > desc_length ?
                doc.desc.substring(0, desc_length - 3) + "..." :
                doc.desc;
            return doc;
        });
        let results = false;
        if(!!req.session.results) {
            results = req.session.results.slice();
            delete req.session.results;
        }
        res.render('items/shop_list', {results: results, title: 'Shop', items: docs, stars: Array.from(Array(5).keys()).map(k => k + 1)});
    })
});

const cart_amount_sanitizer = body('amount').isNumeric().trim().escape().toInt();
const cart_id_sanitizer = body('id').isAlphanumeric().isLength({min: 24, max: 24}).trim().escape().isLength({
    min: 24,
    max: 24
});

function get_cart(req) {
    return new Cart(req.session.cart ? req.session.cart : {})
}

// works for url_depth=1
function get_comeback_url(req) {
    return req.headers.referer.split(req.hostname)[1].split('/')[1]
}

router.post('/add-to-cart', [
        cart_amount_sanitizer,
        cart_id_sanitizer,
    ],
    function(req, res, next) {
        var productId = req.body.id;
        var amountId = req.body.amount;
        var cart = get_cart(req);

        Item.findById(productId, function(err, product) {
            if (err || product.no_items < amountId) {
                return res.redirect('/');
            }
            cart.add(product, product.id, amountId);
            req.session.cart = cart;
            var url = get_comeback_url(req);
            res.redirect('/' + url);
        });
    }
);

router.post('/remove-from-cart', [
        body('amount').isNumeric().trim().escape().toInt(),
        body('id').isAlphanumeric().isLength({ min: 24, max: 24 }).trim().escape().isLength({ min: 24, max: 24 }),
    ],
    function(req, res, next) {
        var productId = req.body.id;
        var amountId = req.body.amount;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.remove(productId, amountId);
        req.session.cart = cart;

        if (cart.totalQty <= 0) {
            delete req.session.cart;
        }

        res.redirect('/');
    }
);

router.get('/purchase',
    function(req, res, next) {

        // default mongodb transaction isolation level is read uncommitted
        let results = [];
        let cart = req.session.cart;
        let count = Object.keys(cart.items).length;
        for (let id in cart.items) {
            let db_session = null;

            function done() {
                count--;
                if (count === 0) {
                    finalize();
                }
            }

            function finalize() {
                req.session.results = results;
                delete req.session.cart;
                res.redirect('/');
            }

            Item.createCollection()
                .then(() => mongoose.startSession())
                .then(_session => {
                    db_session = _session;
                    return db_session.startTransaction();
                })
                .then(() => {
                    return Item.findById(id);
                })
                .then(item => {
                    if (item.no_items >= cart.items[id].qty) {
                        item.no_items -= cart.items[id].qty;
                        item
                            .save()
                            .then(() => {
                                db_session.commitTransaction()
                                .then(() => {
                                    return db_session.endSession()
                                }).then(() => {
                                    results.push({item: cart.items[id], msg: true});
                                    done()
                                })
                            })
                    } else {
                        return db_session.abortTransaction()
                            .then(() => {
                                return db_session.endSession()
                            }).then(() => {
                                results.push({item: cart.items[id], msg: false});
                                done()
                            })
                    }
                });
        }
    }
);

router.get('/clear-cart',
    function(req, res, next) {
        delete req.session.cart;
        res.redirect('/');
    }
);

router.get('/view-cart',
    function(req, res, next) {
        var productId = req.body.id;
        var amountId = req.body.amount;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        res.render('items/checkout_list', {title: 'Shop'});
    }
);

module.exports = router;
