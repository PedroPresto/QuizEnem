/**
 * Main application entry point for the ENEM simulator
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize application components
  initializeApplication();
});

/**
 * Initialize all application components
 */
function initializeApplication() {
  // Initialize subjects first to populate the store
  initializeSubjects();
  
  // Initialize year selector
  initializeYearSelector();
  
  // Initialize subject counters
  initializeSubjectCounters();
  
  // Initialize summary display
  initializeSummary();
  
  // Initialize start button
  initializeStartButton();
  
  // Add animation to the card
  animateEntrance();
}

/**
 * Animate the entrance of the application card
 */
function animateEntrance() {
  const card = document.querySelector('.card');
  
  // Start with opacity 0 and transform
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  
  // After a short delay, animate to full opacity
  setTimeout(() => {
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 100);
}

/**
 * Handle application errors
 * @param {Error} error - Error object
 */
function handleError(error) {
  console.error('Application error:', error);
  // In a production application, we would show a user-friendly error message
}

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  handleError(error || new Error(message));
  return true;
};