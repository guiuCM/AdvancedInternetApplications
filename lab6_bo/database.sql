CREATE DATABASE store;
USE store;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

INSERT INTO products (name, description) VALUES
('Book', 'A very interesting book.'),
('Headphones', 'Noise-cancelling headphones.'),
('Laptop', 'A fast and portable laptop.');