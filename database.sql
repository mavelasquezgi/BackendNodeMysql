
DROP DATABASE IF EXISTS store;
CREATE DATABASE IF NOT EXISTS store DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;  -- opcion de codificacion utf8mb4_unicode_ci;
-- RECOMENDACION AL CREAR LA NUEVA BASE DE DATOS LOS CAMPOS DE SELECCION HACERLOS NUMERICOS Y RELACIONAR LAS OPCIONES EN LAS PLANTILLAS 
-- ESTA BASE DE DATOS RELACIONA LA MAYOR PARTE DE LAS SOLICITUDES ESTUDIANTILES 
USE store; 

CREATE TABLE IF NOT EXISTS users(
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(10),
      fullname VARCHAR(30),
      email VARCHAR(40) UNIQUE,
      password VARCHAR(100),
      verification  BOOLEAN,
      role  VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE = INNODB;
-- INSERT INTO users(username,fullname,email,password,verification,role) values('User','UserTest','mavelasquezgi@unal.edu.co','User*',1,'Official');

CREATE TABLE IF NOT EXISTS category (
    cat_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cat_name VARCHAR(100) UNIQUE,
    cat_descrip VARCHAR(250)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS product (
    prod_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    prod_name VARCHAR(100),
    prod_descrip VARCHAR(250),
    prod_category INT(11),
    prod_price VARCHAR(250),
    prod_wheigth FLOAT,
    prod_image VARCHAR(250),
    CONSTRAINT fk_cat_prod FOREIGN KEY (prod_category) REFERENCES category(cat_id) ON DELETE NO ACTION
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS orderStore (
    orderSt_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    orderSt_user INT(11),
    orderSt_product INT(11),
    orderSt_units INT(11),
    orderSt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_order FOREIGN KEY (orderSt_user) REFERENCES users(id) ON DELETE NO ACTION,
    CONSTRAINT fk_product_order FOREIGN KEY (orderSt_product) REFERENCES product(prod_id) ON DELETE NO ACTION
)ENGINE = INNODB;