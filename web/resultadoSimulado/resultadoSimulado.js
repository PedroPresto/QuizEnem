document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    let responseData = null;

    fetch('finalizarSimulado')
        .then(response => {
            if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            responseData = data;
            if (data.gabaritoDetalhado) {
                populateGabarito(data.gabaritoDetalhado);
            }

            fetch('salvarQuestoesBD', { method: 'POST' })
                .then(saveResponse => {
                    if (saveResponse.ok) {
                        console.log("Comando para salvar resultado enviado com sucesso.");
                    } else {
                        console.error("Falha ao enviar comando para salvar o resultado no banco.");
                    }
                })
                .catch(err => console.error("Erro de rede ao tentar salvar o resultado:", err));

            const spinner = document.getElementById("loadingSpinner");
            const pageWrapper = document.querySelector('.resultado-page-wrapper');
            if (spinner && pageWrapper) {
                // Diminuí o tempo de espera para algo mais rápido (ex: 500ms)
                // Você pode remover o setTimeout se quiser que a troca seja imediata
                setTimeout(() => {
                    // Esconde o spinner
                    spinner.style.opacity = '0'; // Começa o fade-out do spinner
                    setTimeout(() => spinner.style.display = "none", 0); // Remove após a transição

                    // --- CORREÇÃO APLICADA ---
                    // Adiciona a classe 'visible' para mostrar o conteúdo da página
                    pageWrapper.classList.add('visible');

                    if (responseData) {
                        updateUI(responseData);
                    }
                }, 500); // 0.5 segundo de espera
            }
        })
        .catch(err => {
            console.error('Erro ao carregar os dados do simulado:', err);
            document.getElementById('resultadoSummary').textContent = 'Não foi possível carregar seu resultado.';

            const spinner = document.getElementById("loadingSpinner");
            const pageWrapper = document.querySelector('.resultado-page-wrapper');
            if (spinner && pageWrapper) {
                spinner.style.opacity = '0';
                setTimeout(() => spinner.style.display = "none", 300);

                // --- CORREÇÃO APLICADA ---
                // Mostra a página mesmo em caso de erro
                pageWrapper.classList.add('visible');
            }
        });

    const gabaritoBtn = document.getElementById('verGabaritoBtn');
    const gabaritoDetalhado = document.getElementById('gabaritoDetalhado');

    gabaritoBtn.addEventListener('click', () => {
        const isOpening = !gabaritoDetalhado.classList.contains('open');
        gabaritoDetalhado.classList.toggle('open');

        if (isOpening) {
            setTimeout(() => {
                gabaritoDetalhado.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    });
});

// --- O RESTO DO SEU CÓDIGO JS PERMANECE IGUAL ---

function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function updateUI(data) {
    const acertos = data.detalhado?.correct || 0;
    const erros = data.detalhado?.incorrect || 0;
    const naoResp = data.detalhado?.unanswered || 0;
    const total = acertos + erros + naoResp;
    const porcentagem = total > 0 ? Math.round((acertos / total) * 100) : 0;

    const animationDuration = 2500;

    animateValue(document.getElementById('totalAcertos'), 0, acertos, animationDuration - 500);
    animateValue(document.getElementById('totalErros'), 0, erros, animationDuration - 500);
    animateValue(document.getElementById('totalNaoRespondidas'), 0, naoResp, animationDuration - 500);
    animateValue(document.getElementById('progressValue'), 0, porcentagem, animationDuration, '%');

    document.getElementById('resultadoSummary').innerHTML = `Você acertou <strong>${acertos} de ${total}</strong> questões!`;

    animateProgressCircle(porcentagem, animationDuration);
}

function animateProgressCircle(percentage, duration) {
    const circle = document.getElementById('progressCircle');
    if (circle) {
        let performanceClass = 'bad';
        if (percentage >= 70) {
            performanceClass = 'good';
        } else if (percentage >= 50) {
            performanceClass = 'medium';
        }
        circle.dataset.performance = performanceClass;

        const angle = (percentage / 100) * 360;

        circle.style.transitionDuration = `${duration / 1000}s`;

        circle.style.setProperty('--progress-angle', angle + 'deg');
    }
}

function populateGabarito(questoes) {
    const container = document.getElementById('listaQuestoesContainer');
    if (!container) return;

    container.innerHTML = '';
    const listaUl = document.createElement('ul');
    listaUl.className = 'lista-questoes';

    if (!questoes || questoes.length === 0) {
        container.innerHTML = '<p>Não foi possível carregar o gabarito detalhado.</p>';
        return;
    }

    questoes.forEach((q, index) => {
        const li = document.createElement('li');
        li.className = `questao ${q.status}`;

        let respostaHtml = '';
        const respostaUsuarioKey = q.respostaUsuario ? q.respostaUsuario.toUpperCase() : null;
        const respostaCorretaKey = q.respostaCorreta ? q.respostaCorreta.toUpperCase() : null;
        const textoRespostaUsuario = respostaUsuarioKey ? q.alternativas[respostaUsuarioKey] : 'Não respondida';
        const textoRespostaCorreta = respostaCorretaKey ? q.alternativas[respostaCorretaKey] : '';

        if (q.status === 'correta') {
            respostaHtml = `<div class="resposta">Sua resposta: <strong>${textoRespostaUsuario}</strong></div>`;
        } else if (q.status === 'incorreta') {
            respostaHtml = `<div class="resposta">Sua resposta: <del>${textoRespostaUsuario}</del></div>`;
        }

        if (q.status === 'incorreta' || q.status === 'nao_respondida') {
            respostaHtml += `<div class="resposta-correta">Resposta correta: <strong>${textoRespostaCorreta}</strong></div>`;
        }

        const statusText = q.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

        let anexoTextoHtml = '';
        if (q.anexoTexto) {
            anexoTextoHtml = `
                <div class="anexo-container">
                    <button class="anexo-toggle-btn">
                        <span>Ver Texto de Apoio</span>
                        <i data-lucide="chevron-down"></i>
                    </button>
                    <div class="anexo-content">
                        <p>${q.anexoTexto.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            `;
        }

        li.innerHTML = `
            <div class="questao-header">
                <span>Questão ${index + 1}</span>
                <span class="status-tag">${statusText}</span>
            </div>
            ${anexoTextoHtml}
            <p class="enunciado-gabarito">${q.enunciado}</p>
            ${respostaHtml}
        `;
        listaUl.appendChild(li);
    });

    container.appendChild(listaUl);

    lucide.createIcons();
    setupAnexoToggles();
}

function setupAnexoToggles() {
    const anexoButtons = document.querySelectorAll('.anexo-toggle-btn');

    anexoButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const content = button.nextElementSibling;
            content.classList.toggle('show');
        });
    });
}