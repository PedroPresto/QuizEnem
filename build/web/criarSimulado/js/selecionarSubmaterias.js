document.addEventListener('DOMContentLoaded', () => {
    initializeSubMateriasPage();
});

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

// Esta função será o ponto de entrada principal para esta página
async function initializeSubMateriasPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const idMateria = urlParams.get('idMateria'); // Obtém o ID da matéria da URL

    if (!idMateria) {
        console.error("ID da matéria não encontrado na URL. Redirecionando para a página inicial.");
       // window.location.href = `${contextPath}/index.jsp`;
        return;
    }

    // Exibe o loader enquanto carrega as disciplinas
    document.getElementById('disciplinesLoader').style.display = 'flex';
    document.getElementById('disciplinesList').style.visibility = 'hidden'; // Esconde a lista até carregar

    // Exibir o nome da matéria principal (requer GetMateriaAtualServlet ou um mapa local)
    const mainSubjectTitleEl = document.getElementById('mainSubjectTitle');
    if (mainSubjectTitleEl) {
        try {
            const response = await fetch(`${contextPath}/getMateriaAtual?idMateria=${idMateria}`); // Crie GetMateriaAtualServlet ou use o existente
            const data = await response.json();
            mainSubjectTitleEl.textContent = `Matéria: ${data.materia || 'Desconhecida'}`;
        } catch (error) {
            console.error("Erro ao obter nome da matéria:", error);
            mainSubjectTitleEl.textContent = `Matéria: ID ${idMateria}`;
        }
    }

    try {
        // Faz uma requisição para obter as sub-matérias
        const response = await fetch(`${contextPath}/getSubMaterias?idMateria=${idMateria}`);
        const disciplinas = await response.json();

        if (disciplinas.length === 0) {
            mainSubjectTitleEl.textContent = `Matéria: ID ${idMateria} (Nenhuma disciplina encontrada)`;
            document.getElementById('disciplinesLoader').style.display = 'none';
            alert("Nenhuma disciplina encontrada para esta matéria.");
            return;
        }

        // Formata as disciplinas para o formato esperado pelo store (como se fossem subjects)
        const formattedDisciplines = disciplinas.map(d => ({
            id: d.id.toString(), // Converter para string para consistência com subjectData em subjects.js
            name: d.nome,
            questionCount: 0,
            icon: 'fa-book' // Ícone genérico para disciplinas
        }));

        // Inicializa o store com as sub-disciplinas
        store.setSubjects(formattedDisciplines); // Isso vai triggar o renderDisciplines

        // Esconde o loader e mostra a lista
        document.getElementById('disciplinesLoader').style.display = 'none';
        document.getElementById('disciplinesList').style.visibility = 'visible';

        // Adapte o subjects.js para renderizar essa lista (ou crie uma função aqui)
        renderDisciplines(formattedDisciplines); // Função auxiliar local ou adaptada de subjects.js
        attachCounterEvents(); // Anexa os eventos aos novos botões



        // Inicializa o sumário e o botão de início
        initializeSummary();
        initializeStartButton();

        // Animação de entrada
        animateEntrance(); // Adapte se necessário, ou use o existente em main.js

    } catch (error) {
        console.error("Erro ao carregar disciplinas:", error);
        document.getElementById('disciplinesLoader').style.display = 'none';
        alert("Erro ao carregar disciplinas. Por favor, tente novamente.");
    }
}

// Reutiliza a função de renderização de cards de disciplinas (baseada em subjects.js)
function renderDisciplines(disciplinas) {
    const disciplinesList = document.getElementById('disciplinesList');
    disciplinesList.innerHTML = ''; // Limpa o conteúdo existente

    disciplinas.forEach(discipline => {
        const disciplineItem = document.createElement('div');
        disciplineItem.className = 'subject-item'; // Reutilize a classe CSS existente
        disciplineItem.id = `discipline-${discipline.id}`; // ID único para a disciplina

        disciplineItem.innerHTML = `
                    <div class="subject-name">
                        <span><i class="fa-solid ${discipline.icon}"></i> ${discipline.name}</span>
                    </div>
                    <div class="counter-container">
                        <button class="counter-button decrease" data-subject="${discipline.id}" ${discipline.questionCount <= 0 ? 'disabled' : ''}>
                            -
                        </button>
                        <span class="counter-value" id="count-${discipline.id}">${discipline.questionCount}</span>
                        <button class="counter-button increase" data-subject="${discipline.id}" ${discipline.questionCount >= 20 ? 'disabled' : ''}>
                            +
                        </button>
                    </div>
                `;
        disciplinesList.appendChild(disciplineItem);
    });
}

// Reutiliza e adapta as funções de contador de subjects.js
function handleDecreaseCount(event) {
    const disciplineId = event.target.dataset.subject; // Pega o ID da disciplina
    const currentSubjectState = store.getState().subjects.find(s => s.id === disciplineId);

    if (currentSubjectState && currentSubjectState.questionCount > 0) {
        const newCount = currentSubjectState.questionCount - 1;
        store.updateSubjectCount(disciplineId, newCount); // Atualiza no store

        // Atualiza a UI
        const countElement = document.getElementById(`count-${disciplineId}`);
        if (countElement) countElement.textContent = newCount;

        // Atualiza o estado dos botões
        event.target.disabled = (newCount === 0);
        const increaseButton = document.querySelector(`.counter-button.increase[data-subject="${disciplineId}"]`);
        if (increaseButton && newCount < 20) {
            increaseButton.disabled = false;
        }
        updateStartButtonState(); // Atualiza o estado do botão "Iniciar"
    }
}

function handleIncreaseCount(event) {
    const disciplineId = event.target.dataset.subject; // Pega o ID da disciplina
    const currentSubjectState = store.getState().subjects.find(s => s.id === disciplineId);

    if (currentSubjectState && currentSubjectState.questionCount < 20) {
        const newCount = currentSubjectState.questionCount + 1;
        store.updateSubjectCount(disciplineId, newCount); // Atualiza no store

        // Atualiza a UI
        const countElement = document.getElementById(`count-${disciplineId}`);
        if (countElement) countElement.textContent = newCount;

        // Atualiza o estado dos botões
        event.target.disabled = (newCount === 20);
        const decreaseButton = document.querySelector(`.counter-button.decrease[data-subject="${disciplineId}"]`);
        if (decreaseButton && newCount > 0) {
            decreaseButton.disabled = false;
        }
        updateStartButtonState(); // Atualiza o estado do botão "Iniciar"
    }
}

// Função para atualizar o estado do botão "Iniciar Simulado"
function updateStartButtonState() {
    const startButton = document.getElementById('startButton');
    if (startButton) { // Garante que o botão existe antes de tentar manipulá-lo
        // O botão é habilitado se houver mais de 0 questões selecionadas
        startButton.disabled = !store.canStartSimulator();

        // Adiciona/remove classes para estilo visual (opcional)
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

// Adapte animateEntrance do main.js
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

// Adapte getSubjectNameById para obter o nome da matéria principal.
// Por enquanto, usei um mapa estático, mas o ideal seria um fetch ou um mapa pré-carregado.
async function getSubjectNameById(id) {
    // Este é um GET simples para o seu GetMateriaAtualServlet
    try {
        const response = await fetch(`${contextPath}/getMateriaAtual?idMateria=${id}`);
        const data = await response.json();
        return data.materia || `Matéria ID ${id}`;
    } catch (error) {
        console.error("Erro ao buscar nome da matéria:", error);
        return `Matéria ID ${id}`;
    }
}

