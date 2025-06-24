export function criarGraficoMaterias(estatisticas, chartInstance, resetarCanvas) {
    const titulo = document.querySelector('.secaoTittle');
    if (titulo) {
        titulo.textContent = "Sua porcentagem de acerto por matéria";
    }
    
   
    
    document.querySelector('.metric-label.questoes').textContent = "Mat\u00e9rias Realizadas";
    document.querySelector('.metric-value.questoes').textContent = estatisticas.rankingPorMateria.length;
    document.querySelector('.metric-label.taxa').textContent = "Pior Mat\u00e9ria";
    document.querySelector('.metric-value.taxa').textContent = estatisticas.piorMateria;
    document.querySelector('.metric-label.top').textContent = "Melhor Mat\u00e9ria";
    document.querySelector('.metric-value.top').textContent = estatisticas.topMateria;

    if (!estatisticas || !estatisticas.rankingPorMateria) {
        console.warn("Dados de matérias não disponíveis.");
        return;
    }

    const canvas = document.getElementById('performanceChart');

    const ctx = resetarCanvas();
    if (chartInstance.value)
        chartInstance.value.destroy();

    // Define quantidade de matérias
    const labels = estatisticas.rankingPorMateria.map(m => m.nome);
    const valores = estatisticas.rankingPorMateria.map(m => m.taxa);
    // Calcular largura proporcional sem exagerar (ex: 60px por matéria)

    const gradientFill = ctx.createLinearGradient(0, 0, 0, 200);
    gradientFill.addColorStop(0, 'rgba(108, 99, 255, 0.2)');
    gradientFill.addColorStop(1, 'rgba(108, 99, 255, 0)');
    chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                    label: 'Taxa de Acertos (%)',
                    data: valores,
                    backgroundColor: ['#10B981'],
                    borderColor: ['#10B981'],
                    barThickness: 'flex',
                    categoryPercentage: 0.6,
                    barPercentage: 0.6,
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'x',
            plugins: {
                legend: {display: false},
                tooltip: {
                    callbacks: {
                        label: context => `${context.parsed.y}%`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#9CA3AF',
                        stepSize: 20,
                        callback: value => `${value}%`
                    },
                    grid: {display: false}
                },
                x: {
                    ticks: {
                        color: '#9CA3AF', // cor do texto das labels (corrigido: era `cor`)
                        autoSkip: false, // mostra todos os labels, mesmo se forem muitos

                        callback: function (value) {
                            let label = this.getLabelForValue(value);

                            if (label === "Educação Física") {
                                label = "E.F";
                            }
                            return label.split(' ');
                        }
                    },
                    grid: {display: false}
                }
            }
        }
    });
}