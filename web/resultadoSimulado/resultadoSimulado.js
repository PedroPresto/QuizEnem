let estatisticas = 0;

// / Atualiza os cards com os resultados
function updateResults(data) {
    const total = (data.respondidas || 0) + (data.naoRespondidas || 0);
    const acertos = data.detalhado.correct || 0;
    const erros = data.detalhado.incorrect || 0;
    const naoResp = data.detalhado.unanswered || 0;

    document.getElementById('totalQuestions').textContent = total;
    document.getElementById('correctAnswers').textContent = acertos;
    document.getElementById('wrongAnswers').textContent = erros;
    document.getElementById('unansweredQuestions').textContent = naoResp;

    // Update progress bar
    const percentage = total > 0 ? Math.round((acertos / total) * 100) : 0;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;

    // Mensagem motivacional
    const feedback = document.getElementById('feedbackMessage');
    if (feedback) {
        if (percentage >= 80) {
            feedback.textContent = "🎉 Excelente! Você foi muito bem no simulado!";
        } else if (percentage >= 50) {
            feedback.textContent = "💪 Bom trabalho! Ainda dá pra melhorar.";
        } else {
            feedback.textContent = "🧠 Continue praticando! Você está evoluindo.";
        }
    }

    // Update statistics table
    const statsTable = document.getElementById('statsTable');
    const stats = [
        {name: 'Total de Questões', value: total, percentage: '100%'},
        {name: 'Questões Respondidas', value: data.respondidas, percentage: `${Math.round((data.respondidas / total) * 100)}%`},
        {name: 'Acertos', value: acertos, percentage: `${Math.round((acertos / total) * 100)}%`},
        {name: 'Erros', value: erros, percentage: `${Math.round((erros / total) * 100)}%`},
        {name: 'Não Respondidas', value: naoResp, percentage: `${Math.round((naoResp / total) * 100)}%`}
    ];

    statsTable.innerHTML = stats.map(stat => `
    <tr>
      <td>${stat.name}</td>
      <td>${stat.value}</td>
      <td>${stat.percentage}</td>
    </tr>
  `).join('');
}

// Cria o gráfico de resultados
function createChart(data) {
    const ctx = document.getElementById('resultsChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Acertos', 'Erros', 'Não Respondidas'],
            datasets: [{
                data: [
                    data.detalhado.correct || 0,
                    data.detalhado.incorrect || 0,
                    data.detalhado.unanswered || 0
                ],
                backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        },
                        // CORREÇÃO: A cor do texto do gráfico também precisa de respeitar o tema
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((context.raw / total) * 100) : 0;
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: (value) => {
                        const percentage = Math.round((value / 5) * 100);
                        return `${percentage}%`;
                    }
                }
            }
        },
        plugins: [{
            beforeDraw: function (chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '14px sans-serif';
                // CORREÇÃO: A cor do texto do gráfico também precisa de respeitar o tema
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const data = chart.data.datasets[0].data;
                const total = data.reduce((a, b) => a + b, 0);

                let centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                let centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

                ctx.fillText(`Total`, centerX, centerY - 15);
                ctx.fillText(`${total}`, centerX, centerY + 15);

                ctx.restore();
            }
        }]
    });

    // 🛠 Força o redimensionamento após o carregamento
    setTimeout(() => {
        const chart = Chart.getChart("resultsChart");
        if (chart) {
            chart.resize();
        }
    }, 300);
}

// REMOÇÃO: A lógica de gestão de tema foi removida deste ficheiro
// para evitar conflitos com o script principal em head.jsp.

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // A chamada a initTheme() foi removida daqui.

    fetch('finalizarSimulado')
        .then(response => response.json())
        .then(data => {
            estatisticas = data;
            updateResults(data);
            createChart(data);

            // Oculta o loading após o carregamento dos dados
            const spinner = document.getElementById("loadingSpinner");
            if (spinner) {
                setTimeout(() => {
                    spinner.style.display = "none";
                }, 600);
            }

        })
        .catch(err => {
            console.error('Erro ao carregar os dados do simulado:', err);
        });
});
