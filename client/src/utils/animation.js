import { useEffect } from 'react';

// Function to detect if element is in viewport
export const isElementInViewport = (el) => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
};

// Function to apply animation class when element is in viewport
export const animateOnScroll = () => {
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  animateElements.forEach(element => {
    if (isElementInViewport(element)) {
      const delay = element.dataset.delay || 0;
      setTimeout(() => {
        element.classList.add('animate-fade-in-up');
        element.classList.remove('opacity-0');
      }, delay);
    }
  });
};

// Hook to initialize scroll animations
export const useScrollAnimation = () => {
  useEffect(() => {
    // Initialize all animation elements
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
      el.classList.add('opacity-0');
    });
    
    // Initial check
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);
};

// Glassmorphism animation
export const applyGlassmorphism = (elementRef, config = {}) => {
  const defaults = {
    intensity: 0.2,
    lightOpacity: 0.2,
    radius: 15
  };
  
  const options = { ...defaults, ...config };
  
  if (!elementRef.current) return;
  
  const element = elementRef.current;
  
  const handleMouseMove = (e) => {
    const { left, top, width, height } = element.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    // Calculate the gradient position
    const gradientX = 100 * x;
    const gradientY = 100 * y;
    
    // Apply gradient overlay effect
    element.style.background = `
      linear-gradient(
        135deg, 
        rgba(255, 255, 255, ${options.lightOpacity}) ${gradientX}%, 
        rgba(255, 255, 255, 0) ${gradientX + 50}%
      ),
      var(--bg-color, rgba(255, 255, 255, 0.1))
    `;
    
    // Apply subtle transform
    element.style.transform = `
      perspective(1000px)
      rotateX(${(y - 0.5) * options.intensity * -10}deg)
      rotateY(${(x - 0.5) * options.intensity * 10}deg)
    `;
  };
  
  const handleMouseLeave = () => {
    // Reset styles
    element.style.background = 'var(--bg-color, rgba(255, 255, 255, 0.1))';
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  // Set initial values
  element.style.borderRadius = `${options.radius}px`;
  element.style.transition = 'transform 0.2s ease-out, background 0.3s ease';
  element.style.transformStyle = 'preserve-3d';
  element.style.setProperty('--bg-color', 'rgba(255, 255, 255, 0.1)');
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

export default {
  isElementInViewport,
  animateOnScroll,
  useScrollAnimation,
  applyGlassmorphism
}; 