// Header scroll effect
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const navMobile = document.querySelector('.nav-mobile');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile menu
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navMobile.classList.toggle('active');
});

// Close mobile menu when clicking a link
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMobile.classList.remove('active');
  });
});

// Testimonials carousel
const track = document.querySelector('.carousel-track');
const slides = track.children;
const prevButton = document.querySelector('.carousel-arrow.prev');
const nextButton = document.querySelector('.carousel-arrow.next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;
const slidesToShow = window.innerWidth >= 768 ? 2 : 1;
const maxIndex = slides.length - slidesToShow;

// Create dots
for (let i = 0; i <= maxIndex; i++) {
  const dot = document.createElement('button');
  dot.classList.add('carousel-dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

function updateDots() {
  document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function updateSlidePosition() {
  const slideWidth = 100 / slidesToShow;
  track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
  updateDots();
}

function goToSlide(index) {
  currentIndex = index;
  updateSlidePosition();
}

function nextSlide() {
  currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
  updateSlidePosition();
}

function prevSlide() {
  currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
  updateSlidePosition();
}

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

// Auto-scroll
let autoScrollInterval = setInterval(nextSlide, 5000);

track.addEventListener('mouseenter', () => {
  clearInterval(autoScrollInterval);
});

track.addEventListener('mouseleave', () => {
  autoScrollInterval = setInterval(nextSlide, 5000);
});

// Update carousel on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const newSlidesToShow = window.innerWidth >= 768 ? 2 : 1;
    if (newSlidesToShow !== slidesToShow) {
      location.reload();
    }
  }, 250);
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.benefit-card, .step, .testimonial-card').forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'all 0.5s ease-out';
  observer.observe(element);
});