/**
 * Subject counter module for the ENEM simulator
 * Handles the display and updates of subject question counts
 */

/**
 * Initialize subject counter values and event listeners
 */
function initializeSubjectCounters() {
  // This function is called after subjects are initialized
  // The event listeners are attached in the subjects.js file
  
  // Subscribe to store changes to update the UI
  store.subscribe(updateSubjectCounters);
}

/**
 * Update subject counter displays based on store state
 */
function updateSubjectCounters() {
  const state = store.getState();
  
  state.subjects.forEach(subject => {
    const countElement = document.getElementById(`count-${subject.id}`);
    if (countElement) {
      countElement.textContent = subject.questionCount;
    }
    
    // Update decrease button state
    const decreaseButton = document.querySelector(`.counter-button.decrease[data-subject="${subject.id}"]`);
    if (decreaseButton) {
      decreaseButton.disabled = subject.questionCount <= 0;
    }
    
    // Update increase button state
    const increaseButton = document.querySelector(`.counter-button.increase[data-subject="${subject.id}"]`);
    if (increaseButton) {
      increaseButton.disabled = subject.questionCount >= 20;
    }
  });
}

/**
 * Add animation to a counter when it changes
 * @param {string} subjectId - ID of the subject whose counter changed
 */
function animateCounterChange(subjectId) {
  const countElement = document.getElementById(`count-${subjectId}`);
  if (countElement) {
    // Add and remove a class to trigger animation
    countElement.classList.add('counter-change');
    setTimeout(() => {
      countElement.classList.remove('counter-change');
    }, 300);
  }
}