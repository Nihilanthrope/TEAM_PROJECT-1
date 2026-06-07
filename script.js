// ════════════════════════════════════════════════════════════════════════════════
//                         PROJECT LABORATORY - MAIN SCRIPT
// ════════════════════════════════════════════════════════════════════════════════

// ── 1. CUSTOM CURSOR ─────────────────────────────────────────────────────────
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => {
    cursorRing.style.transform = 'translate(-50%, -50%) scale(0.8)';
  });

  document.addEventListener('mouseup', () => {
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}

// ── 2. SCROLL ANIMATIONS (Reveal on Scroll) ─────────────────────────────────
function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

// ── 3. SMOOTH SCROLL TO ANCHOR ──────────────────────────────────────────────
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── 4. NAVBAR FADE ON SCROLL ────────────────────────────────────────────────
function setupNavbarScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    if (scrollTop > 50) {
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
    } else {
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.04)';
    }
  });
}

// ── 5. FORM VALIDATION ──────────────────────────────────────────────────────
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

// ── 6. CONTACT FORM HANDLER ─────────────────────────────────────────────────
function setupContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showNotification('Please enter a valid email', 'error');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        showNotification('Failed to send message. Try again.', 'error');
      }
    } catch (error) {
      showNotification('Cannot reach server. Check your connection.', 'error');
      console.error('Contact form error:', error);
    }
  });
}

// ── 7. NOTIFICATION SYSTEM ──────────────────────────────────────────────────
function showNotification(message, type = 'info') {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
  }

  const notification = document.createElement('div');
  const bgColor = type === 'success' ? '#4caf8a' : type === 'error' ? '#ff5a5a' : '#5a7aff';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  notification.style.cssText = `
    background: ${bgColor};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 300px;
  `;
  notification.textContent = `${icon} ${message}`;

  container.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Add animations to style tag
function injectStyles() {
  if (document.getElementById('helper-styles')) return;

  const style = document.createElement('style');
  style.id = 'helper-styles';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(350px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(350px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ── 8. LAZY LOAD IMAGES ─────────────────────────────────────────────────────
function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// ── 9. ACCESSIBILITY - KEYBOARD NAVIGATION ──────────────────────────────────
function setupKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 's') {
      document.querySelector('main')?.focus();
    }
    if (e.altKey && e.key === 't') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ── 10. DARK MODE TOGGLE (Optional) ─────────────────────────────────────────
function setupDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (!darkModeToggle) return;

  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) document.body.classList.add('dark-mode');

  darkModeToggle.addEventListener('click', () => {
    const isCurrentlyDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isCurrentlyDark);
  });
}

// ── 11. UTILITY FUNCTIONS ───────────────────────────────────────────────────
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function getElement(selector) {
  return document.querySelector(selector);
}

function getElements(selector) {
  return document.querySelectorAll(selector);
}

function addClass(element, className) {
  element?.classList.add(className);
}

function removeClass(element, className) {
  element?.classList.remove(className);
}

function toggleClass(element, className) {
  element?.classList.toggle(className);
}

function log(message, data = null) {
  console.log(`[PROJECT LAB] ${message}`, data || '');
}

// ── 12. INITIALIZE ALL FUNCTIONS ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  setupScrollReveal();
  setupSmoothScroll();
  setupNavbarScroll();
  setupContactForm();
  setupLazyLoading();
  setupKeyboardNav();
  setupDarkMode();
  log('All scripts initialized successfully');
});
