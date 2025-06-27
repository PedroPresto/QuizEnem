// web/simuladoLivre/js/simuladoLivre.js

document.addEventListener('DOMContentLoaded', () => {
    initializeSimuladoLivrePage();
});

// Função para anexar eventos aos botões de contador
function attachCounterEvents() {
    document.querySelectorAll('.counter-button.decrease').forEach(button => {
        button.removeEventListener('click', handleDecreaseCount);
        button.addEventListener('click', handleDecreaseCount);
    });
    document.querySelectorAll('.counter-button.increase').forEach(button => {
        button.removeEventListener('click', handleIncreaseCount);
        button.addEventListener('click', handleIncreaseCount);
    });
}

async function initializeSimuladoLivrePage() {
    // Exibe o loader enquanto carrega as matérias
    document.getElementById('subjectsLoader').style.display = 'flex';
    document.getElementById('subjectsList').style.visibility = 'hidden'; // Esconde a lista até carregar

    try {
        // Faz uma requisição para obter as matérias principais
        // Supondo que você tenha um Servlet que retorna todas as matérias principais
        const response = await fetch(`${contextPath}/getMaterias`); // Precisaremos deste Servlet se não existir
        const materias = await response.json();

        if (materias.length === 0) {
            document.getElementById('subjectsLoader').style.display = 'none';
            alert("Nenhuma matéria encontrada.");
            return;
        }

        // Formata as matérias para o formato esperado pelo store
        const formattedSubjects = materias.map(m => ({
            id: m.id.toString(),
            name: m.nome,
            questionCount: 0,
            icon: m.icon || 'fa-book' // Use o ícone da matéria se existir, senão um genérico
        }));

        // Inicializa o store com as matérias principais
        store.setSubjects(formattedSubjects);

        // Esconde o loader e mostra a lista
        document.getElementById('subjectsLoader').style.display = 'none';
        document.getElementById('subjectsList').style.visibility = 'visible';

        renderSubjects(formattedSubjects); // Função para renderizar os cards de matérias
        attachCounterEvents(); // Anexa os eventos aos novos botões

        // Inicializa o sumário e o botão de início (estas funções vêm do summary.js)
        initializeSummary(); // Chama initializeSummary, que por sua vez chama updateSummary
        initializeStartButton(); // Chama initializeStartButton

    } catch (error) {
        console.error("Erro ao carregar matérias:", error);
        document.getElementById('subjectsLoader').style.display = 'none';
        alert("Erro ao carregar matérias. Por favor, tente novamente.");
    }
}

// Reutiliza a função de renderização de cards (adaptada para matérias principais)
function renderSubjects(subjects) {
    const subjectsList = document.getElementById('subjectsList');
    subjectsList.innerHTML = '';

    subjects.forEach(subject => {
        const subjectItem = document.createElement('div');
        subjectItem.className = 'subject-item';
        subjectItem.id = `subject-${subject.id}`;

        subjectItem.innerHTML = `
            <div class="subject-name">
                <span><i class="fa-solid ${subject.icon}"></i> ${subject.name}</span>
            </div>
            <div class="counter-container">
                <button class="counter-button decrease" data-subject="${subject.id}" ${subject.questionCount <= 0 ? 'disabled' : ''}>
                    -
                </button>
                <span class="counter-value" id="count-${subject.id}">${subject.questionCount}</span>
                <button class="counter-button increase" data-subject="${subject.id}" ${subject.questionCount >= 20 ? 'disabled' : ''}>
                    +
                </button>
            </div>
        `;
        subjectsList.appendChild(subjectItem);
    });
}

// Funções de contador (copiadas de selecionarSubmaterias.js para garantir acessibilidade)
function handleDecreaseCount(event) {
    const subjectId = event.target.dataset.subject;
    const currentSubjectState = store.getState().subjects.find(s => s.id === subjectId);

    if (currentSubjectState && currentSubjectState.questionCount > 0) {
        const newCount = currentSubjectState.questionCount - 1;
        store.updateSubjectCount(subjectId, newCount);

        const countElement = document.getElementById(`count-${subjectId}`);
        if (countElement) countElement.textContent = newCount;

        event.target.disabled = (newCount === 0);
        const increaseButton = document.querySelector(`.counter-button.increase[data-subject="${subjectId}"]`);
        if (increaseButton && newCount < 20) {
            increaseButton.disabled = false;
        }
        updateStartButtonState(); // Chama updateStartButtonState
    }
}

function handleIncreaseCount(event) {
    const subjectId = event.target.dataset.subject;
    const currentSubjectState = store.getState().subjects.find(s => s.id === subjectId);

    if (currentSubjectState && currentSubjectState.questionCount < 20) {
        const newCount = currentSubjectState.questionCount + 1;
        store.updateSubjectCount(subjectId, newCount);

        const countElement = document.getElementById(`count-${subjectId}`);
        if (countElement) countElement.textContent = newCount;

        event.target.disabled = (newCount === 20);
        const decreaseButton = document.querySelector(`.counter-button.decrease[data-subject="${subjectId}"]`);
        if (decreaseButton && newCount > 0) {
            decreaseButton.disabled = false;
        }
        updateStartButtonState(); // Chama updateStartButtonState
    }
}

// NOVO: Adicione esta função aqui para que ela seja definida e acessível
function updateStartButtonState() {
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.disabled = !store.canStartSimulator();

        if (store.canStartSimulator()) {
            startButton.classList.add('active');
        } else {
            startButton.classList.remove('active');
        }
    }
}
