/**
 * Subjects module for the ENEM simulator
 * Contains the list of available subjects and renders the subject selection UI
 */

// Subject data with unique IDs and initial question counts
const subjectData = [
    {id: '3', name: 'Portugu\u00eas', questionCount: 0, icon: 'fa-pen-nib'}, // 📝
    {id: '10', name: 'Matem\u00e1tica', questionCount: 0, icon: 'fa-square-root-variable'}, // 🔢
    {id: '14', name: 'Hist\u00f3ria', questionCount: 0, icon: 'fa-landmark'}, // 📜
    {id: '15', name: 'Geografia', questionCount: 0, icon: 'fa-globe-americas'}, // 🌎
    {id: '11', name: 'Biologia', questionCount: 0, icon: 'fa-dna'}, // 🧬
    {id: '13', name: 'Qu\u00edmica', questionCount: 0, icon: 'fa-vial'}, // ⚗️
    {id: '12', name: 'F\u00edsica', questionCount: 0, icon: 'fa-atom'}, // ⚛️
    {id: '5', name: 'Ingl\u00eas', questionCount: 0, icon: 'fa-flag-usa'}, // 🇬🇧
    {id: '6', name: 'Espanhol', questionCount: 0, icon: 'fa-flag'}, // 🇪🇸
    {id: '4', name: 'Literatura', questionCount: 0, icon: 'fa-book-open'}, // 📚
    {id: '16', name: 'Filosofia', questionCount: 0, icon: 'fa-brain'}, // 🧠
    {id: '17', name: 'Sociologia', questionCount: 0, icon: 'fa-users'}, // 👥
    {id: '9', name: 'Tecnologias da Informa\u00e7\u00e3o', questionCount: 0, icon: 'fa-computer'}, // 💻
    {id: '8', name: 'Artes', questionCount: 0, icon: 'fa-palette'}, // 🎨
    {id: '7', name: 'Educa\u00e7\u00e3o F\u00edsica', questionCount: 0, icon: 'fa-person-running'} // 🏃

];




/**
 * Initialize subjects in the store and render the subject selection UI
 */
function initializeSubjects() {
    // Set the subjects in the store
    store.setSubjects([...subjectData]);

    // Render the subjects list
    renderSubjects();
}

/**
 * Render the subjects list in the UI
 */
function renderSubjects() {
    const subjectsList = document.getElementById('subjectsList');
    subjectsList.innerHTML = '';

    const subjects = store.getState().subjects;

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

    // Add event listeners to counter buttons
    attachCounterEvents();


    document.querySelectorAll('.card, .summary-card, .subjects-list')
            .forEach(el => {
                el.style.visibility = 'visible';
            });
}

/**
 * Attach event listeners to the counter buttons
 */
function attachCounterEvents() {
    const decreaseButtons = document.querySelectorAll('.counter-button.decrease');
    const increaseButtons = document.querySelectorAll('.counter-button.increase');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', handleDecreaseCount);
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', handleIncreaseCount);
    });
}

/**
 * Handle decrease button click
 * @param {Event} event - Click event
 */
function handleDecreaseCount(event) {
    const subjectId = event.target.dataset.subject;
    const subject = store.getState().subjects.find(s => s.id === subjectId);

    if (subject && subject.questionCount > 0) {
        const newCount = subject.questionCount - 1;
        store.updateSubjectCount(subjectId, newCount);

        // Update UI
        const countElement = document.getElementById(`count-${subjectId}`);
        countElement.textContent = newCount;

        // Disable decrease button if count is 0
        if (newCount === 0) {
            event.target.disabled = true;
        }

        // Enable increase button if count is less than 20
        const increaseButton = document.querySelector(`.counter-button.increase[data-subject="${subjectId}"]`);
        if (newCount < 20) {
            increaseButton.disabled = false;
        }

        // Update start button state
        updateStartButtonState();
    }
}

/**
 * Handle increase button click
 * @param {Event} event - Click event
 */
function handleIncreaseCount(event) {
    const subjectId = event.target.dataset.subject;
    const subject = store.getState().subjects.find(s => s.id === subjectId);

    if (subject && subject.questionCount < 20) {
        const newCount = subject.questionCount + 1;
        store.updateSubjectCount(subjectId, newCount);

        // Update UI
        const countElement = document.getElementById(`count-${subjectId}`);
        countElement.textContent = newCount;

        // Disable increase button if count is 20
        if (newCount === 20) {
            event.target.disabled = true;
        }

        // Enable decrease button if count is greater than 0
        const decreaseButton = document.querySelector(`.counter-button.decrease[data-subject="${subjectId}"]`);
        if (newCount > 0) {
            decreaseButton.disabled = false;
        }

        // Update start button state
        updateStartButtonState();
    }
}

/**
 * Update the state of the start button based on total questions
 */
function updateStartButtonState() {
    const startButton = document.getElementById('startButton');
    startButton.disabled = !store.canStartSimulator();
}