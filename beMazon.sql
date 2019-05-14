DROP DATABASE IF EXISTS beMazon_DB;

CREATE DATABASE beMazon_DB;

USE beMazon_DB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Helmet", "Football Equipment", 100, 100),
("Shoulder Pads", "Football Equipment", 100, 85),
("Football", "Football Equipment", 20, 100),
("Receiver Gloves", "Football Accessories", 25, 50),
("Wrist Bands", "Football Accessories", 10, 45),
("Mouth Guard", "Football Accessories", 20, 40),
("Jersey", "Apparel and Shoes", 25, 50),
("Pants", "Apparel and Shoes", 25, 50),
("Cleats", "Apparel and Shoes", 75, 32);

