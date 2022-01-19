
DROP DATABASE IF EXISTS sofia;
CREATE DATABASE IF NOT EXISTS sofia DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;  -- opcion de codificacion utf8mb4_unicode_ci;
-- RECOMENDACION AL CREAR LA NUEVA BASE DE DATOS LOS CAMPOS DE SELECCION HACERLOS NUMERICOS Y RELACIONAR LAS OPCIONES EN LAS PLANTILLAS 
-- ESTA BASE DE DATOS RELACIONA LA MAYOR PARTE DE LAS SOLICITUDES ESTUDIANTILES 
USE sofia; 

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
    cat_name VARCHAR(100),
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