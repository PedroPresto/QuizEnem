// Form handling
const form = document.getElementById('questionForm');
const clearButton = document.getElementById('clearForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const questionData = {
    subject: formData.get('subject'),
    year: formData.get('year'),
    statement: formData.get('statement'),
    supportText: formData.get('supportText'),
    alternatives: {
      a: formData.get('alternative_a'),
      b: formData.get('alternative_b'),
      c: formData.get('alternative_c'),
      d: formData.get('alternative_d'),
      e: formData.get('alternative_e'),
    },
    correctAnswer: formData.get('correct_answer'),
  };

  console.log('Question Data:', questionData);
  // Here you would typically send the data to your backend

  // Show success message
  const toast = document.createElement('div');
  toast.className = 'success-toast toast-enter';
  toast.textContent = 'Questão salva com sucesso!';
  document.body.appendChild(toast);

  // Clear form for next question
  form.reset();

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateY(100%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
});

clearButton.addEventListener('click', () => {
  form.reset();
});

// Add autoresize to textareas
document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });
});