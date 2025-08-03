export function criarGraficoResumo(estatisticas, chartInstance, resetarCanvas) {
    const titulo = document.querySelector('.secaoTittle');
    if (titulo) {
        titulo.textContent = "Questões respondidas essa semana";
    }

    const subbotoes = document.querySelectorAll('.secundario');
    
    subbotoes.forEach(botao => {
        botao.style.display = 'none';
    });

    const ctx = resetarCanvas(); // canvas limpinho
    if (chartInstance.value)
        chartInstance.value.destroy();
    console.log("Dados por dia:", estatisticas.acertosPorDia);

    const {labels, acertos, respondidas} = gerarDadosGrafico(estatisticas.acertosPorDia);

    const gradientAcertos = ctx.createLinearGradient(0, 0, 0, 200);
    gradientAcertos.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    gradientAcertos.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    const gradientRespondidas = ctx.createLinearGradient(0, 0, 0, 200);
    gradientRespondidas.addColorStop(0, 'rgba(59, 130, 246, 0.3)');  // azul suave
    gradientRespondidas.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Acertos',
                    data: acertos,
                    borderColor: '#10B981',
                    backgroundColor: gradientAcertos,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: '#10B981'
                },
                {
                    label: 'Respondidas',
                    data: respondidas,
                    borderColor: '#3B82F6',
                    backgroundColor: gradientRespondidas,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: '#3B82F6'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {display: true},
                tooltip: {
                    callbacks: {
                        label: context => `${context.dataset.label}: ${context.parsed.y}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {stepSize: 1},
                    
                },
                x: {
                    beginAtZero: true,
                    ticks: {stepSize: 1},
                    grid: { display: false }
                }
            }
        }
    });

}

function gerarDadosGrafico(acertosPorDia) {
    const ultimos7Dias = gerarDiasRecentes(7); // ['2025-05-17', ..., '2025-05-23']
    const labels = ultimos7Dias.map(nomeDiaSemana);
    const acertos = [];
    const respondidas = [];

    ultimos7Dias.forEach(data => {
        const info = acertosPorDia[data];
        acertos.push(info?.acertos || 0);
        respondidas.push(info?.total || 0);
    });

    return {labels, acertos, respondidas};
}




function gerarDiasRecentes(n) {
    const hoje = new Date();
    const dias = [];
    for (let i = n - 1; i >= 0; i--) {
        const data = new Date();
        data.setDate(hoje.getDate() - i);
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        dias.push(`${ano}-${mes}-${dia}`);
    }
    console.log("dias: ", dias);
    return dias;
}


function nomeDiaSemana(isoDate) {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const [ano, mes, dia] = isoDate.split('-');
    const date = new Date(ano, mes - 1, dia); // 💥 local time!

    console.log("date: ", date);
    return dias[date.getDay()];
}


