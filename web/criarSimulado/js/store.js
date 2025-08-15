/**
 * State management for the ENEM simulator app
 * Manages application state and provides methods to update it
 */
class Store {
  constructor() {
    this.state = {
      selectedYear: 2024,
      subjects: [],
      totalQuestions: 0,
      // NOVO: Adicione esta propriedade ao estado
      simulationType: 'bySubjectAndYear' // Valor padrão. Pode ser 'bySubjectAndYear' ou 'bySubSubject'
    };

    this.listeners = [];
  }

  /**
   * Subscribe to store changes
   * @param {Function} listener - Callback function to be called on state change
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Get current state
   * @returns {Object} Current application state
   */
  getState() {
    return this.state;
  }

  /**
   * Set the selected year
   * @param {number} year - Year to be set (2019-2024)
   */
  setYear(year) {
    if (year >= 2009 && year <= 2024) {
      this.state.selectedYear = year;
      this.notify();
    }
  }

  /**
   * Set subjects list
   * @param {Array} subjects - List of subject objects
   */
  setSubjects(subjects) {
    this.state.subjects = subjects;
    this.calculateTotalQuestions();
    this.notify();
  }

  /**
   * Update question count for a specific subject
   * @param {string} subjectId - ID of the subject to update
   * @param {number} count - New question count
   */
  updateSubjectCount(subjectId, count) {
    const subject = this.state.subjects.find(s => s.id === subjectId);
    if (subject) {
      subject.questionCount = count;
      this.calculateTotalQuestions();
      this.notify();
    }
  }

  /**
   * Calculate the total number of questions across all subjects
   */
  calculateTotalQuestions() {
    this.state.totalQuestions = this.state.subjects.reduce(
        (total, subject) => total + subject.questionCount, 0
    );
  }

  /**
   * Get the estimated time to complete the test
   * @returns {number} Estimated time in minutes
   */
  getEstimatedTime() {
    // Assuming 3 minutes per question on average
    return this.state.totalQuestions * 3;
  }

  /**
   * Check if the simulator can be started
   * @returns {boolean} Whether the simulator can be started
   */
  canStartSimulator() {
    return this.state.totalQuestions > 0;
  }

  /**
   * Get the active subjects (with question count > 0)
   * @returns {Array} List of active subjects
   */
  getActiveSubjects() {
    return this.state.subjects.filter(subject => subject.questionCount > 0);
  }

  /**
   * Define o tipo de simulado atual.
   * @param {string} type - 'bySubjectAndYear' para simulados por matéria e ano,
   * 'bySubSubject' para simulados por sub-matéria.
   */
  setSimulationType(type) {
    this.state.simulationType = type;
    this.notify();
  }
}

// Create a singleton store
const store = new Store();
    