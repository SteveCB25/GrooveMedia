/**
 * The Groove Media - Script
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========== STICKY HEADER ==========
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  
  // ========== MOBILE NAV ==========
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  
  mobileToggle.addEventListener('click', function() {
    mobileToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
  
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });
  
  
  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  
  // ========== FAQ ACCORDION ==========
  document.querySelectorAll('.faq-item').forEach(function(item) {
    item.querySelector('.faq-question').addEventListener('click', function() {
      document.querySelectorAll('.faq-item').forEach(function(other) {
        if (other !== item) other.classList.remove('active');
      });
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
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          // Fire Facebook Pixel event
          if (typeof fbq === 'function') {
            fbq('track', 'Schedule');
          }
          contactForm.classList.add('hidden');
          formSuccess.classList.add('show');
          contactForm.reset();
        } else {
          throw new Error('Failed');
        }
      } catch (error) {
        alert('Something went wrong. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get My Free Website Check';
      }
    });
  }
  
  
  // ========== INDUSTRY CARDS -> FORM WITH SERVICE SELECT ==========
  const industryCards = document.querySelectorAll('.industry-card');
  const serviceSelect = document.getElementById('service');
  
  industryCards.forEach(function(card) {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the service type from the data attribute
      const serviceType = card.getAttribute('data-service');
      
      // Scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Set the dropdown value after scroll
      setTimeout(function() {
        if (serviceSelect && serviceType) {
          serviceSelect.value = serviceType;
          // Add a highlight effect
          serviceSelect.style.borderColor = '#FF6B00';
          serviceSelect.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.2)';
          setTimeout(function() {
            serviceSelect.style.borderColor = '';
            serviceSelect.style.boxShadow = '';
          }, 2000);
        }
      }, 600);
    });
  });
  
  
  // ========== SCROLL ANIMATIONS ==========
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.problem-card, .step, .checklist li, .industry-card').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
  
});
