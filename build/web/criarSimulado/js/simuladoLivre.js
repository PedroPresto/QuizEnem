// web/simuladoLivre/js/simuladoLivre.js

// COLOQUE ESTA LISTA AQUI NO INÍCIO DO ARQUIVO simuladoLivre.js
const subjectData = [
    {id: '3', name: 'Português', questionCount: 0, icon: 'fa-pen-nib'},
    {id: '10', name: 'Matemática', questionCount: 0, icon: 'fa-square-root-variable'},
    {id: '14', name: 'História', questionCount: 0, icon: 'fa-landmark'},
    {id: '15', name: 'Geografia', questionCount: 0, icon: 'fa-globe-americas'},
    {id: '11', name: 'Biologia', questionCount: 0, icon: 'fa-dna'},
    {id: '13', name: 'Química', questionCount: 0, icon: 'fa-vial'},
    {id: '12', name: 'Física', questionCount: 0, icon: 'fa-atom'},
    {id: '5', name: 'Inglês', questionCount: 0, icon: 'fa-flag-usa'},
    {id: '6', name: 'Espanhol', questionCount: 0, icon: 'fa-flag'},
    {id: '4', name: 'Literatura', questionCount: 0, icon: 'fa-book-open'},
    {id: '16', name: 'Filosofia', questionCount: 0, icon: 'fa-brain'},
    {id: '17', name: 'Sociologia', questionCount: 0, icon: 'fa-users'},
    {id: '9', name: 'Tecnologias da Informação', questionCount: 0, icon: 'fa-computer'},
    {id: '8', name: 'Artes', questionCount: 0, icon: 'fa-palette'},
    {id: '7', name: 'Educação Física', questionCount: 0, icon: 'fa-person-running'}
];


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
    // Exibe o loader enquanto carrega as matérias (pode manter, para dar um feedback visual rápido)
    document.getElementById('subjectsLoader').style.display = 'flex';
    document.getElementById('subjectsList').style.visibility = 'hidden'; // Esconde a lista até carregar

    // REMOVA OU COMENTE A CHAMADA FETCH ABAIXO
    /*
    try {
        const response = await fetch(`${contextPath}/getMaterias`);
        const materias = await response.json();

        if (materias.length === 0) {
            document.getElementById('subjectsLoader').style.display = 'none';
            alert("Nenhuma matéria encontrada.");
            return;
        }

        const formattedSubjects = materias.map(m => ({
            id: m.id.toString(),
            name: m.nome,
            questionCount: 0,
            icon: m.icon || 'fa-book'
        }));
        store.setSubjects(formattedSubjects);
    } catch (error) {
        console.error("Erro ao carregar matérias:", error);
        document.getElementById('subjectsLoader').style.display = 'none';
        alert("Erro ao carregar matérias. Por favor, tente novamente.");
        return; // Retorna em caso de erro para não continuar com dados vazios
    }
    */
    // NOVO: Inicializa o store diretamente com a lista hardcoded subjectData
    store.setSubjects([...subjectData]);


    // Esconde o loader e mostra a lista
    document.getElementById('subjectsLoader').style.display = 'none';
    document.getElementById('subjectsList').style.visibility = 'visible';

    renderSubjects(store.getState().subjects); // Passe os subjects do store
    attachCounterEvents(); // Anexa os eventos aos novos botões

    // Inicializa o sumário e o botão de início (estas funções vêm do summary.js)
    initializeSummary(); // Chama initializeSummary, que por sua vez chama updateSummary
    initializeStartButton(); // Chama initializeStartButton
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

// Adapte initializeStartButton e initializeSummary do summary.js para esta página.
// Já foram copiadas para dentro do initializeSubMateriasPage para serem chamadas lá.
// O summarize.js também precisa ser importado.

// Adapte animateEntrance do main.js (mantida de simuladoLivre.js original)
/*
function animateEntrance() {
    const card = document.querySelector('.card');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    }
}
*/
// Esta função parece não ser usada em simuladoLivre.js diretamente.
// Se ela estiver em main.js e main.js não for usado em simuladoLivre.jsp,
// ou ela deve ser removida ou definida localmente se houver necessidade.
// Pelo que vejo, initializeSimuladoLivrePage não chama animateEntrance().
// Se você quiser a animação, adicione `animateEntrance();` dentro de `initializeSimuladoLivrePage()`.