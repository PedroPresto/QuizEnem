import { criarGraficoGeral } from './graficos/geral.js';
import { criarGraficoMaterias } from './graficos/materias.js';
import { criarGraficoAreas } from './graficos/areas.js';
import { criarGraficoResumo } from './graficos/resumo.js';
import { getEstatisticas } from './state/estatisticasStore.js';

let chartInstance = {value: null};

window.addEventListener('estatisticasProntas', () => {
    const estatisticas = getEstatisticas();
    console.log("estatisticas carregadas:", estatisticas);

// Troca de seção ao clicar no botão
    document.querySelectorAll('.botao-switch.principal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.botao-switch.principal').forEach(b => b.classList.remove('ativo'));
            btn.classList.add('ativo');
            const secao = btn.dataset.section;
            if (secao === "geral") {
                const titulo = document.querySelector('.secaoTittle');
                if (titulo) {
                    titulo.textContent = "Seu progresso geral";
                }

                criarGraficoGeral(estatisticas, chartInstance, resetarCanvas);
            } else if (secao === "materias") {
                criarGraficoAreas(estatisticas, chartInstance, resetarCanvas);
                
            } else if (secao === "resumo") {
                criarGraficoResumo(estatisticas, chartInstance, resetarCanvas);
            }
        });
    });

    // Subbotões
    document.querySelectorAll('.botao-switch.sub').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.botao-switch.sub').forEach(b => b.classList.remove('ativo'));
            btn.classList.add('ativo');

            const tipo = btn.dataset.sub;
            const canvas = document.getElementById('performanceChart');
            const container = canvas?.parentElement;

            if (tipo === 'materias') {
                criarGraficoMaterias(estatisticas, chartInstance, resetarCanvas);

                // Ajuste de largura dinâmica para scroll horizontal
                chartInstance.value.data.datasets[0].barThickness = 'flex';
                chartInstance.value.options.responsive = false;

                canvas.parentElement.style.overflowX = 'auto';
                
            } else if (tipo === 'areas') {
                criarGraficoAreas(estatisticas, chartInstance, resetarCanvas);
               
            }

        });
    });

});


// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
// exibe gráfico padrão ao carregar

// Botão animação
    const button = document.querySelector('.view-quizzes-btn');
    if (button) {
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.98)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    }

// Progresso animado
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = '65%';
        }, 500);
    }
});


function resetarCanvas() {
    const antigo = document.getElementById('performanceChart');
    if (antigo)
        antigo.remove();
    const novoCanvas = document.createElement('canvas');
    novoCanvas.id = 'performanceChart';
    document.querySelector('.chart-scroll').appendChild(novoCanvas);
    return novoCanvas.getContext('2d');
}
