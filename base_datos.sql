-- Crear la base de datos si no existe
CREATE DATABASE prueba
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectar a la base de datos (esto se hace manualmente, pero se incluye para referencia)
-- \c prueba

-- Crear el esquema
CREATE SCHEMA IF NOT EXISTS usuario
    AUTHORIZATION postgres;

-- Establecer el esquema predeterminado
SET search_path TO usuario;

-- Crear la tabla usuario
CREATE TABLE IF NOT EXISTS usuario.usuario (
    id VARCHAR(255) PRIMARY KEY,
    contrasena VARCHAR(255) NOT NULL,
    primer_nombre VARCHAR(100),
    segundo_nombre VARCHAR(100),
    primer_apellido VARCHAR(100),
    segundo_apellido VARCHAR(100)
);

-- Asignar propietario
ALTER TABLE usuario.usuario OWNER TO postgres;

-- Crear la tabla tarea
CREATE TABLE IF NOT EXISTS usuario.tarea (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fk_usuario VARCHAR(255) NOT NULL,
    CONSTRAINT fk_tarea_usuario FOREIGN KEY (fk_usuario)
        REFERENCES usuario.usuario (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Asignar propietario
ALTER TABLE usuario.tarea OWNER TO postgres;
