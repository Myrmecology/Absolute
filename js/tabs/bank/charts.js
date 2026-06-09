/* ============================================================
   ABSOLUTE — js/tabs/bank/charts.js
   Chart.js Integration | Bar Chart | Pie Chart | Animations
   Dynamic Data | Period Filters | Neon Styling
   ============================================================ */

const AbsoluteBankCharts = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let barChart      = null;
  let pieChart      = null;
  let bankData      = null;
  let currentPeriod = '6m';

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const barCanvas      = document.getElementById('bar-chart');
  const pieCanvas      = document.getElementById('pie-chart');
  const pieLegend      = document.getElementById('pie-legend');
  const filterBtns     = document.querySelectorAll('.chart-filter-btn');

  // ----------------------------------------------------------
  // CHART.JS DEFAULTS
  // ----------------------------------------------------------
  function setupChartDefaults() {
    if (!window.Chart) return;

    Chart.defaults.color          = '#4a4f7a';
    Chart.defaults.borderColor    = 'rgba(100, 110, 200, 0.1)';
    Chart.defaults.font.family    = "'Share Tech Mono', monospace";
    Chart.defaults.font.size      = 11;
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.animation.duration     = 1000;
    Chart.defaults.animation.easing       = 'easeOutQuart';
  }

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    if (!window.Chart) return;

    setupChartDefaults();
    loadBankData();
    bindFilterButtons();
  }

  // ----------------------------------------------------------
  // LOAD BANK DATA
  // ----------------------------------------------------------
  function loadBankData() {
    // Load from embedded JSON data
    fetch('data/mock-bank.json')
      .then(r => r.json())
      .then(data => {
        bankData = data;
        buildBarChart(data.barChartData[currentPeriod]);
        buildPieChart(data.pieChartData);
        buildPieLegend(data.pieChartData);
      })
      .catch(() => {
        // Fallback inline data
        bankData = getFallbackData();
        buildBarChart(bankData.barChartData[currentPeriod]);
        buildPieChart(bankData.pieChartData);
        buildPieLegend(bankData.pieChartData);
      });
  }

  // ----------------------------------------------------------
  // BUILD BAR CHART
  // ----------------------------------------------------------
  function buildBarChart(periodData) {
    if (!barCanvas || !window.Chart) return;

    if (barChart) {
      barChart.destroy();
      barChart = null;
    }

    const ctx = barCanvas.getContext('2d');

    // Gradient fills
    const incomeGrad = ctx.createLinearGradient(0, 0, 0, 220);
    incomeGrad.addColorStop(0,   'rgba(0, 245, 255, 0.8)');
    incomeGrad.addColorStop(1,   'rgba(0, 245, 255, 0.1)');

    const expenseGrad = ctx.createLinearGradient(0, 0, 0, 220);
    expenseGrad.addColorStop(0,  'rgba(255, 43, 78, 0.8)');
    expenseGrad.addColorStop(1,  'rgba(255, 43, 78, 0.1)');

    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: periodData.labels,
        datasets: [
          {
            label:           'Income',
            data:            periodData.income,
            backgroundColor: incomeGrad,
            borderColor:     'rgba(0, 245, 255, 0.9)',
            borderWidth:     1,
            borderRadius:    4,
            borderSkipped:   false,
          },
          {
            label:           'Expenses',
            data:            periodData.expenses,
            backgroundColor: expenseGrad,
            borderColor:     'rgba(255, 43, 78, 0.9)',
            borderWidth:     1,
            borderRadius:    4,
            borderSkipped:   false,
          }
        ]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        interaction: {
          mode:       'index',
          intersect:  false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(5, 5, 31, 0.95)',
            borderColor:     'rgba(0, 245, 255, 0.3)',
            borderWidth:     1,
            titleColor:      '#00f5ff',
            bodyColor:       '#9da3d4',
            padding:         12,
            titleFont: {
              family: "'Orbitron', sans-serif",
              size:   11,
              weight: '600'
            },
            bodyFont: {
              family: "'Share Tech Mono', monospace",
              size:   11
            },
            callbacks: {
              label: (ctx) => {
                return ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color:     'rgba(100, 110, 200, 0.06)',
              drawBorder: false
            },
            ticks: {
              color:    '#4a4f7a',
              font: {
                family: "'Share Tech Mono', monospace",
                size:   10
              }
            }
          },
          y: {
            grid: {
              color:     'rgba(100, 110, 200, 0.06)',
              drawBorder: false
            },
            ticks: {
              color:    '#4a4f7a',
              font: {
                family: "'Share Tech Mono', monospace",
                size:   10
              },
              callback: (val) => `$${(val / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  }

  // ----------------------------------------------------------
  // BUILD PIE CHART
  // ----------------------------------------------------------
  function buildPieChart(pieData) {
    if (!pieCanvas || !window.Chart) return;

    if (pieChart) {
      pieChart.destroy();
      pieChart = null;
    }

    const ctx = pieCanvas.getContext('2d');

    pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels:   pieData.labels,
        datasets: [{
          data:             pieData.values,
          backgroundColor:  pieData.colors.map(c => hexToRgba(c, 0.75)),
          borderColor:      pieData.colors.map(c => hexToRgba(c, 0.9)),
          borderWidth:      2,
          hoverBackgroundColor: pieData.colors.map(c => hexToRgba(c, 0.9)),
          hoverBorderColor: pieData.colors,
          hoverBorderWidth: 3,
          hoverOffset:      8
        }]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        cutout:              '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(5, 5, 31, 0.95)',
            borderColor:     'rgba(0, 245, 255, 0.3)',
            borderWidth:     1,
            titleColor:      '#00f5ff',
            bodyColor:       '#9da3d4',
            padding:         12,
            titleFont: {
              family: "'Orbitron', sans-serif",
              size:   10,
              weight: '600'
            },
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct   = ((ctx.raw / total) * 100).toFixed(1);
                return ` $${ctx.raw.toLocaleString()} (${pct}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          duration:      1200,
          easing:        'easeOutQuart'
        }
      }
    });
  }

  // ----------------------------------------------------------
  // BUILD PIE LEGEND
  // ----------------------------------------------------------
  function buildPieLegend(pieData) {
    if (!pieLegend) return;

    pieLegend.innerHTML = '';

    const total = pieData.values.reduce((a, b) => a + b, 0);

    pieData.labels.forEach((label, i) => {
      const pct   = ((pieData.values[i] / total) * 100).toFixed(0);
      const color = pieData.colors[i];

      const item = document.createElement('div');
      item.className = 'pie-legend-item';
      item.innerHTML = `
        <span class="pie-legend-dot" style="background: ${color}; box-shadow: 0 0 6px ${color};"></span>
        <span>${label}</span>
        <span class="pie-legend-value" style="color: ${color};">$${pieData.values[i].toLocaleString()}</span>
      `;

      pieLegend.appendChild(item);

      if (window.gsap) {
        gsap.fromTo(item,
          { opacity: 0, x: -10 },
          {
            opacity:  1,
            x:        0,
            duration: 0.3,
            delay:    i * 0.06,
            ease:     'power3.out'
          }
        );
      }
    });
  }

  // ----------------------------------------------------------
  // BIND FILTER BUTTONS
  // ----------------------------------------------------------
  function bindFilterButtons() {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const period = btn.dataset.period;
        if (period === currentPeriod) return;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentPeriod = period;
        updateBarChart(period);
      });
    });
  }

  // ----------------------------------------------------------
  // UPDATE BAR CHART
  // ----------------------------------------------------------
  function updateBarChart(period) {
    if (!barChart || !bankData) return;

    const periodData = bankData.barChartData[period];
    if (!periodData) return;

    barChart.data.labels              = periodData.labels;
    barChart.data.datasets[0].data    = periodData.income;
    barChart.data.datasets[1].data    = periodData.expenses;

    barChart.update('active');

    if (window.gsap && barCanvas) {
      gsap.fromTo(barCanvas,
        { opacity: 0.5 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }

  // ----------------------------------------------------------
  // REFRESH — Called when bank tab becomes active
  // ----------------------------------------------------------
  function refresh() {
    if (!barChart && !pieChart) {
      init();
      return;
    }

    if (barChart)  barChart.update();
    if (pieChart)  pieChart.update();
  }

  // ----------------------------------------------------------
  // UTILITY — Hex to RGBA
  // ----------------------------------------------------------
  function hexToRgba(hex, alpha) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(0, 245, 255, ${alpha})`;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // ----------------------------------------------------------
  // FALLBACK DATA
  // ----------------------------------------------------------
  function getFallbackData() {
    return {
      barChartData: {
        '6m': {
          labels:   ['Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5', 'Cycle 6', 'Cycle 7'],
          income:   [4200, 5100, 4800, 6200, 5900, 6400],
          expenses: [2100, 2800, 2400, 3100, 2900, 3180]
        },
        '3m': {
          labels:   ['Cycle 5', 'Cycle 6', 'Cycle 7'],
          income:   [6200, 5900, 6400],
          expenses: [3100, 2900, 3180]
        },
        '1m': {
          labels:   ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          income:   [1600, 1600, 1600, 1600],
          expenses: [980, 720, 840, 640]
        }
      },
      pieChartData: {
        labels: ['Mission Equipment', 'Portal Access', 'Provisions', 'Intelligence', 'Insurance', 'Artefact Storage'],
        values: [1200, 800, 450, 600, 300, 250],
        colors: ['#00f5ff', '#7b2fff', '#ff2ff8', '#ffd700', '#00ff9d', '#ff7b00']
      }
    };
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return { init, refresh, updateBarChart };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteBankCharts.init();
});