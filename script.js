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

  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', function (e) {
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
    }
    clearInterval(timer);
  }, { passive: true });

  carousel.addEventListener('touchend', function (e) {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          showSlide(current + 1); // Swipe left -> next
        } else {
          showSlide(current - 1); // Swipe right -> prev
        }
      }
    }
    restart();
  }, { passive: true });

  showSlide(0);
  restart();
});

/* ========================================================
   SUBMENUS DROPDOWNS (PÓS-GRADUAÇÃO E CURSOS LIVRES)
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Interação dos Submenus Desktop
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  dropdownItems.forEach((item) => {
    const toggle = item.querySelector('.dropdown-toggle');

    function openDropdown() {
      dropdownItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.add('open');
      toggle?.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      item.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }

    toggle?.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    item.addEventListener('mouseenter', openDropdown);
    item.addEventListener('mouseleave', closeDropdown);

    // Fecha ao clicar em qualquer item do submenu
    item.querySelectorAll('.dropdown-item').forEach((subLink) => {
      subLink.addEventListener('click', () => {
        closeDropdown();
      });
    });
  });

  // Fecha dropdowns ao clicar fora
  document.addEventListener('click', (e) => {
    dropdownItems.forEach((item) => {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
        item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Fecha dropdowns com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach((item) => {
        item.classList.remove('open');
        item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // 2. Interação dos Submenus Mobile (Accordions)
  const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-toggle');

  mobileDropdownBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parentGroup = btn.closest('.mobile-nav-group');
      const submenu = parentGroup ? parentGroup.querySelector('.mobile-submenu') : null;
      if (submenu) {
        const willOpen = !btn.classList.contains('open');

        // Fecha outros accordions para manter o menu mobile limpo
        mobileDropdownBtns.forEach((otherBtn) => {
          if (otherBtn !== btn) {
            otherBtn.classList.remove('open');
            otherBtn.setAttribute('aria-expanded', 'false');
            const otherSub = otherBtn.closest('.mobile-nav-group')?.querySelector('.mobile-submenu');
            otherSub?.classList.remove('open');
          }
        });

        btn.classList.toggle('open', willOpen);
        submenu.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      }
    });
  });
});

/* ========================================================
   EBRADI EXPERIENCE — CARROSSEL E MODAL DE AULAS EXPERIMENTAIS
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('ebradiExpTrack');
  const trackContainer = document.querySelector('.ebradi-exp-track-container');
  const prevBtn = document.getElementById('ebradiExpPrev');
  const nextBtn = document.getElementById('ebradiExpNext');
  const dotsContainer = document.getElementById('ebradiExpDots');

  if (!track || !trackContainer) return;

  const slides = Array.from(track.querySelectorAll('.ebradi-exp-slide'));
  let currentIndex = 0;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;

  function getVisibleSlides() {
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 991) return 2;
    return 3;
  }

  function getMaxIndex() {
    const visible = getVisibleSlides();
    return Math.max(0, slides.length - visible);
  }

  function updateSlidePosition(index) {
    const maxIdx = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIdx));

    if (slides.length > 0 && slides[0]) {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const offset = -(currentIndex * slideWidth);
      track.style.transform = `translateX(${offset}px)`;
      currentTranslate = offset;
      prevTranslate = offset;
    }

    // Atualiza estado dos botões de seta
    if (prevBtn) {
      prevBtn.disabled = currentIndex <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIdx;
    }

    // Atualiza indicadores (dots)
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.ebradi-exp-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
      });
    }
  }

  function setupDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    const count = maxIdx + 1;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `ebradi-exp-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
      dot.addEventListener('click', () => {
        updateSlidePosition(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Event Listeners dos botões de navegação
  prevBtn?.addEventListener('click', () => {
    updateSlidePosition(currentIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    updateSlidePosition(currentIndex + 1);
  });

  // Suporte a Touch e Drag
  function touchStart(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    track.style.transition = 'none';
  }

  function touchMove(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diff = currentX - startX;
    track.style.transform = `translateX(${prevTranslate + diff}px)`;
  }

  function touchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
    const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
    const movedBy = endX - startX;

    if (movedBy < -50) {
      updateSlidePosition(currentIndex + 1);
    } else if (movedBy > 50) {
      updateSlidePosition(currentIndex - 1);
    } else {
      updateSlidePosition(currentIndex);
    }
  }

  trackContainer.addEventListener('touchstart', touchStart, { passive: true });
  trackContainer.addEventListener('touchmove', touchMove, { passive: true });
  trackContainer.addEventListener('touchend', touchEnd);

  trackContainer.addEventListener('mousedown', touchStart);
  window.addEventListener('mousemove', touchMove);
  window.addEventListener('mouseup', touchEnd);

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupDots();
      updateSlidePosition(currentIndex);
    }, 150);
  });

  // Inicialização
  setupDots();
  updateSlidePosition(0);

  // ========================================================
  // MODAL INTERATIVO DE AULAS EXPERIMENTAIS
  // ========================================================
  const modal = document.getElementById('ebradiExpModal');
  const iframe = document.getElementById('ebradiExpIframe');
  const modalTitle = document.getElementById('ebradiExpModalTitle');
  const modalDiscipline = document.getElementById('ebradiExpModalDiscipline');
  const modalLesson = document.getElementById('ebradiExpModalLesson');
  const modalAction = document.getElementById('ebradiExpModalAction');
  const closeBtn = document.getElementById('ebradiExpClose');
  const dismissBtn = document.getElementById('ebradiExpModalDismiss');
  const backdrop = document.getElementById('ebradiExpBackdrop');

  function openExpModal(cardData) {
    if (!modal || !iframe) return;

    if (modalTitle) modalTitle.textContent = cardData.course || '';
    if (modalDiscipline) modalDiscipline.textContent = cardData.discipline || '';
    if (modalLesson) modalLesson.textContent = cardData.lesson || '';
    if (modalAction && cardData.url) {
      modalAction.href = cardData.url;
    }

    if (cardData.video) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${cardData.video}?autoplay=1&rel=0&modestbranding=1`;
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeExpModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (iframe) {
      iframe.src = '';
    }
    document.body.style.overflow = '';
  }

  // Ouvintes de clique nos cards
  document.querySelectorAll('.ebradi-exp-cta').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cardData = {
        course: btn.getAttribute('data-course'),
        discipline: btn.getAttribute('data-discipline'),
        lesson: btn.getAttribute('data-lesson'),
        prof: btn.getAttribute('data-prof'),
        video: btn.getAttribute('data-video'),
        url: btn.getAttribute('data-url'),
      };
      openExpModal(cardData);
    });
  });

  closeBtn?.addEventListener('click', closeExpModal);
  dismissBtn?.addEventListener('click', closeExpModal);
  backdrop?.addEventListener('click', closeExpModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeExpModal();
    }
  });
});



