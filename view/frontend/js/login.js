document.addEventListener('DOMContentLoaded', () => {
  // ───────────────
  // 1) SETUP CANVAS
  // ───────────────
  const canvas = document.getElementById('mesh-bg');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const spacing = 80;      
  const glowSize = 8;      
  const speed = 0.0015;  
  const cols = Math.ceil(canvas.width / spacing) + 1;
  const rows = Math.ceil(canvas.height / spacing) + 1;
  const points = [];

  // generar puntos base
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      points.push({
        ox: i * spacing,
        oy: j * spacing,
        x: 0,
        y: 0,
        offset: Math.random() * 1000
      });
    }
  }

  // ────────────────────────────
  // 3) EVENTOS DE LOGIN / REGISTRO
  // ────────────────────────────
  document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const usuario = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    if (!usuario || !password) {
      return document.getElementById('registerMessage').textContent = 'Completa todos los campos.';
    }
    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });
      const data = await res.json();
      document.getElementById('registerMessage').textContent = data.message;
    } catch {
      document.getElementById('registerMessage').textContent = 'Error de conexión.';
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const usuario = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!usuario || !password) {
      return document.getElementById('loginMessage').textContent = 'Completa todos los campos.';
    }
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });
      const data = await res.json();
      document.getElementById('loginMessage').textContent = data.message;
      if (data.success) window.location.href = 'index.html';
    } catch { 
      document.getElementById('loginMessage').textContent = 'Error de conexión.';
    }
  });
});
