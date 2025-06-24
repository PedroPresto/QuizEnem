let desempenhoChart = null;

/**
 * Conta total de questões visíveis, acertos e erros.
 */
function contarQuestoes() {
    let total = 0, acertos = 0, erros = 0;
    document.querySelectorAll(".questao").forEach(q => {
        if (q.style.display !== "none") {
            total++;
            const status     = parseInt(q.dataset.status, 10);
            const respondida = q.dataset.respondida.toLowerCase();
            const correta    = q.dataset.correta.toLowerCase();

            if (status === 1) {
                erros++;
            } else if (status === 2) {
                acertos++;
            } else if (status === 3) {
                if (respondida === correta) acertos++;
                else                         erros++;
            }
        }
    });
    return { total, acertos, erros };
}

/**
 * Cria ou atualiza o gráfico de barras.
 */
function criarGrafico(total, acertos, erros) {
    const canvas = document.getElementById('graficoDesempenho');

    // Evita duplicação se o canvas for recriado
    if (desempenhoChart && desempenhoChart.canvas !== canvas) {
        desempenhoChart.destroy();
        desempenhoChart = null;
    }

    const ctx = canvas.getContext('2d');
    const data = [total, acertos, erros];

    const cores = {
        total: '#3b82f6',    // Azul
        acertos: '#10b981',  // Verde
        erros: '#ef4444'     // Vermelho
    };

    if (desempenhoChart) {
        desempenhoChart.data.datasets[0].data = data;
        desempenhoChart.update();
    } else {
        desempenhoChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Respondidas', 'Acertos', 'Erros'],
                datasets: [{
                    data: data,
                    backgroundColor: [cores.total, cores.acertos, cores.erros],
                    borderRadius: 0,
                    borderSkipped: false,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: 10 },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, font: { family: 'Inter', size: 12 } },
                        grid: { color: 'rgba(203, 213, 225, 0.3)' }
                    },
                    x: {
                        ticks: { font: { family: 'Inter', size: 12 } },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Desempenho Geral',
                        font: { size: 18, family: 'Inter', weight: '600' },
                        color: '#111827',
                        padding: { top: 10, bottom: 20 }
                    },
                    tooltip: {
                        backgroundColor: '#111827',
                        titleFont: { family: 'Inter', size: 14, weight: '600' },
                        bodyFont: { family: 'Inter', size: 12 },
                        padding: 10,
                        cornerRadius: 8
                    }
                }
            }
        });
    }
}


/**
 * Atualiza as opções de matéria de acordo com a área selecionada.
 */
function atualizarFiltroMateria(areaSelecionada) {
    const filtroMateria = document.getElementById("filtro-materia");
    const opcoes = filtroMateria.querySelectorAll("option");

    opcoes.forEach(opcao => {
        const areaDaOpcao = opcao.getAttribute("data-area");
        if (
            areaSelecionada === "todas" ||
            opcao.value === "todas" ||
            areaDaOpcao === areaSelecionada
        ) {
            opcao.style.display = "block";
        } else {
            opcao.style.display = "none";
        }
    });
}

/**
 * Atualiza a barra de taxa e os contadores de acertos/erros.
 */
function atualizarTaxaAcerto() {
    const { total, acertos, erros } = contarQuestoes();

    // Gráfico
    criarGrafico(total, acertos, erros);

    // Barra de taxa
    const taxa = total > 0 ? Math.round((acertos / total) * 100) : 0;
    const barra = document.getElementById("barraTaxaAcerto");
    if (barra) {
        barra.style.width = `${taxa}%`;
        barra.textContent = `${taxa}%`;
        barra.classList.remove("barra-baixa", "barra-media", "barra-alta");
        barra.classList.add(
            taxa >= 70 ? "barra-alta" :
            taxa >= 40 ? "barra-media" :
            "barra-baixa"
        );
        // pop animation
        barra.classList.remove("pulse");
        void barra.offsetWidth;
        barra.classList.add("pulse");
    }

    // Contadores textuais
    const acertosElem = document.getElementById("acertosContador");
    const errosElem   = document.getElementById("errosContador");
    if (acertosElem) acertosElem.textContent = `✅ Acertos: ${acertos}`;
    if (errosElem)   errosElem.textContent   = `❌ Erros: ${erros}`;
}

/**
 * Filtra questões por área ou matéria e atualiza a visualização.
 */
function filtrarQuestoes(modificadoPor) {
    const filtroArea    = document.getElementById("filtro-area");
    const filtroMateria = document.getElementById("filtro-materia");
    const areaSelecionada = filtroArea.value;

    if (modificadoPor === 'area') {
        atualizarFiltroMateria(areaSelecionada);
        filtroMateria.value = "todas";
    } else if (modificadoPor === 'materia') {
        filtroArea.value = "todas";
    }

    document.querySelectorAll(".questao").forEach(questao => {
        const mat = questao.dataset.materia;
        const ar  = questao.dataset.area;
        const passaMat = filtroMateria.value === "todas" || mat === filtroMateria.value;
        const passaAr  = areaSelecionada === "todas" || ar === areaSelecionada;
        questao.style.display = (passaMat && passaAr) ? "block" : "none";
    });

    atualizarTaxaAcerto();
}

// Expondo para o onchange nos selects
window.filtrarQuestoes = filtrarQuestoes;

// Dispara a primeira atualização quando a página carrega
document.addEventListener('DOMContentLoaded', atualizarTaxaAcerto);
