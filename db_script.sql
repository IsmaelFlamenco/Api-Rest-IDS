CREATE DATABASE prueba;

USE prueba;

CREATE TABLE usuarios(
    idUsuario INT(5) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    apellido VARCHAR(150),
    edad INT(3)
);