// js/historial.js
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
  ctx.shadowColor  = `rgba(${r},${g},${b}, 0.05)`;  
  ctx.fillStyle    = `rgba(${r},${g},${b}, 0.03)`; 
  ctx.strokeStyle  = `rgba(${r},${g},${b}, 0.10)`;  
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





  // ————— 0. Rango dinámico de fechas —————
  const picker   = document.getElementById('datePicker');
  const MIN_DATE = '2025-06-01';
  const TODAY    = new Date().toISOString().split('T')[0];
  picker.min   = MIN_DATE;
  picker.max   = TODAY;
  picker.value = TODAY;

  // ————— Utiles —————
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const randomHour = () => {
    const h = randomInt(6, 20),
          m = randomInt(0, 59),
          suffix = h < 12 ? 'AM' : 'PM',
          hh = ((h + 11) % 12 + 1).toString().padStart(2, '0'),
          mm = m.toString().padStart(2, '0');
    return `${hh}:${mm} ${suffix}`;
  };
  const randomEntrada = () => (Math.random() < 0.5 ? 'Entrada 1' : 'Entrada 2');

  // ————— 1. Generar datos random para cada fecha —————
  const dataPorFecha = {};
  for (
    let d = new Date(MIN_DATE);
    d <= new Date(TODAY);
    d.setDate(d.getDate() + 1)
  ) {
    const key = d.toISOString().split('T')[0];
    dataPorFecha[key] = {
      personas: randomInt(50, 350),
      camiones: randomInt(0, 8),
      horaPico: randomHour(),
      entrada: randomEntrada(),
    };
  }

  // ————— 2. Panel de datos —————
  const personasEl = document.getElementById('personasVal');
  const camionesEl = document.getElementById('camionesVal');
  const horaEl     = document.getElementById('horaVal');
  const entradaEl  = document.getElementById('entradaVal');

  function mostrarDatos(fecha) {
    const d = dataPorFecha[fecha];
    personasEl.textContent = d.personas;
    camionesEl.textContent = d.camiones;
    horaEl.textContent     = d.horaPico;
    entradaEl.textContent  = d.entrada;
  }

  // ————— 3. Inicializar Chart.js —————
  Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, sans-serif';
  Chart.defaults.font.weight = '500';
  Chart.defaults.font.size   = 12;
  Chart.defaults.color        = '#333';

  const COLORS = {
    AZUL:       '#007AFF',
    AZUL_LIGHT: 'rgba(0, 122, 255, 0.4)',
    AZUL_FADE:  'rgba(0, 122, 255, 0.05)',
    VERDE:      '#34C759',
    NARANJA:    '#FF9500',
    ROJO:       '#FF3B30',
    MORADO:     '#AF52DE'
  };

  // Obtén los ctx de cada canvas
  const lineCtx      = document.getElementById('lineChart').getContext('2d');
  const pieCtx       = document.getElementById('pieChart').getContext('2d');
  const camionCtx    = document.getElementById('camionesChart').getContext('2d');
  const personasCtx  = document.getElementById('personasEntradaChart').getContext('2d');
  const weekCtx      = document.getElementById('weekChart').getContext('2d');

  // Crea instancias vacías
  const lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: ['6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'],
      datasets: [{
        label: 'Personas detectadas',
        data: [],
        fill: true,
        backgroundColor: null,
        borderColor: COLORS.AZUL,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: COLORS.AZUL
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 3000 },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#ECECEC' } }
      }
    }
  });

  const pieChart = new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Entrada 1','Entrada 2'],
      datasets: [{ data: [], backgroundColor: [COLORS.VERDE, 'rgba(52,199,89,0.6)'], hoverOffset: 10, borderWidth: 0 }]
    },
    options: {
      cutout: '60%',
      responsive: true,
      animation: { duration: 3000 },
      plugins: { legend: { position: 'bottom' } }
    }
  });

  const camionesChart = new Chart(camionCtx, {
    type: 'bar',
    data: {
      labels: lineChart.data.labels,
      datasets: [{ label: 'Camiones detectados', data: [], backgroundColor: COLORS.NARANJA, borderRadius: 6 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 3000 },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: '#ECECEC' } }
      }
    }
  });

  const personasEntradaChart = new Chart(personasCtx, {
    type: 'bar',
    data: {
      labels: ['Entrada 1','Entrada 2'],
      datasets: [{ label: 'Personas detectadas', data: [], backgroundColor: [COLORS.ROJO, 'rgba(255,59,48,0.6)'], borderRadius: 6 }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      animation: { duration: 3000 },
      scales: {
        x: { grid: { color: '#ECECEC' } },
        y: { grid: { display: false } }
      }
    }
  });

  const weekChart = new Chart(weekCtx, {
    type: 'bar',
    data: {
      labels: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],
      datasets: [{ label: 'Personas', data: [], backgroundColor: COLORS.MORADO, borderRadius: 6 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 3000 },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#ECECEC' } }
      }
    }
  });

  // ————— 4. Función para actualizar TODAS las gráficas —————
  function updateCharts() {
    // Línea
    const grad = lineCtx.createLinearGradient(0, 0, 0, lineCtx.canvas.height);
    grad.addColorStop(0, COLORS.AZUL_LIGHT);
    grad.addColorStop(1, COLORS.AZUL_FADE);
    lineChart.data.datasets[0].data = Array(15).fill().map(() => randomInt(20, 100));
    lineChart.data.datasets[0].backgroundColor = grad;
    lineChart.update();

    // Pie
    pieChart.data.datasets[0].data = [ randomInt(20, 80), randomInt(20, 80) ];
    pieChart.update();

    // Camiones
    camionesChart.data.datasets[0].data = Array(15).fill().map(() => randomInt(40, 9));
    camionesChart.update();

    // Personas por entrada
    personasEntradaChart.data.datasets[0].data = [ randomInt(100, 200), randomInt(50, 150) ];
    personasEntradaChart.update();

    // Semana
    weekChart.data.datasets[0].data = Array(7).fill().map(() => randomInt(100, 300));
    weekChart.update();
  }

  // ————— 5. Eventos de cambio —————
  picker.addEventListener('input',  e => { mostrarDatos(e.target.value); updateCharts(); });
  picker.addEventListener('change', e => { mostrarDatos(e.target.value); updateCharts(); });

  // ————— 6. Primera carga —————
  mostrarDatos(picker.value);
  updateCharts();
});
