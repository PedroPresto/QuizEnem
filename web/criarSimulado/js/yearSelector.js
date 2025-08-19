/**
 * Módulo do seletor de ano para o simulado ENEM
 * Gerencia a funcionalidade do novo seletor híbrido (stepper com grid).
 */

// --- Configuração ---
// Defina aqui todos os anos disponíveis. O primeiro da lista será o padrão.
const AVAILABLE_YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009];

// --- Elementos do DOM ---
let yearDisplayBtn, prevYearBtn, nextYearBtn, yearGrid, stepperContainer;

/***
 * Função principal que inicializa todo o seletor de ano.
 */
function initializeYearSelector() {
  // 1. Pega os elementos do DOM
  yearDisplayBtn = document.getElementById('yearDisplayBtn');
  prevYearBtn = document.getElementById('prevYearBtn');
  nextYearBtn = document.getElementById('nextYearBtn');
  yearGrid = document.getElementById('yearGrid');
  // Usamos o container para a lógica de "clicar fora"
  stepperContainer = document.querySelector('.stepper-display-container');

  // 2. Preenche o grid com os botões dos anos
  populateYearGrid();

  // 3. Define o estado inicial a partir do primeiro ano da lista
  const initialYear = AVAILABLE_YEARS[0];
  store.setYear(initialYear);
  updateView(initialYear);

  // 4. Adiciona os event listeners
  addEventListeners();
}

/**
 * Preenche o grid com um botão para cada ano disponível.
 */
function populateYearGrid() {
  yearGrid.innerHTML = ''; // Limpa o grid para garantir
  AVAILABLE_YEARS.forEach(year => {
    const chip = document.createElement('button');
    chip.className = 'year-chip';
    chip.textContent = year;
    chip.dataset.year = year; // Adiciona o ano ao dataset para fácil acesso
    yearGrid.appendChild(chip);
  });
}

/**
 * Adiciona todos os event listeners necessários para o componente.
 */
function addEventListeners() {
  // Abrir/fechar o grid ao clicar no display do ano
  yearDisplayBtn.addEventListener('click', () => {
    yearGrid.classList.toggle('show');
  });

  // Navegar para o ano anterior
  prevYearBtn.addEventListener('click', handlePrevNextClick.bind(null, 1));

  // Navegar para o próximo ano
  nextYearBtn.addEventListener('click', handlePrevNextClick.bind(null, -1));

  // Selecionar um ano ao clicar em um "chip" no grid
  yearGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('year-chip')) {
      const selectedYear = parseInt(event.target.dataset.year);
      selectYear(selectedYear);
    }
  });

  // Fechar o grid se o usuário clicar fora dele
  document.addEventListener('click', (event) => {
    if (!stepperContainer.contains(event.target)) {
      yearGrid.classList.remove('show');
    }
  });
}

/**
 * Lida com os cliques nos botões de anterior/próximo.
 * @param {number} direction - -1 para anterior, 1 para próximo.
 */
function handlePrevNextClick(direction) {
  const currentYear = store.getState().selectedYear;
  const currentIndex = AVAILABLE_YEARS.indexOf(currentYear);

  // Calcula o novo índice, garantindo que ele "dê a volta" na lista (loop)
  let newIndex = (currentIndex + direction + AVAILABLE_YEARS.length) % AVAILABLE_YEARS.length;

  selectYear(AVAILABLE_YEARS[newIndex]);
}


/**
 * Função central para selecionar um novo ano.
 * @param {number} year - O ano a ser selecionado.
 */
function selectYear(year) {
  store.setYear(year); // Atualiza o estado global
  updateView(year); // Atualiza a interface
  yearGrid.classList.remove('show'); // Fecha o grid após a seleção
}

/**
 * Atualiza todos os elementos visuais com base no ano selecionado.
 * @param {number} year - O ano ativo.
 */
function updateView(year) {
  // 1. Atualiza o texto do botão principal
  yearDisplayBtn.textContent = year;

  // 2. Anima a mudança (efeito visual opcional)
  animateYearChange(yearDisplayBtn);

  // 3. Atualiza qual "chip" está ativo no grid
  const chips = yearGrid.querySelectorAll('.year-chip');
  chips.forEach(chip => {
    if (parseInt(chip.dataset.year) === year) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

/**
 * Anima a mudança do ano com um efeito de "flash".
 * @param {HTMLElement} element - O elemento a ser animado.
 */
function animateYearChange(element) {
  element.style.transition = 'none'; // Reseta a transição para o efeito funcionar
  element.style.backgroundColor = 'var(--primary-color-dark)';
  element.style.color = '#FFFFFF';

  setTimeout(() => {
    element.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    element.style.backgroundColor = '';
    element.style.color = '';
  }, 150);
}

// --- Integração com o Store ---
// O subscribe foi removido daqui pois a atualização da view já é chamada
// diretamente pela função selectYear, que é a única que altera o ano neste componente.
// Isso evita loops ou atualizações desnecessárias. Se outro componente puder
// mudar o ano, o subscribe precisará ser reativado.

// Exemplo de como seria com subscribe, se necessário:
/*
store.subscribe(() => {
    const state = store.getState();
    updateView(state.selectedYear);
});
*/