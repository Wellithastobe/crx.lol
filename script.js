/**
 * Smooth Scroll JS
 * new SmoothScroll(target,speed,smooth)
 */

function init() {
  new SmoothScroll(document, 120, 12)
}

function SmoothScroll(target, speed, smooth) {
  if (target === document)
    target = (document.scrollingElement
      || document.documentElement
      || document.body.parentNode
      || document.body) // cross browser support for document scrolling

  var moving = false
  var pos = target.scrollTop
  var frame = target === document.body
    && document.documentElement
    ? document.documentElement
    : target // safari is the new IE

  target.addEventListener('mousewheel', scrolled, { passive: false })
  target.addEventListener('DOMMouseScroll', scrolled, { passive: false })

  function scrolled(e) {
    e.preventDefault(); // disable default scrolling

    var delta = normalizeWheelDelta(e)

    pos += -delta * speed
    pos = Math.max(0, Math.min(pos, target.scrollHeight - frame.clientHeight)) // limit scrolling

    if (!moving) update()
  }

  function normalizeWheelDelta(e) {
    if (e.detail) {
      if (e.wheelDelta)
        return e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1) // Opera
      else
        return -e.detail / 3 // Firefox
    } else
      return e.wheelDelta / 120 // IE,Safari,Chrome
  }

  function update() {
    moving = true

    var delta = (pos - target.scrollTop) / smooth

    target.scrollTop += delta

    if (Math.abs(delta) > 0.5)
      requestFrame(update)
    else
      moving = false
  }

  var requestFrame = function () { // requestAnimationFrame cross browser
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (func) {
        window.setTimeout(func, 1000 / 50);
      }
    );
  }()
}

// FAQ Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scrolling first
    init();
    
    // Initialize all animations and interactions
    initScrollAnimations();
    initFAQ();
    initSmoothScrolling();
    initHeaderScroll();
    initCounters();
    initMobileMenu();
    initFormInteractions();
    
    // Scroll-triggered animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }
    
    // FAQ Toggle with smooth animations
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = '0px';
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0px';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }
    
    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Header background and size changes on scroll
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
                header.style.background = 'rgba(10, 10, 15, 0.95)';
            } else {
                header.classList.remove('scrolled');
                header.style.background = 'rgba(10, 10, 15, 0.8)';
            }
        });
    }
    
    // Animated counters
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = formatNumber(Math.floor(current));
        }, 16);
    }
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num.toString();
    }
    
    // Mobile menu toggle
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
    }
    
    // Form interactions
    function initFormInteractions() {
        // Hero form
        const usernameInput = document.getElementById('usernameInput');
        const claimButton = document.querySelector('.hero-form .btn');
        
        if (usernameInput) {
            usernameInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length > 0) {
                    claimButton.textContent = `Claim velxe.com/${value}`;
                } else {
                    claimButton.textContent = 'Claim Now';
                }
            });
        }
        
        // CTA card form
        const ctaUsernameInput = document.querySelector('.cta-username-input');
        const ctaButton = document.querySelector('.cta-btn');
        
        if (ctaUsernameInput) {
            ctaUsernameInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length > 0) {
                    ctaButton.textContent = `Claim velxe.com/${value}`;
                } else {
                    ctaButton.textContent = 'Claim Now';
                }
            });
        }
    }
    
    // Add hover effects to cards
    document.querySelectorAll('.pricing-card, .stat-item').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

