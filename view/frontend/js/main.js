window.addEventListener('DOMContentLoaded', () => {
  
// Estilo global para Chart.js (fuente + color de texto)
  Chart.defaults.font.family =
    '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, sans-serif';
  Chart.defaults.font.weight = '500';
  Chart.defaults.font.size = 11;
  Chart.defaults.color = '#333';
  Chart.defaults.plugins.legend.labels.boxWidth = 12;

  
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
    
  });

  // 2) Gráfica Doughnut: Distribución por Entrada (verde)
const pieCtx = document.getElementById('pieChart').getContext('2d');

new Chart(pieCtx, {
  type: 'doughnut',
  data: {
    labels: ['Entrada 1', 'Entrada 2'],
    datasets: [{
      data: [70, 30],
      backgroundColor: ['#4cd964', '#a0e6a0'],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 11 },
          color: '#555'
        }
      },
      tooltip: {
        backgroundColor: '#222',
        bodyFont: { size: 12 },
        cornerRadius: 6,
        padding: 8
      }
    }
  }
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
  const personasEntradaCtx = document.getElementById('personasEntradaChart').getContext('2d');

new Chart(personasEntradaCtx, {
  type: 'bar',
  data: {
    labels: ['Entrada 1', 'Entrada 2'],
    datasets: [{
      label: 'Personas detectadas',
      data: [180, 76],
      backgroundColor: ['#ff3b30', 'rgba(255, 59, 48, 0.4)'],
      borderRadius: 8,
      barThickness: 20
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#333',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 8,
        cornerRadius: 6
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: '#ececec' },
        ticks: { color: '#555', stepSize: 50 }
      },
      y: {
        grid: { display: false },
        ticks: {
          color: '#555',
          font: { size: 12 }
        }
      }
    }
  }
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
const map = L.map('map').setView([20.5858, -103.3284], 16); // coordenadas aproximadas CUT Tonalá

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Puedes añadir marcadores personalizados aquí:
L.marker([20.565889, -103.223694]).addTo(map).bindPopup('Entrada 1');
L.marker([20.569167, -103.227806]).addTo(map).bindPopup('Entrada 2');
map.setView([20.5675, -103.2257], 16);  // Ajusta el zoom (17 es ideal para campus)


