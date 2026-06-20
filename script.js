document.addEventListener('DOMContentLoaded', function () {
  const elements = document.querySelectorAll('.card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));

  // Create carousel dots for achievement sections
  function initializeAchievementDots(dotsContainerId) {
    const dotsContainer = document.querySelector(`#${dotsContainerId}`);
    if (!dotsContainer) return;

    // Find the achievement-scroll container (parent of dots container)
    const achievementSection = dotsContainer.closest('.Acheivement');
    const scrollContainer = achievementSection ? achievementSection.querySelector('.achievement-scroll') : null;
    
    if (!scrollContainer) return;

    const items = scrollContainer.querySelectorAll('.achievement-item');
    const itemCount = items.length;
    
    // Calculate how many items show per slide based on screen width
    function getItemsPerSlide() {
      const width = window.innerWidth;
      if (width <= 576) return 1;
      if (width <= 768) return 2;
      if (width <= 992) return 3;
      return 4;
    }

    const itemsPerSlide = getItemsPerSlide();
    const slideCount = Math.ceil(itemCount / itemsPerSlide);
    
    // Create dots
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => {
        const scrollPosition = (i * itemsPerSlide) * (items[0].offsetWidth + 16);
        scrollContainer.scrollLeft = scrollPosition;
        updateActiveDot(dotsContainer, i);
      };
      dotsContainer.appendChild(dot);
    }

    // Update dots on scroll
    scrollContainer.addEventListener('scroll', () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const itemWidth = items[0].offsetWidth + 16; // 16px is gap
      const activeSlide = Math.round(scrollLeft / (itemWidth * itemsPerSlide));
      updateActiveDot(dotsContainer, Math.min(activeSlide, slideCount - 1));
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      const newItemsPerSlide = getItemsPerSlide();
      if (newItemsPerSlide !== itemsPerSlide) {
        // Reinitialize on resize
        dotsContainer.innerHTML = '';
        initializeAchievementDots(dotsContainerId);
      }
    });
  }

  function updateActiveDot(dotsContainer, index) {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Initialize dots for both achievement sections
  initializeAchievementDots('achievementDots');
  initializeAchievementDots('achievementDots2');
});