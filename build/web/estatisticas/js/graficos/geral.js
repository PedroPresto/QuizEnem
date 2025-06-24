export function criarGraficoGeral(estatisticas, chartInstance, resetarCanvas) {
    document.querySelector('.metric-label.questoes').textContent = "Respondidas";
    document.querySelector('.metric-value.questoes').textContent = estatisticas.respondidas;
    document.querySelector('.metric-label.taxa').textContent = "Acertos";
    document.querySelector('.metric-value.taxa').textContent = estatisticas.acertos;
    document.querySelector('.metric-label.top').textContent = "Taxa de Acertos";
    document.querySelector('.metric-value.top').textContent = estatisticas.taxaTotal + "%";

    
    
    const ctx = resetarCanvas();
    if (chartInstance.value)
        chartInstance.value.destroy();

    chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Respondidas', 'Acertos', 'Erros'],
            datasets: [{
                    label: 'Resumo de Quest\u00f5es',
                    data: [estatisticas.respondidas, estatisticas.acertos, estatisticas.erros],
                    backgroundColor: ['#6C63FF', '#10B981', '#EF4444'],
                    borderColor: ['#6C63FF', '#10B981', '#EF4444'],
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: '36',
                    categoryPercentage: 0.6,
                    barPercentage: 0.7
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {display: false},
                tooltip: {
                    callbacks: {
                        label: context => `${context.label}: ${context.parsed.y} quest\u00f5es`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: estatisticas.respondidas,
                    ticks: {
                        color: '#9CA3AF',
                        stepSize: 3,
                        precision: 0
                    },
                    grid: {display: false}
                },
                x: {
                    grid: {display: false},
                    ticks: {
                        color: '#9CA3AF',
                        font: {weight: '500'}
                    }
                }
            }
        }
    });
}
