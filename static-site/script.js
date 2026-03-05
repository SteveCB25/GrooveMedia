/**
 * The Groove Media - Main JavaScript
 * Handles: sticky header, mobile nav, smooth scroll, FAQ accordion, form submission
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========== STICKY HEADER ==========
  const header = document.getElementById('header');
  
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on load
  
  
  // ========== MOBILE NAVIGATION ==========
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  
  mobileToggle.addEventListener('click', function() {
    mobileToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
  
  // Close mobile nav when clicking a link
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });
  
  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
      mobileToggle.classList.remove('active');
      nav.classList.remove('active');
    }
  });
  
  
  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  
  // ========== FAQ ACCORDION ==========
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Close all other items
      faqItems.forEach(function(otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
  
  
  // ========== FORM SUBMISSION ==========
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      try {
        const formData = new FormData(contactForm);
        
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Success - show message and hide form
          contactForm.classList.add('hidden');
          formSuccess.classList.add('show');
          
          // Clear the form
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again or contact us directly.');
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send My Request';
      }
    });
  }
  
  
  // ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe cards and steps
  document.querySelectorAll('.card, .step, .checklist li').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
  
});
