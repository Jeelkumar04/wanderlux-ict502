/* main.js
   - Mobile nav toggle
   - Active link highlight
   - Scroll reveal animations (IntersectionObserver)
   - Rotating hero banner
*/

(function () {
  // Mobile nav
  const toggle = document.querySelector('[data-nav-toggle]');
  const links = document.querySelector('[data-nav-links]');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Active link based on pathname
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Rotating banner (Home only if banner exists)
  const bannerImg = document.querySelector('[data-banner-img]');
  const bannerTitle = document.querySelector('[data-banner-title]');
  const bannerSub = document.querySelector('[data-banner-sub]');
  if (bannerImg && bannerTitle && bannerSub) {
    const slides = [
      {
        src: 'assets/hero1.jpg',
        title: 'Bali Escapes',
        sub: 'Beach, culture, and wellness retreats tailored to your style.',
        alt: 'Sunny tropical beach in Bali with palm trees.'
      },
      {
        src: 'assets/hero2.jpg',
        title: 'Tokyo City Lights',
        sub: 'Modern city adventures with guided food and culture tours.',
        alt: 'Tokyo skyline at night with bright city lights.'
      },
      {
        src: 'assets/hero3.jpg',
        title: 'Swiss Alps',
        sub: 'Scenic mountain stays with curated rail and hiking experiences.',
        alt: 'Snowy mountains in the Swiss Alps.'
      }
    ];

    let i = 0;
    const setSlide = (idx) => {
      const s = slides[idx];
      bannerImg.src = s.src;
      bannerImg.alt = s.alt;
      bannerTitle.textContent = s.title;
      bannerSub.textContent = s.sub;
    };

    setSlide(i);
    window.setInterval(() => {
      i = (i + 1) % slides.length;
      setSlide(i);
    }, 4500);
  }
})();
