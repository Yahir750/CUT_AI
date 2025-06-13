const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002;

// Conexión base de datos
const db = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'root',
  database: 'cut_movilidad_ia'
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registro
app.post('/register', async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) return res.json({ success: false, message: 'Faltan datos.' });

  db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, results) => {
    if (err) return res.json({ success: false, message: 'Error en la base de datos.' });
    if (results.length > 0) return res.json({ success: false, message: 'El usuario ya existe.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO usuarios (usuario, password) VALUES (?, ?)', [usuario, hashedPassword], err => {
      if (err) return res.json({ success: false, message: 'Error al registrar.' });
      res.json({ success: true, message: 'Registro exitoso.' });
    });
  });
});

// Login
app.post('/login', (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) return res.json({ success: false, message: 'Faltan datos.' });

  db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, results) => {
    if (err) return res.json({ success: false, message: 'Error en la base de datos.' });
    if (results.length === 0) return res.json({ success: false, message: 'Usuario no encontrado.' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ success: true, message: 'Inicio de sesión exitoso.' });
    } else {
      res.json({ success: false, message: 'Contraseña incorrecta.' });
    }
  });
});

// Flujo por hora
app.get('/flujo-hora', (req, res) => {
  db.query(`SELECT hora_inicio, SUM(personas_detectadas) AS total FROM datos_monitoreo GROUP BY hora_inicio ORDER BY hora_inicio`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const labels = results.map(r => `${r.hora_inicio}:00`);
    const data = results.map(r => r.total);
    res.json({ labels, data });
  });
});

// Camiones por hora
app.get('/camiones-por-hora', (req, res) => {
  db.query(`SELECT hora_inicio, SUM(camiones_detectados) AS total FROM datos_monitoreo GROUP BY hora_inicio ORDER BY hora_inicio`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const labels = results.map(r => `${r.hora_inicio}:00`);
    const data = results.map(r => r.total);
    res.json({ labels, data });
  });
});

// Personas por entrada
app.get('/personas-por-entrada', (req, res) => {
  const query = `
    SELECT c.entrada, SUM(d.personas_detectadas) AS total
    FROM camaras c
    JOIN datos_monitoreo d ON c.camara_id = d.camara_id
    GROUP BY c.entrada;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const labels = results.map(r => r.entrada);
    const data = results.map(r => r.total);
    res.json({ labels, data });
  });
});

// Tráfico semanal
app.get('/trafico-semanal', (req, res) => {
  const query = `
    SELECT DAYOFWEEK(fecha) AS dia_num, SUM(personas_detectadas) AS total
    FROM datos_monitoreo
    GROUP BY dia_num
    ORDER BY dia_num;
  `;
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const labels = results.map(r => diasSemana[r.dia_num - 1]);
    const data = results.map(r => r.total);
    res.json({ labels, data });
  });
});

// Personas hoy
app.get('/personas-hoy', (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM personas WHERE DATE(fecha) = CURDATE()', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: rows[0].total });
  });
});

// Camiones hoy
app.get('/camiones-hoy', (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM camiones WHERE DATE(fecha) = CURDATE()', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: rows[0].total });
  });
});

// Hora pico
app.get('/hora-pico', (req, res) => {
  db.query(`
    SELECT HOUR(fecha) as hora, COUNT(*) as total 
    FROM personas 
    WHERE DATE(fecha) = CURDATE() 
    GROUP BY hora 
    ORDER BY total DESC 
    LIMIT 1
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ hora: rows[0]?.hora ?? null });
  });
});

// Entrada destacada
app.get('/entrada-destacada', (req, res) => {
  db.query(`
    SELECT entrada, COUNT(*) as total 
    FROM personas 
    WHERE DATE(fecha) = CURDATE() 
    GROUP BY entrada 
    ORDER BY total DESC 
    LIMIT 1
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ entrada: rows[0]?.entrada ?? '—' });
  });
});
