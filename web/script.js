let currentQuestion = 0;
let score = 0;
let correct = "";
let acertos = parseInt(localStorage.getItem("acertos")) || 0;
let questaoStatus = new Array(10).fill('unanswered');
let intervaloTimer; // variável global para controlar o timer
let idsQuestoes = [];
let questoesRespondidas = 0;
let qQtd = 5;
fetch('getOpcaoCorreta')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            correct = data.opcaoCorreta;
        })
        .catch(error => console.error("Erro:", error));

function resetarEstatisticas() {
    // Salva o tema, se existir
    const temaSalvo = localStorage.getItem("theme");
    localStorage.clear(); // Limpa todo o localStorage

    // Restaura o tema, se for o caso
    if (temaSalvo) {
        localStorage.setItem("theme", temaSalvo);
    }

    // Reatribui valores default
    acertos = 0;
    currentQuestion = 0;
    questaoStatus = [];
    localStorage.setItem("questaoAtual", "1");
    localStorage.setItem("indiceQuestao", "0");
    localStorage.setItem("acertos", "0");
    // Scroll para o topo da página
    window.scrollTo(0, 0);
}

function registrarRespostaSimulado(idQuestao, resposta, status) { //registrar resposta em String para enviar ao banco
    let respostas = JSON.parse(sessionStorage.getItem("respostasSimulado")) || {};
    respostas[idQuestao] = {
        resposta: resposta,
        status: status
    };
    sessionStorage.setItem("respostasSimulado", JSON.stringify(respostas));
}


function atualizarEstatisticas() {
    const info = document.getElementById("acertosInfo");
    if (info) {
        info.innerText = "Respostas Corretas: " + acertos;
    }


    const elementoQuestao = document.getElementById("questaoTexto");
    const indice = parseInt(localStorage.getItem("indiceQuestao")) || 0;
    qQntd = parseInt(localStorage.getItem("qQntd"));
    if (elementoQuestao) {
        elementoQuestao.innerText = "Quest\u00e3o " + (indice + 1) + " de " + (qQntd);
    }


    const progressBar = document.getElementById("questoesRespondidasBar");
    if (progressBar) {
        const progressPercentage = ((questoesRespondidas) / qQntd) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        const statValue = document.getElementById("questoesRespondidasNum");
        if (statValue) {
            statValue.textContent = Math.round(progressPercentage) + "%";
        }
    }

    const correctRateBar = document.getElementById("taxaAcertoBar");
    if (correctRateBar) {
        let correctPercentage;
        if (questoesRespondidas > 0) {
            correctPercentage = ((acertos) / questoesRespondidas) * 100;
        } else {
            correctPercentage = 0;
        }

        correctRateBar.style.width = `${correctPercentage}%`;
        const correctValue = document.getElementById("taxaAcertoNum");
        if (correctValue) {
            correctValue.textContent = Math.round(correctPercentage) + "%";
        }
    }
}


function atualizarNavegacao() {
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach((button, index) => {
        button.classList.remove('active', 'correct', 'incorrect', 'selected');
        const status = questaoStatus[index];
        if (status === 'correct') {
            button.classList.add('correct');
        } else if (status === 'incorrect') {
            button.classList.add('incorrect');
        } else if (status === 'selected') {
            button.classList.add('selected');
        }
        //corrige todos os botões com base no localStorage
        for (let i = 0; i < questaoStatus.length; i++) {
            const status = localStorage.getItem(`status_${i}`);
            if (status) {
                questaoStatus[i] = status;
            }
        }

        if (index === currentQuestion) {
            button.classList.add('active');
        }


    });
}

function aplicarFeedbackVisual(respostaUsuario, respostaCorreta) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        const input = option.querySelector('input');
        const optionLetter = option.querySelector('.option-letter');
        if (input.value === respostaCorreta) {
            option.style.borderColor = 'var(--success-color)';
            optionLetter.style.backgroundColor = 'var(--success-color)';
        }

        if (input.checked && input.value !== respostaCorreta) {
            option.style.borderColor = 'var(--error-color)';
            optionLetter.style.backgroundColor = 'var(--error-color)';
        }
    });
}

function updateCheckButton() {
    const checkButton = document.querySelector('.btn-primary');
    checkButton.textContent = 'Proxima Questao';
    checkButton.onclick = avancar;
}

function updateCheckButtonFinal() {
    indice = parseInt(localStorage.getItem("indiceQuestao"));
    qQntd = parseInt(localStorage.getItem("qQntd"));
    if (indice === qQntd - 1) {
        const checkButton = document.querySelector('.btn-primary');
        const avancarButton = document.getElementById("avancarButton");
        avancarButton.textContent = "Finalizar Simulado";
        checkButton.textContent = 'Checar Resposta';
        avancarButton.onclick = function () {
            finalizarSimulado(); // ← Chama sua função aqui
        };
    }

    if (indice === 0) {
        const backButton = document.getElementById("voltarButton");
        //backButton.style.visibility = "hidden";
    }
}


function finalizarSimulado() {
    console.log("teste");
    let response;
    fetch('finalizarSimulado')
            .then(response => response.json())
            .then(data => {
                console.log("Resumo do simulado:", data);
                // Exemplo: mostrar na tela
                //alert(`Voce respondeu ${data.respondidas}`);

                // Ou redirecionar para resultado.jsp com os dados (se quiser via URL, session ou localStorage)
                //  localStorage.setItem("estatisticasSimulado", JSON.stringify(data));
                //   
                window.location.href = `verResultado`;
            })
            .catch(err => {
                console.error("Erro ao finalizar simulado:", err);
                alert("Erro ao finalizar. Tente novamente.");
            });
}


function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert('Por favor, selecione uma resposta');
        return;
    }

    const respostaUsuario = selectedAnswer.value;
    const respostaCorreta = correct.toLowerCase();
    console.log("Usuário respondeu:", respostaUsuario);
    console.log("Resposta correta:", respostaCorreta);
    console.log("Resposta está correta?", respostaUsuario === respostaCorreta);
    const estaCorreta = respostaUsuario === respostaCorreta;
    //para estatisticas
    questoesRespondidas++;
    //
    fetch('salvarResposta', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            questao: currentQuestion,
            resposta: respostaUsuario,
            correta: respostaUsuario === respostaCorreta
        })
    }).then(response => response.json())
            .then(data => {
                questaoStatus[currentQuestion] = data.status;
                atualizarNavegacao();

                //registrar resposta para o BD
                const idQuestao = idsQuestoes[currentQuestion];
                const statusMap = {selected: 1, correct: 2, incorrect: 3};
                registrarRespostaSimulado(idQuestao, respostaUsuario, statusMap[data.status]);
            });
    if (respostaUsuario === respostaCorreta) {
        acertos++;
        localStorage.setItem("acertos", acertos);
    }

//mudar cor das opções: Radios
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.disabled = true;
    });
    aplicarFeedbackVisual(respostaUsuario, respostaCorreta);
    atualizarEstatisticas();
    atualizarNavegacao();
    updateCheckButton();
    localStorage.setItem(`resposta_${currentQuestion}`, respostaUsuario); //persistir resposta após f5
    localStorage.setItem(`resposta_${currentQuestion}`, respostaUsuario);
    localStorage.setItem(`status_${currentQuestion}`, estaCorreta ? "correct" : "incorrect");
    const questionCard = document.querySelector('.question-card');

}


function iniciarSimulado(materiaId, qQntd) {
    resetarEstatisticas();

    const anoSelecionado = store.getState().selectedYear;  // ou pegue dinamicamente de algum estado
    console.log("Valor de 'anoSelecionado' para o POST:", anoSelecionado);

    const requestData = [{
            id: parseInt(materiaId),
            quantidade: qQntd,
            ano: anoSelecionado
        }];

    fetch(`${contextPath}/getIdsQuestoes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
            .then(res => res.json())
            .then(mapaQuestoes => {
                const ids = mapaQuestoes[materiaId];
                if (!ids || ids.length === 0) {
                    alert("Nenhuma questão disponível para essa matéria.");
                    return;
                }

                const idsSelecionados = ids.slice(0, qQntd);
                const idsParam = idsSelecionados.join(",");

                localStorage.setItem("idsQuestoes", idsParam);
                localStorage.setItem("qQntd", idsSelecionados.length);
                localStorage.setItem("materia", materiaId);
                localStorage.setItem("anoSimulado", anoSelecionado);

                window.location.href = `${contextPath}/iniciarSimulado?materia=${materiaId}&ids=${idsParam}&indice=0`;
            })
            .catch(err => {
                console.error("Erro ao buscar IDs:", err);
                alert("Erro ao iniciar simulado. Tente novamente.");
            });
}

function iniciarSimuladoAdmin(idInicio) {
    resetarEstatisticas();

    fetch(`${contextPath}/getQuestoesPorIdInicial`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `idInicio=${encodeURIComponent(idInicio)}`
    })
            .then(res => res.json())
            .then(ids => {
                if (!ids || ids.length === 0) {
                    alert("Nenhuma questão encontrada a partir do ID informado.");
                    return;
                }

                const idsParam = ids.join(",");

                localStorage.setItem("idsQuestoes", idsParam);
                localStorage.setItem("qQntd", ids.length);
                localStorage.setItem("materia", "admin");
                localStorage.setItem("anoSimulado", "admin");

                window.location.href = `${contextPath}/iniciarSimulado?materia=admin&ids=${idsParam}&indice=0`;
            })
            .catch(err => {
                console.error("Erro ao buscar IDs por ID inicial:", err);
                alert("Erro ao iniciar simulado (modo admin).");
            });
}


function reiniciarSimulado() {
    const idsParam = localStorage.getItem("idsQuestoes");
    let qQntd = localStorage.getItem("qQntd");
    let materia = localStorage.getItem("materia");
    console.log(localStorage);
    resetarEstatisticas();
    localStorage.setItem("materia", materia);
    localStorage.setItem("qQntd", qQntd);
    localStorage.setItem("idsQuestoes", idsParam);

    //console.log(localStorage.getItem("materia"));
    // console.log(localStorage.getItem("idsQuestoes"));
    // console.log(localStorage.getItem("qQntd"));   
    window.location.href = `iniciarSimulado?materia=${materia}&ids=${idsParam}&indice=0`;
}

function retomarSimulado(materia, qQntd) {
    const idsParam = localStorage.getItem("idsQuestoes");
    const spinner = document.getElementById("loadingSpinner");
    const message = document.getElementById("loadingMessage");
    let mensagemLoading = "Restaurando \u00FAltimo simulado";

    if (spinner && message) {
        spinner.style.display = "flex";
        message.textContent = mensagemLoading;
    }

    setTimeout(() => {
        window.location.href = `iniciarSimulado?materia=${materia}&ids=${idsParam}&indice=0`;
    }, 600);

}

function avancar() {
    let indice = parseInt(localStorage.getItem("indiceQuestao")) || 0;
    const qQntd = parseInt(localStorage.getItem("qQntd")) || 0;
    if (indice < qQntd - 1) {
        indice++;
        localStorage.setItem("indiceQuestao", indice);
        const materia = localStorage.getItem("materia");
        carregarQuestao(indice, materia);
    }
}


function anterior() {
    let indice = parseInt(localStorage.getItem("indiceQuestao")) || 0;
    if (indice > 0) {
        indice--;
        localStorage.setItem("indiceQuestao", indice);
        const materia = localStorage.getItem("materia");
        carregarQuestao(indice, materia);
    }
}


function irParaQuestao(indice) {
    localStorage.setItem("indiceQuestao", indice);
    let materia = localStorage.getItem("materia");
    carregarQuestao(indice, materia);
}

function carregarQuestao(indice, materia) {
    let idsParam = localStorage.getItem("idsQuestoes");
    if (!idsParam) {
        const url = new URL(window.location.href);
        idsParam = url.searchParams.get("ids");
    }
    scrollToQuestao();
    if (!idsParam) {
        console.error("IDs de questões não encontrados.");
        return;
    }

    function scrollToQuestao() {
        const questionCard = document.querySelector('.quiz-container');
        if (questionCard) {
            questionCard.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }


// Mostra o loader e esconde o conteúdo antigo
    fetch(`getQuestao?indice=${indice}&materia=${materia}&ids=${idsParam}`)
            .then(response => response.json())
            .then(data => {
                // Primeiro, injeta a nova questão no HTML
                document.getElementById("question-card").innerHTML = data.html;
                document.getElementById("nomeMateriaSpan").textContent = data.materia;
               // document.getElementById("idQuestao").textContent = data.idQuestao;
               // document.getElementById("numeroQuestao").textContent = data.numeroQuestao;
                // Só agora, depois do backend ter atualizado a sessão, buscamos a resposta correta
                return fetch('getOpcaoCorreta');
            })
            .then(response => response.json())
            .then(data => {
                // Agora temos a resposta correta da questão ATUAL
                correct = data.opcaoCorreta.toLowerCase();
                currentQuestion = indice;
                localStorage.setItem("indiceQuestao", indice);
                getRespostaSelecionada();
                atualizarNavegacao();
                atualizarEstatisticas();
                updateCheckButtonFinal();
                // Só restauramos a resposta após saber qual é a correta
                restaurarResposta();
                const latexPresente = document.querySelector('.anexo-body')?.innerHTML.match(/\\[(.*?)\\]|\\((.*?)\\)/);
                if (window.MathJax && latexPresente) {
                    MathJax.typesetPromise().catch(err => console.warn("Erro MathJax:", err));
                }

            })
            .catch(error => console.error("Erro ao carregar questão:", error));

}



fetch('getQuestaoStatus')
        .then(response => response.json())
        .then(data => {
            questaoStatus = data.status;
            atualizarNavegacao();
        })
        .catch(error => console.error("Erro ao buscar status das questões:", error));

function restaurarResposta() {
    const respostaSalva = localStorage.getItem(`resposta_${currentQuestion}`);
    const statusSalvo = localStorage.getItem(`status_${currentQuestion}`);
    if (respostaSalva) {
        const radio = document.querySelector(`input[name="answer"][value="${respostaSalva}"]`);
        if (radio) {
            radio.checked = true;
        }

        // Se a questão já foi avaliada, aplica feedback e desativa inputs
        if (statusSalvo === "correct" || statusSalvo === "incorrect") {
            document.querySelectorAll('input[name="answer"]').forEach(input => {
                input.disabled = true;
            });
            aplicarFeedbackVisual(respostaSalva, correct.toLowerCase());
            updateCheckButton();
        }



        // ✅ Atualiza cor do botão de navegação
        if (statusSalvo) {
            questaoStatus[currentQuestion] = statusSalvo;
            atualizarNavegacao();
        }
    }

    atualizarNavegacao();
}

function getRespostaSelecionada() {
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener("change", () => {
            if (questaoStatus[currentQuestion] === 'correct' || questaoStatus[currentQuestion] === 'incorrect')
                return;
            localStorage.setItem(`resposta_${currentQuestion}`, input.value);
            localStorage.setItem(`status_${currentQuestion}`, 'selected');
            fetch('salvarResposta', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    questao: currentQuestion,
                    resposta: input.value,
                    somenteSelecionou: true // só marca, sem avaliar
                })
            }).then(() => {
                questaoStatus[currentQuestion] = 'selected';
                atualizarNavegacao();

                //salvar respostar string para o BD
                const idQuestao = idsQuestoes[currentQuestion];
                registrarRespostaSimulado(idQuestao, input.value, 1); // selected
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", function () { //CARREGA A QUESTÃO A PRIMEIRA VEZ
    iniciarTimer(1500);
    window.addEventListener('pageshow', () => {
        const spinner = document.querySelector("#loadingSpinner");
        if (spinner) {
            spinner.style.display = "none";
        }
    });

    questoesRespondidas = 0;
    const qQntd = parseInt(localStorage.getItem("qQntd")) || 0;
    atualizarNavegacao();
    for (let i = 0; i < qQntd; i++) {
        const status = localStorage.getItem(`status_${i}`);
        if (status === 'correct' || status === 'incorrect') {
            questoesRespondidas++;
        }
    }

    let questaoAtual = parseInt(localStorage.getItem("indiceQuestao"));
    const indice = parseInt(localStorage.getItem("indiceQuestao")) || 0;
    const materia = localStorage.getItem("materia");
    if (!isNaN(questaoAtual)) {
        currentQuestion = questaoAtual;
    }



    function getParametroURL(nome) {
        const url = new URL(window.location.href);
        return url.searchParams.get(nome);
    }

    let idsParam = getParametroURL("ids");
    let idsQuestoes = [];
    if (idsParam) {
        idsQuestoes = idsParam.split(",").map(id => parseInt(id));
    }

//CARREGA A QUESTÃO A PRIMEIRA VEZ
    if (document.getElementById("question-card")) {
        carregarQuestao(indice, materia);
    }

// Adiciona os botões de navegação
    const container = document.createElement("div");
    container.className = "question-navigation";
    //id = valor do item atual no array (id da questao)
    //index = posicao do item atual no array

    idsQuestoes.forEach((id, index) => {
        const botao = document.createElement("button");
        botao.classList.add("nav-button");
        botao.innerHTML = `
        <span class="numero">${index + 1}</span>
        <span class="status-icon"></span>
    `;
        botao.onclick = () => irParaQuestao(index);
        container.appendChild(botao);
    });
    const quizContainer = document.querySelector(".botoes");
    if (quizContainer) {
        quizContainer.appendChild(container);
    }

// Salvar resposta quando marcar sem checar


    const elementoQuestao2 = document.getElementById("qntdQuestoes-span");
    if (elementoQuestao2) {
        elementoQuestao2.innerText = qQntd + " quest\u00f5es";
    }

    atualizarEstatisticas();
//Estatisticas e desempenho 

}); //final do Dom


//Timer
function iniciarTimer(duracaoSegundos) {
    clearInterval(intervaloTimer); // Garante que não fique acumulando timers

    const timerDisplay = document.getElementById("quizTimer");
    let tempoRestante = duracaoSegundos;
    const atualizarTempo = () => {
        const minutos = String(Math.floor(tempoRestante / 60)).padStart(2, '0');
        const segundos = String(tempoRestante % 60).padStart(2, '0');
        if (timerDisplay) {
            timerDisplay.textContent = `${minutos}:${segundos}`;
        }

        localStorage.setItem("tempoRestante", tempoRestante); // salva o progresso

        if (tempoRestante > 0) {
            tempoRestante--;
        } else {
            clearInterval(intervaloTimer);
            timerDisplay.textContent = "Tempo esgotado!";
            localStorage.removeItem("tempoRestante");
        }
    };
    atualizarTempo(); // mostra o tempo inicial imediatamente
    intervaloTimer = setInterval(atualizarTempo, 1000); // usa a variável global correta
}


function toggleAnexo(wrapper) {
    const body = wrapper.querySelector(".anexo-body");
    // Se estiver expandido, recolhe
    if (wrapper.classList.contains("expanded")) {
        body.style.maxHeight = null;
        wrapper.classList.remove("expanded");
    } else {
        // Define a altura real do conteúdo para expandir
        body.style.maxHeight = body.scrollHeight + "px";
        wrapper.classList.add("expanded");
    }
}


function renderizarMathJax() {
    if (window.MathJax?.typesetPromise) {
        MathJax.typesetPromise().catch(err => console.warn("Erro MathJax:", err));
    }
}

window.MathJax = {
    tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']]
    },
    svg: {
        fontCache: 'global'
    }
};

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
script.async = true;
document.head.appendChild(script);

//remover zoom por toque duplo
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault(); // bloqueia o segundo toque
    }
    lastTouchEnd = now;
}, false);






