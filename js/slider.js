let currentSlide = 0;
let slideInterval;

function initializeSlider() {
  const slider = document.getElementById('slider');
  const dots = document.querySelectorAll('.dot');

  if (!slider) {
    return;
  }

  function updateSlider() {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.remove('opacity-0');
        slide.classList.add('opacity-100');
      } else {
        slide.classList.remove('opacity-100');
        slide.classList.add('opacity-0');
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
      dot.classList.toggle('bg-white', index === currentSlide);
      dot.classList.toggle('bg-opacity-50', index !== currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % 3;
    updateSlider();
  }

  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
  }

  // Event listeners
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  // Auto-play
  slideInterval = setInterval(nextSlide, 5000);

  // Pause on hover
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', () => {
      slideInterval = setInterval(nextSlide, 5000);
    });
  }

  // Initialize first slide
  updateSlider();
}