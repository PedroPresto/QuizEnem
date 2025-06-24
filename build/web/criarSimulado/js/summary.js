/**
 * Summary module for the ENEM simulator
 * Handles the display of test summary information
 */

/**
 * Initialize the summary display
 */
function initializeSummary() {
    // Initial update of summary information
    updateSummary();

    // Subscribe to store changes to update the summary
    store.subscribe(updateSummary);
}

/**
 * Update the summary display based on store state
 */
function updateSummary() {
    const state = store.getState();
    const totalQuestionsElement = document.getElementById('totalQuestions');
    const estimatedTimeElement = document.getElementById('estimatedTime');

    // Update total questions
    totalQuestionsElement.textContent = state.totalQuestions;

    // Update estimated time
    const estimatedTime = store.getEstimatedTime();
    estimatedTimeElement.textContent = `${estimatedTime} min`;

    // Add animation if values changed
    animateSummaryChange(totalQuestionsElement);
    animateSummaryChange(estimatedTimeElement);

    // Update start button state
    updateStartButtonState();
}

/**
 * Add animation to a summary element when it changes
 * @param {HTMLElement} element - Element to animate
 */
function animateSummaryChange(element) {
    // Add and remove a class to trigger animation
    element.style.transform = 'scale(1.1)';
    element.style.color = '#34d399';

    setTimeout(() => {
        element.style.transform = '';
        element.style.color = '';
    }, 300);
}

/**
 * Initialize start button functionality
 */
function initializeStartButton() {
    const startButton = document.getElementById('startButton');

    // Set initial state
    updateStartButtonState();

    // Add click event listener
    startButton.addEventListener('click', handleStartButtonClick);
}

/**
 * Handle start button click
 */
function handleStartButtonClick() {
    resetarEstatisticas();
    if (store.canStartSimulator()) {
    const state = store.getState();
    const activeSubjects = store.getActiveSubjects();

    const requestData = activeSubjects.map(subject => ({
      id: parseInt(subject.id),
      quantidade: subject.questionCount,
      ano: state.selectedYear
    }));

    fetch(`${contextPath}/getIdsQuestoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    })
    .then(res => res.json())
    .then(mapaQuestoes => {
      const todasIds = Object.values(mapaQuestoes).flat();
      const idsParam = todasIds.join(",");

      // Também salva no localStorage se quiser manter tracking local
      localStorage.setItem("idsQuestoes", idsParam);
      localStorage.setItem("qQntd", todasIds.length);
      localStorage.setItem("anoSimulado", state.selectedYear);
      localStorage.setItem("materiasSelecionadas", JSON.stringify(mapaQuestoes));

      // Redireciona via GET com parâmetros na URL
      window.location.href = `${contextPath}/iniciarSimulado?ids=${idsParam}&ano=${state.selectedYear}&indice=0`;
    })
    .catch(err => {
      console.error("Erro ao buscar IDs:", err);
      alert("Erro ao iniciar simulado. Tente novamente.");
    });
  }
}

function resetarEstatisticas() {
    // Salva o tema atual
    const temaSalvo = localStorage.getItem("theme");

    // Lista de prefixos ou nomes exatos que serão removidos
    const chavesASeremRemovidas = [
        "questaoAtual",
        "indiceQuestao",
        "acertos",
        "idsQuestoes",
        "qQntd",
        "anoSimulado",
        "tempoRestante",
        "materiasSelecionadas",
        "tempoRestante"
    ];

    // Remove chaves diretamente nomeadas
    chavesASeremRemovidas.forEach(chave => localStorage.removeItem(chave));

    // Remove todas as `resposta_X` e `status_X`
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (/^resposta_\d+$/.test(key) || /^status_\d+$/.test(key)) {
            localStorage.removeItem(key);
            // Como estamos removendo durante o loop, precisamos ajustar o índice
            i--;
        }
    }

    // Restaura o tema salvo
    if (temaSalvo) {
        localStorage.setItem("theme", temaSalvo);
    }

    // Reatribui variáveis JS
    acertos = 0;
    currentQuestion = 0;
    questaoStatus = [];

    localStorage.setItem("questaoAtual", "1");
    localStorage.setItem("indiceQuestao", "0");
    localStorage.setItem("acertos", "0");

    window.scrollTo(0, 0);
}
