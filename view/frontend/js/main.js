window.addEventListener('DOMContentLoaded', () => {
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
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      points.push({ ox: i * spacing, oy: j * spacing, x: 0, y: 0, offset: Math.random() * 1000 });
    }
  }

  function animate(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const [r, g, b] = [0, 95, 163];  // tu #005fa3

  ctx.shadowBlur   = glowSize;
  ctx.shadowColor  = `rgba(${r},${g},${b}, 0.05)`;  // halo muy suave
  ctx.fillStyle    = `rgba(${r},${g},${b}, 0.03)`;  // puntos casi invisibles
  ctx.strokeStyle  = `rgba(${r},${g},${b}, 0.10)`;  // líneas muy tenues
  ctx.lineWidth    = 1;

  points.forEach(p => {
    const time = t * speed + p.offset;
    p.x = p.ox + Math.sin(time + p.oy * 0.005) * 30;
    p.y = p.oy + Math.cos(time + p.ox * 0.005) * 30;
  });

 

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
    ctx.beginPath();
    points.forEach(p => {
      ctx.moveTo(p.x + 2, p.y);
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    });
    ctx.fill();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);






  // Estilo global para Chart.js (fuente + color de texto)
  Chart.defaults.font.family =
    '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, sans-serif';
  Chart.defaults.font.weight = '500';
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#333';

  
  const COLOR_AZUL      = '#007AFF';      // acento principal
  const COLOR_AZUL_LIGHT = 'rgba(0, 122, 255, 0.4)';
  const COLOR_AZUL_FADE  = 'rgba(0, 122, 255, 0.05)';
  const COLOR_VERDE     = '#34C759';      // para doughnut
  const COLOR_VERDE_FADE = 'rgba(52, 199, 89, 0.4)';
  const COLOR_NARANJA   = '#FF9500';      // para barras camiones
  const COLOR_ROJO      = '#FF3B30';      // para barras personas entrada
  const COLOR_MORADO    = '#AF52DE';      // para tráfico semanal
  const COLOR_MORADO_FADE = 'rgba(175, 82, 222, 0.4)';

  // 1) Gráfica de líneas: Flujo por Hora (azul)
  const lineCtx = document.getElementById('lineChart').getContext('2d');
  const gradient = lineCtx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, COLOR_AZUL_LIGHT);
  gradient.addColorStop(1, COLOR_AZUL_FADE);

  new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: [
        '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
      ],
      datasets: [
        {
          label: 'Personas detectadas',
          data: [20, 85, 70, 40, 25, 15, 18, 30, 35, 50, 60, 40, 30, 20, 10],
          fill: true,
          backgroundColor: gradient,
          borderColor: COLOR_AZUL,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: COLOR_AZUL
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            color: '#333',
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#555' },
        },
        y: {
          grid: { color: '#ECECEC' },
          ticks: { color: '#555', stepSize: 20 },
        },
      },
    },
  });

  // 2) Gráfica Doughnut: Distribución por Entrada (verde)
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Entrada 1', 'Entrada 2'],
      datasets: [
        {
          data: [70, 30],
          backgroundColor: [COLOR_VERDE, 'rgba(52, 199, 89, 0.6)'],
          hoverOffset: 10,
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: '60%',
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#555', usePointStyle: true, pointStyle: 'circle' },
        },
      },
    },
  });

  // 3) Gráfica de barras vertical: Camiones por Hora (naranja)
  const camionCtx = document.getElementById('camionesChart').getContext('2d');
  new Chart(camionCtx, {
    type: 'bar',
    data: {
      labels: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
               '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
      datasets: [
        {
          label: 'Camiones detectados',
          data: [1, 4, 3, 2, 2, 1, 0, 2, 3, 1, 2, 4, 3, 2, 1],
          backgroundColor: COLOR_NARANJA,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#555', maxRotation: 45, minRotation: 45 },
        },
        y: {
          beginAtZero: true,
          grid: { color: '#ECECEC' },
          ticks: { color: '#555', stepSize: 1 },
        },
      },
    },
  });

  // 4) Gráfica de barras horizontal: Personas por Entrada (rojo)
  const personasEntradaCtx = document
    .getElementById('personasEntradaChart')
    .getContext('2d');
  new Chart(personasEntradaCtx, {
    type: 'bar',
    data: {
      labels: ['Entrada 1', 'Entrada 2'],
      datasets: [
        {
          label: 'Personas detectadas',
          data: [180, 76],
          backgroundColor: [COLOR_ROJO, 'rgba(255, 59, 48, 0.6)'],
          borderRadius: 6,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { color: '#ECECEC' },
          ticks: { color: '#555', stepSize: 50 },
        },
        y: {
          grid: { display: false },
          ticks: { color: '#555' },
        },
      },
    },
  });

  // 5) Gráfica de barras vertical: Tráfico semanal acumulado (morado)
  const weekCtx = document.getElementById('weekChart').getContext('2d');
  new Chart(weekCtx, {
    type: 'bar',
    data: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      datasets: [
        {
          label: 'Personas',
          data: [230, 198, 254, 300, 280, 100, 50],
          backgroundColor: COLOR_MORADO,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#555' },
        },
        y: {
          grid: { color: '#ECECEC' },
          ticks: { color: '#555', stepSize: 50 },
        },
      },
    },
  });
});














// 6) Inicializar mapa Leaflet
const map = L.map('map').setView([20.6100, -103.3586], 16); // Tonalá

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([20.6100, -103.3586]).addTo(map)
  .bindPopup('Centro Universitario de Tonalá')
  .openPopup();
