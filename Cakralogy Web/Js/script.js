document.addEventListener('DOMContentLoaded', () => {
  const topnav     = document.getElementById('topnav');
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  const allNavLinks = document.querySelectorAll('a[data-nav]');


  if (!topnav) console.warn('Warning: #topnav not found in DOM.');
  if (!menuBtn) console.warn('Warning: #menu-btn not found in DOM.');
  if (!mobileMenu) console.warn('Warning: #mobileMenu not found in DOM.');

  function toggleMobileMenu(forceState) {
    if (!menuBtn || !mobileMenu) return;
    const willOpen = typeof forceState === 'boolean'
      ? forceState
      : !mobileMenu.classList.contains('open');

    mobileMenu.classList.toggle('open', willOpen);
    menuBtn.setAttribute('aria-expanded', String(willOpen));
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (allNavLinks.length) {
    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) toggleMobileMenu(false);
      });
    });
  }

  
  document.addEventListener('click', (e) => {
    if (window.innerWidth >= 768) return;
    if (!mobileMenu || !menuBtn) return;

    const clickInsideMenu  = mobileMenu.contains(e.target);
    const clickOnButton    = menuBtn.contains(e.target);
    if (!clickInsideMenu && !clickOnButton) {
      toggleMobileMenu(false);
    }
  });

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMobileMenu(false);
  });

 
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenu) {
      mobileMenu.classList.remove('open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  
  window.addEventListener('scroll', () => {
    if (!topnav) return;
    if (window.scrollY > 8) topnav.classList.add('is-sticky');
    else topnav.classList.remove('is-sticky');
  });
  const sections = document.querySelectorAll('main section[id]');
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      
      let visibleEntries = entries.filter(en => en.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visibleEntries[0].target.getAttribute('id');
        
        document.querySelectorAll('a[data-nav]').forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
        });
      } else {
        
        let current = '';
        sections.forEach(sec => {
          if (sec.offsetTop <= window.scrollY + window.innerHeight / 2) current = sec.id;
        });
        document.querySelectorAll('a[data-nav]').forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
        });
      }
    }, {
      root: null,
      rootMargin: '0px 0px -50% 0px',
      threshold: [0.1, 0.25, 0.5, 0.75]
    });

    sections.forEach(sec => observer.observe(sec));
  }
});
