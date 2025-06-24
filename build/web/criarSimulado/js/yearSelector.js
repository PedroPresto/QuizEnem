/**
 * Year selector module for the ENEM simulator
 * Handles the year slider functionality
 */

/**
 * Initialize the year selector
 */
function initializeYearSelector() {
  const yearSlider = document.getElementById('yearSlider');
  const selectedYearElement = document.getElementById('selectedYear');
  
  // Set initial value
  selectedYearElement.textContent = yearSlider.value;
  store.setYear(parseInt(yearSlider.value));
  
  // Add event listener for slider change
  yearSlider.addEventListener('input', handleYearChange);
}

/**
 * Handle year slider change
 * @param {Event} event - Input event from the slider
 */
function handleYearChange(event) {
  const year = parseInt(event.target.value);
  const selectedYearElement = document.getElementById('selectedYear');
  
  // Update the displayed year
  selectedYearElement.textContent = year;
  
  // Animate the color change
  animateYearChange(selectedYearElement);
  
  // Update the store
  store.setYear(year);
}

/**
 * Animate the year change with a color transition
 * @param {HTMLElement} element - The element to animate
 */
function animateYearChange(element) {
  // Add highlight class for animation
  element.style.color = '#34d399';
  
  // After a short delay, return to normal color
  setTimeout(() => {
    element.style.color = '';
  }, 300);
}

/**
 * Update the year slider and display based on the store state
 */
function updateYearDisplay() {
  const state = store.getState();
  const yearSlider = document.getElementById('yearSlider');
  const selectedYearElement = document.getElementById('selectedYear');
  
  yearSlider.value = state.selectedYear;
  selectedYearElement.textContent = state.selectedYear;
}

// Subscribe to store changes to update the year display
store.subscribe(() => {
  updateYearDisplay();
});