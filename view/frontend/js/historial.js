// js/historial.js
window.addEventListener('DOMContentLoaded', () => {





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
    layout: {
      padding: { top: 8, bottom: 8 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#333',
        bodyFont: { size: 12 },
        cornerRadius: 6
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#555' } },
      y: { grid: { color: '#ECECEC' }, ticks: { color: '#555', stepSize: 20 } }
    }
  }
});

  const pieChart = new Chart(pieCtx, {
  type: 'doughnut',
  data: {
    labels: ['Entrada 1','Entrada 2'],
    datasets: [{
      data: [],
      backgroundColor: [COLORS.VERDE, 'rgba(52,199,89,0.6)'],
      hoverOffset: 10,
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    cutout: '65%',
    animation: { duration: 2000 },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 11 },
          color: '#555'
        }
      }
    }
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
    datasets: [{
      label: 'Personas detectadas',
      data: [],
      backgroundColor: [COLORS.ROJO, 'rgba(255,59,48,0.6)'],
      borderRadius: 6,
      barThickness: 20
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 8, bottom: 8 } },
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { color: '#ECECEC' }, ticks: { color: '#555' } },
      y: { grid: { display: false }, ticks: { color: '#555' } }
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
    
  }

  // ————— 5. Eventos de cambio —————
  picker.addEventListener('input',  e => { mostrarDatos(e.target.value); updateCharts(); });
  picker.addEventListener('change', e => { mostrarDatos(e.target.value); updateCharts(); });

  // ————— 6. Primera carga —————
  mostrarDatos(picker.value);
  updateCharts();
});
