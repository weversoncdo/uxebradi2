(function () {
  'use strict';

  function loadLazyImages() {
    document.querySelectorAll('img[data-src], img[data-srcset], source[data-srcset]').forEach(function (el) {
      if (el.tagName.toLowerCase() === 'img') {
        var src = el.getAttribute('data-src');
        var srcset = el.getAttribute('data-srcset');
        if (src) el.setAttribute('src', src);
        if (srcset) el.setAttribute('srcset', srcset);
      } else {
        var sourceSrcset = el.getAttribute('data-srcset');
        if (sourceSrcset) el.setAttribute('srcset', sourceSrcset);
      }
      el.classList.remove('lazy');
    });

    document.querySelectorAll('[data-bg], [data-background-image]').forEach(function (el) {
      var bg = el.getAttribute('data-bg') || el.getAttribute('data-background-image');
      if (bg) el.style.backgroundImage = 'url("' + bg.replace(/"/g, '\\"') + '")';
    });
  }

  function init() {
    loadLazyImages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', loadLazyImages);
})();



/* ========================================================
   COMPORTAMENTO E INTERAÇÕES DO NOVO FOOTER
   ======================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const toastEl = document.getElementById('inst-toast');
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3000);
  }
  const footerLinks = document.querySelectorAll('#institutional-footer a');
  footerLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const scrollTarget = link.getAttribute('data-scroll');
      const action = link.getAttribute('data-action');
      const href = link.getAttribute('href');
      if (scrollTarget) {
        const targetElement = document.getElementById(scrollTarget + '-section');
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      if (action === 'portal') {
        e.preventDefault();
        showToast('Abrindo Portal do Aluno / Ulife...');
        return;
      }
      if (href && href.startsWith('#') && href !== '#') {
        const targetElement = document.querySelector(href);
        if (!targetElement) {
          e.preventDefault();
          showToast('Acessando ' + link.textContent.trim() + '...');
        }
      }
    });
  });
  const btnPrivacidade = document.getElementById('btn-canal-privacidade');
  if (btnPrivacidade) {
    btnPrivacidade.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('Abrindo Canal de Privacidade...');
    });
  }
});


/* ========================================================
   CARROSSEL DE PARCEIROS — MOBILE
   ======================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.front-partners');
  if (!section) return;

  const swiper = section.querySelector('.partners-swiper');
  const wrapper = swiper && swiper.querySelector('.swiper-wrapper');
  const slides = wrapper ? Array.from(wrapper.querySelectorAll('.swiper-slide')) : [];
  if (!swiper || !wrapper || !slides.length) return;

  let current = 0;
  let mobileNav = null;

  function isMobile() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  function createMobileNavigation() {
    if (mobileNav) return;

    mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-partner-navigation';
    mobileNav.innerHTML =
      '<button type="button" class="partner-prev" aria-label="Parceiro anterior">‹</button>' +
      '<button type="button" class="partner-next" aria-label="Próximo parceiro">›</button>';

    swiper.insertAdjacentElement('afterend', mobileNav);

    mobileNav.querySelector('.partner-prev').addEventListener('click', function () {
      if (current > 0) {
        current -= 1;
        updateMobileCarousel();
      }
    });

    mobileNav.querySelector('.partner-next').addEventListener('click', function () {
      if (current < slides.length - 1) {
        current += 1;
        updateMobileCarousel();
      }
    });
  }

  function updateMobileCarousel() {
    if (!isMobile()) return;
    wrapper.style.transform = 'translate3d(' + (-current * 100) + '%,0,0)';

    const prev = mobileNav && mobileNav.querySelector('.partner-prev');
    const next = mobileNav && mobileNav.querySelector('.partner-next');
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === slides.length - 1;
  }

  function resetDesktop() {
    if (!isMobile()) {
      wrapper.style.transform = '';
      current = 0;
      if (mobileNav) mobileNav.style.display = 'none';
    } else {
      createMobileNavigation();
      mobileNav.style.display = 'flex';
      updateMobileCarousel();
    }
  }

  createMobileNavigation();
  resetDesktop();
  window.addEventListener('resize', resetDesktop);
});


/* ========================================================
   MENU MOBILE — três traços / X
   ======================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const mobileMenu = document.querySelector('.menu-mobile');
  const openMenu = document.querySelector('.header-content .open-menu');
  const closeMenu = mobileMenu ? mobileMenu.querySelector('.close') : null;

  if (!mobileMenu || !openMenu || !closeMenu) return;

  function openMobileMenu(event) {
    if (event) event.preventDefault();
    if (window.matchMedia('(max-width: 767px)').matches) {
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('mobile-menu-open');
    }
  }

  function closeMobileMenu(event) {
    if (event) event.preventDefault();
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mobile-menu-open');
  }

  openMenu.addEventListener('click', openMobileMenu);
  closeMenu.addEventListener('click', closeMobileMenu);

  closeMenu.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      closeMobileMenu(event);
    }
  });

  mobileMenu.querySelectorAll('#menu-menu-mobile a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!link.closest('.menu-item-has-children') || link.closest('.sub-menu')) {
        closeMobileMenu();
      }
    });
  });

  window.addEventListener('resize', function () {
    if (!window.matchMedia('(max-width: 767px)').matches) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMobileMenu(event);
    }
  });
});


/* ========================================================
   DEPOIMENTOS DE ALUNOS — CARROSSEL DESKTOP + MOBILE
   ======================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.front-testimonial');
  if (!section) return;

  const swiper = section.querySelector('.testimonial-swiper');
  const wrapper = swiper && swiper.querySelector('.swiper-wrapper');
  const slides = wrapper ? Array.from(wrapper.querySelectorAll('.swiper-slide.testimony')) : [];
  const desktopPrev = section.querySelector('.slider-navigation .prev');
  const desktopNext = section.querySelector('.slider-navigation .next');

  if (!swiper || !wrapper || !slides.length) return;

  let current = 0;
  let mobileNavigation = null;

  function isMobile() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  function createMobileNavigation() {
    if (mobileNavigation) return;

    mobileNavigation = document.createElement('div');
    mobileNavigation.className = 'mobile-testimonial-navigation';
    mobileNavigation.innerHTML =
      '<button type="button" class="testimonial-prev" aria-label="Depoimento anterior">‹</button>' +
      '<button type="button" class="testimonial-next" aria-label="Próximo depoimento">›</button>';

    swiper.insertAdjacentElement('afterend', mobileNavigation);

    mobileNavigation.querySelector('.testimonial-prev').addEventListener('click', function () {
      if (current > 0) {
        current -= 1;
        update();
      }
    });

    mobileNavigation.querySelector('.testimonial-next').addEventListener('click', function () {
      if (current < slides.length - 1) {
        current += 1;
        update();
      }
    });
  }

  function update() {
    wrapper.style.transform = 'translate3d(' + (-current * 100) + '%,0,0)';

    if (desktopPrev) desktopPrev.classList.toggle('disabled', current === 0);
    if (desktopNext) desktopNext.classList.toggle('disabled', current === slides.length - 1);

    if (mobileNavigation) {
      const prev = mobileNavigation.querySelector('.testimonial-prev');
      const next = mobileNavigation.querySelector('.testimonial-next');
      prev.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      mobileNavigation.style.display = isMobile() ? 'flex' : 'none';
    }
  }

  if (desktopPrev) {
    desktopPrev.addEventListener('click', function () {
      if (current > 0) {
        current -= 1;
        update();
      }
    });
  }

  if (desktopNext) {
    desktopNext.addEventListener('click', function () {
      if (current < slides.length - 1) {
        current += 1;
        update();
      }
    });
  }

  createMobileNavigation();
  update();
  window.addEventListener('resize', update);
});


/* ========================================================
   CARROSSEL PRINCIPAL — 3 BANNERS ABAIXO DO HEADER
   ======================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.querySelector('.ebradi-top-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.ebradi-top-slide'));
  const dots = Array.from(carousel.querySelectorAll('.ebradi-top-dots button'));
  if (!slides.length) return;

  let current = 0;
  let timer = null;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    dots.forEach(function (dot, i) {
      const active = i === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(function () {
      showSlide(current + 1);
    }, 6000);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      restart();
    });
  });

  carousel.addEventListener('mouseenter', function () {
    clearInterval(timer);
  });

  carousel.addEventListener('mouseleave', restart);

  carousel.addEventListener('focusin', function () {
    clearInterval(timer);
  });

  carousel.addEventListener('focusout', restart);

  showSlide(0);
  restart();
});

/* ========================================================
   SUBMENU PÓS-GRADUAÇÃO — INTERAÇÕES
   ======================================================== */
document.addEventListener('DOMContentLoaded', function () {
  // Mobile: clique em Pós-graduação expande/recolhe o submenu
  const mobileParent = document.querySelector('.menu-mobile .menu-item-has-children');
  if (mobileParent) {
    const parentLink = mobileParent.querySelector('> a');
    if (parentLink) {
      parentLink.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        mobileParent.classList.toggle('active');
      });
    }
  }

  // Desktop: suporte a clique/toque e acessibilidade
  const desktopItem = document.querySelector('.header-content .nav .menu-item-has-children.default-dropdown');
  if (desktopItem) {
    const desktopLink = desktopItem.querySelector('> a');
    if (desktopLink) {
      desktopLink.addEventListener('click', function (e) {
        if (window.matchMedia('(hover: none)').matches) {
          e.preventDefault();
          desktopItem.classList.toggle('active');
        }
      });
    }

    document.addEventListener('click', function (e) {
      if (!desktopItem.contains(e.target)) {
        desktopItem.classList.remove('active');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        desktopItem.classList.remove('active');
      }
    });
  }
});


