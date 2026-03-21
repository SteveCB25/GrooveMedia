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
  
  
  // ========== MISSED CALL DEMO ==========
  var demoRunning = false;

  var demoConvo = [
    { type: 'missed', time: '2:14 PM' },
    { type: 'out', text: "Hey Sarah! This is Mike @ Cool Breeze HVAC 👋 Sorry I missed your call — I'm on a job right now. What can I help you with?", time: '2:14 PM', label: 'Sent automatically' },
    { type: 'in',  text: "Hi! My AC stopped working this morning and it's supposed to be 94° tomorrow 😰 Do you have any openings?", time: '2:15 PM' },
    { type: 'out', text: 'Absolutely — we have same-day and next-morning slots in your area. Can you confirm your zip code so I can check availability?', time: '2:15 PM', label: 'Sent automatically' },
    { type: 'in',  text: '21210 — Federal Hill area', time: '2:16 PM' },
    { type: 'out', text: "Perfect — we're in your area tomorrow at 8AM or 11AM. Which works better? I'll confirm the tech right now 🔧", time: '2:16 PM', label: 'Sent automatically' },
    { type: 'in',  text: '8AM works!! You just saved my summer 😅', time: '2:17 PM' }
  ];

  var demoDelays = [500, 2200, 4400, 6600, 8600, 10600, 12800];
  var demoTimers = [];

  window.runDemo = function() {
    if (demoRunning) return;
    demoRunning = true;

    var body = document.getElementById('smsBody');
    var btn  = document.getElementById('demoBtn');
    if (!body || !btn) return;

    btn.textContent = '▶ Playing...';
    btn.disabled = true;
    body.innerHTML = '';

    demoTimers.forEach(clearTimeout);
    demoTimers = [];

    demoConvo.forEach(function(item, i) {
      var t = setTimeout(function() {
        if (item.type === 'out') {
          // show typing dots first
          var dots = document.createElement('div');
          dots.className = 'typing-dots';
          dots.innerHTML = '<span></span><span></span><span></span>';
          body.appendChild(dots);
          body.scrollTop = body.scrollHeight;

          var t2 = setTimeout(function() {
            body.removeChild(dots);
            appendBubble(body, item);
            body.scrollTop = body.scrollHeight;
          }, 700);
          demoTimers.push(t2);
        } else {
          appendBubble(body, item);
          body.scrollTop = body.scrollHeight;
        }
      }, demoDelays[i]);
      demoTimers.push(t);
    });

    var done = setTimeout(function() {
      demoRunning = false;
      btn.textContent = '▶ Trigger Demo';
      btn.disabled = false;
    }, demoDelays[demoConvo.length - 1] + 1500);
    demoTimers.push(done);
  };

  function appendBubble(body, item) {
    if (item.type === 'missed') {
      var el = document.createElement('div');
      el.className = 'sms-missed';
      el.innerHTML = '<span>📵 Missed Call — ' + item.time + '</span>';
      body.appendChild(el);
      return;
    }
    var wrap = document.createElement('div');
    wrap.className = 'sms-bubble ' + (item.type === 'out' ? 'out' : 'in');
    var inner = document.createElement('div');
    inner.className = 'bubble-inner';
    var text = document.createElement('div');
    text.className = 'bubble-text';
    text.textContent = item.text;
    var time = document.createElement('div');
    time.className = 'bubble-time';
    time.textContent = item.time + (item.label ? ' · ' + item.label : '');
    inner.appendChild(text);
    inner.appendChild(time);
    wrap.appendChild(inner);
    body.appendChild(wrap);
  }

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
