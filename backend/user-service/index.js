const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

// Login
app.post('/login', async (req, res) => {
  const { id, contrasena } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.usuario WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(400).send('Usuario no encontrado');
    const user = result.rows[0];
    const validPass = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPass) return res.status(400).send('Contraseña inválida');
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// CRUD Usuarios (protegidos)
app.post('/usuarios', verifyToken, async (req, res) => {
  const { id, contrasena, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = req.body;
  const hashedPass = await bcrypt.hash(contrasena, 10);
  try {
    await pool.query(`INSERT INTO ${process.env.DB_SCHEMA}.usuario (id, contrasena, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido) VALUES ($1, $2, $3, $4, $5, $6)`, 
      [id, hashedPass, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido]);
    res.send('Usuario creado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/usuarios', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM ${process.env.DB_SCHEMA}.usuario`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/usuarios/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { contrasena, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = req.body;
  const hashedPass = contrasena ? await bcrypt.hash(contrasena, 10) : undefined;
  try {
    await pool.query(`UPDATE ${process.env.DB_SCHEMA}.usuario SET contrasena = COALESCE($1, contrasena), primer_nombre = $2, segundo_nombre = $3, primer_apellido = $4, segundo_apellido = $5 WHERE id = $6`, 
      [hashedPass, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id]);
    res.send('Usuario actualizado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/usuarios/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM ${process.env.DB_SCHEMA}.usuario WHERE id = $1`, [id]);
    res.send('Usuario eliminado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3001, () => console.log('User Service en puerto 3001'));