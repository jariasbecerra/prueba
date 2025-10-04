const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config({ path: '../../.env' });

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('Token requerido');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Token inválido');
    req.user = user;
    next();
  });
};

// CRUD Tareas (protegidos)
app.post('/tareas', verifyToken, async (req, res) => {
  const { nombre, descripcion, fk_usuario } = req.body;
  try {
    await pool.query(`INSERT INTO ${process.env.DB_SCHEMA}.tarea (nombre, descripcion, fk_usuario) VALUES ($1, $2, $3)`, [nombre, descripcion, fk_usuario]);
    res.send('Tarea creada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/tareas', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.tarea`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/tareas/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fk_usuario } = req.body;
  try {
    await pool.query(`UPDATE ${process.env.DB_SCHEMA}.tarea SET nombre = $1, descripcion = $2, fk_usuario = $3 WHERE id = $4`, [nombre, descripcion, fk_usuario, id]);
    res.send('Tarea actualizada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/tareas/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM ${process.env.DB_SCHEMA}.tarea WHERE id = $1`, [id]);
    res.send('Tarea eliminada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Obtener usuarios para combo box
app.get('/usuarios', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, primer_nombre, primer_apellido FROM ${process.env.DB_SCHEMA}.usuario`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3002, () => console.log('Task Service en puerto 3002'));