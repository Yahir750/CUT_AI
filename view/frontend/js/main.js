window.addEventListener('DOMContentLoaded', () => {
  // 0) KPIs dinámicos
fetch('http://localhost:3002/personas-hoy')
  .then(res => res.json())
  .then(data => {
    document.getElementById('kpi-personas').textContent = data.total ?? 0;
  });

fetch('http://localhost:3002/camiones-hoy')
  .then(res => res.json())
  .then(data => {
    document.getElementById('kpi-camiones').textContent = data.total ?? 0;
  });

fetch('http://localhost:3002/hora-pico')
  .then(res => res.json())
  .then(data => {
    const hora = data.hora?.toString().padStart(2, '0');
    document.getElementById('kpi-hora').textContent = `${hora}:00`;
  });

fetch('http://localhost:3002/entrada-destacada')
  .then(res => res.json())
  .then(data => {
    document.getElementById('kpi-entrada').textContent = data.entrada ?? '—';
  });

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
  fetch('http://localhost:3002/flujo-hora')
  .then(res => res.json())
  .then(({ labels, data }) => {
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const gradient = lineCtx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 122, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 122, 255, 0.05)');

    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Personas detectadas',
          data,
          fill: true,
          backgroundColor: gradient,
          borderColor: '#007AFF',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#007AFF'
        }]
      }
    });
  });


  // 2) Gráfica Doughnut: Distribución por Entrada (verde)


fetch('http://localhost:3002/personas-por-entrada')
  .then(res => res.json())
  .then(({ labels, data }) => {
    const pieCtx = document.getElementById('pieChart').getContext('2d');

    new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
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
  });


  // 3) Gráfica de barras vertical: Camiones por Hora (naranja)
  fetch('http://localhost:3002/camiones-por-hora')
  .then(res => res.json())
  .then(({ labels, data }) => {
    const camionCtx = document.getElementById('camionesChart').getContext('2d');
    new Chart(camionCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Camiones detectados',
          data,
          backgroundColor: '#FF9500',
          borderRadius: 6,
        }]
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
          }
        }
      }
    });
  });


  // 4) Gráfica de barras horizontal: Personas por Entrada (rojo)
  

fetch('http://localhost:3002/personas-por-entrada')
  .then(res => res.json())
  .then(({ labels, data }) => {
    const personasEntradaCtx = document.getElementById('personasEntradaChart').getContext('2d');
    new Chart(personasEntradaCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Personas detectadas',
          data,
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
  });


  // 5) Gráfica de barras vertical: Tráfico semanal acumulado (morado)
  fetch('http://localhost:3002/trafico-semanal')
  .then(res => res.json())
  .then(({ labels, data }) => {
    const weekCtx = document.getElementById('weekChart').getContext('2d');
    new Chart(weekCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Personas',
          data,
          backgroundColor: '#AF52DE',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#555' }
          },
          y: {
            grid: { color: '#ECECEC' },
            ticks: { color: '#555', stepSize: 50 }
          }
        }
      }
    });
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


