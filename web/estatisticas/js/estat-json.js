import { criarGraficoGeral } from './graficos/geral.js';
import { setEstatisticas } from './state/estatisticasStore.js';

let chartInstance = {value: null};
var estatisticas;

document.addEventListener('DOMContentLoaded', () => {

    fetch('estatisticas-json')
            .then(res => res.json())
            .then(data => {
                console.log("Estatísticas:", data);
                setEstatisticas(data);
                window.dispatchEvent(new CustomEvent('estatisticasProntas')); 
                criarGraficoGeral(data, chartInstance, resetarCanvas);
                // Atualiza os valores dinâmicos na grid de métricas
                document.querySelector('.metric-label.questoes').textContent = "Quest\u00f5es Respondidas";
                document.querySelector('.metric-value.questoes').textContent = data.respondidas;

                document.querySelector('.metric-label.taxa').textContent = "Quest\u00f5es Corretas";
                document.querySelector('.metric-value.taxa').textContent = data.acertos;

                document.querySelector('.metric-label.top').textContent = "Taxa de Acertos";
                document.querySelector('.metric-value.top').textContent = data.taxaTotal + "%";

            })
            .catch(error => {
                console.error("Erro ao carregar estatísticas:", error);
            });

});

function resetarCanvas() {
    const antigo = document.getElementById('performanceChart');
    if (antigo)
        antigo.remove();

    const novo = document.createElement('canvas');
    novo.id = 'performanceChart';
    document.querySelector('.chart-scroll').appendChild(novo);
    return novo.getContext('2d');
}