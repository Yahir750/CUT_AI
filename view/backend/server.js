const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
    port: 3307,
  user: 'root',
  password: 'root',
  database: 'CUT_IA'
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registro de usuario
app.post('/register', async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) return res.json({ success: false, message: 'Faltan datos.' });

  // Verificar si el usuario ya existe
  db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, results) => {
    if (err) return res.json({ success: false, message: 'Error en la base de datos.' });
    if (results.length > 0) return res.json({ success: false, message: 'El usuario ya existe.' });

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO usuarios (usuario, password) VALUES (?, ?)',
      [usuario, hashedPassword],
      (err) => {
              if (err) {
                console.error("Error en INSERT:", err);   // <--- ESTE LOG
                return res.json({ success: false, message: 'Error al registrar.' });
              }
              res.json({ success: true, message: 'Registro exitoso.' });
            }
    );
  });
});

// Login de usuario
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});