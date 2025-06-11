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

  // ────────────────────
  // 2) ANIMACIÓN OPTIMIZADA
  // ────────────────────
 function animate(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const [r, g, b] = [0, 95, 163];  // tu #005fa3

  ctx.shadowBlur   = glowSize;
  ctx.shadowColor  = `rgba(${r},${g},${b}, 0.05)`;  
  ctx.fillStyle    = `rgba(${r},${g},${b}, 0.03)`;  
  ctx.strokeStyle  = `rgba(${r},${g},${b}, 0.10)`;  
  ctx.lineWidth    = 1;

  points.forEach(p => {
    const time = t * speed + p.offset;
    p.x = p.ox + Math.sin(time + p.oy * 0.005) * 30;
    p.y = p.oy + Math.cos(time + p.ox * 0.005) * 30;
  });

    // 4) dibuja TODAS las líneas en un único path
    ctx.beginPath();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const idx = i * rows + j;
        const p = points[idx];
        if (i < cols - 1) {
          const pr = points[(i + 1) * rows + j];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pr.x, pr.y);
        }
        if (j < rows - 1) {
          const pb = points[i * rows + j + 1];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pb.x, pb.y);
        }
      }
    }
    ctx.stroke();  

    // 5) dibuja TODOS los puntos en un único path
    ctx.beginPath();
    points.forEach(p => {
      ctx.moveTo(p.x + 2, p.y);
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    });
    ctx.fill();   

    // 6) siguiente frame
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

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
