// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG not found. Make sure assets/js/config.js is loaded.');
    return;
  }
  applyConfig();
  buildHeader();
  buildFooter();
  initNavigation();
  initLenis();
  initThreeJS();
  initSplitting();
  initSwiper();
  initMagnetic();
  initForm();
  initCounters();
  initLeafletMap();
  // Внутристраничные наполнения
  initServicesDetail();
  initProjects();
  initTimeline();
  initTeam();
  // Cookie
  initCookieConsent();
});

function applyConfig() {
  document.querySelectorAll('[data-config]').forEach(el => {
    const path = el.dataset.config;
    const value = getNestedValue(CONFIG, path);
    if (value === undefined) return;
    const placeholder = el.dataset.placeholder;
    if (placeholder && typeof value === 'string' && value.includes('%s')) {
      const placeholderValue = getNestedValue(CONFIG, placeholder);
      if (placeholderValue) {
        el.textContent = value.replace('%s', placeholderValue);
        return;
      }
    }
    if (el.tagName === 'META' && el.hasAttribute('content')) {
      el.setAttribute('content', value);
    } else if (el.hasAttribute('content')) {
      el.setAttribute('content', value);
    } else if (el.tagName === 'TITLE') {
      document.title = value;
    } else {
      el.textContent = value;
    }
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function buildHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  header.className = 'header';
  header.innerHTML = `
    <div class="header__inner">
      <a href="index.html" class="logo">${CONFIG.company.shortName}</a>
      <nav class="nav">
        <button class="burger" aria-label="Меню"><span></span><span></span><span></span></button>
        <ul class="nav__list" id="nav-list">
          <li><a href="index.html" class="nav__link">Главная</a></li>
          <li><a href="services.html" class="nav__link">Услуги</a></li>
          <li><a href="projects.html" class="nav__link">Проекты</a></li>
          <li><a href="about.html" class="nav__link">О компании</a></li>
          <li><a href="contacts.html" class="nav__link">Контакты</a></li>
        </ul>
      </nav>
    </div>
  `;
}

function buildFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container footer__grid">
      <div>
        <h4>${CONFIG.company.name}</h4>
        <p>${CONFIG.company.address}</p>
        <p><a href="tel:+${CONFIG.company.phoneRaw}">${CONFIG.company.phone}</a></p>
        <p><a href="mailto:${CONFIG.company.email}">${CONFIG.company.email}</a></p>
      </div>
      <div>
        <h4>Услуги</h4>
        <ul>${CONFIG.services.map(s => `<li><a href="services.html#${s.id}">${s.title}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h4>Соцсети</h4>
        <a href="${CONFIG.company.social.telegram}" target="_blank" rel="noopener">Telegram</a><br>
        <a href="${CONFIG.company.social.vk}" target="_blank" rel="noopener">ВКонтакте</a>
      </div>
      <div>
        <h4>Правовая информация</h4>
        <a href="privacy.html">Политика конфиденциальности</a><br>
        <a href="terms.html">Согласие на обработку</a>
      </div>
    </div>
    <div class="footer__dev container">
      <span>Разработано в <a href="${CONFIG.developer.url}" target="_blank" rel="noopener">${CONFIG.developer.name}</a></span>
    </div>
  `;
}

function initNavigation() {
  const burger = document.querySelector('.burger');
  const navList = document.getElementById('nav-list');
  if (!burger || !navList) return;
  burger.addEventListener('click', () => navList.classList.toggle('active'));
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    if (link.getAttribute('href') === currentPath) link.classList.add('nav__link--active');
  });
}

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -80 });
    });
  });
}

function initThreeJS() {
  const container = document.getElementById('three-container');
  if (!container || typeof THREE === 'undefined') return;
  // ... (весь код сцены остаётся без изменений, я сократил для краткости, оставьте ваш предыдущий)
  // Вставьте сюда функцию initThreeJS из предыдущей версии main.js
}

function initSplitting() {
  if (typeof Splitting === 'undefined') return;
  const targets = document.querySelectorAll('[data-splitting]');
  Splitting({ target: targets, by: 'chars' });
  targets.forEach(el => {
    const chars = el.querySelectorAll('.char');
    gsap.from(chars, { opacity: 0, y: 20, stagger: 0.03, duration: 0.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 80%' } });
  });
}

function initSwiper() {
  const swiperContainer = document.getElementById('testimonials-swiper');
  if (!swiperContainer || typeof Swiper === 'undefined') return;
  const wrapper = document.getElementById('testimonials-wrapper');
  if (wrapper && !wrapper.children.length) {
    const testimonials = [
      { text: '«Настоящие профессионалы. Сдали ТЦ на 2 месяца раньше срока.»', author: 'Алексей, гендиректор' },
      { text: '«Инженерия на высшем уровне, все системы работают безупречно.»', author: 'Марина, главный инженер' },
      { text: '«Отделка превзошла ожидания. Рекомендую.»', author: 'Дмитрий, частный заказчик' }
    ];
    testimonials.forEach(t => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide testimonial-card';
      slide.innerHTML = `<p class="testimonial-card__text">${t.text}</p><p class="testimonial-card__author">${t.author}</p>`;
      wrapper.appendChild(slide);
    });
  }
  new Swiper(swiperContainer, {
    slidesPerView: 1, spaceBetween: 30, loop: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
  });
}

function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' }));
  });
}

function initForm() {
  const modal = document.getElementById('form-modal');
  const form = document.getElementById('contact-form');
  if (!form) return;
  const openModal = () => modal?.classList.add('active');
  const closeModal = () => modal?.classList.remove('active');
  document.getElementById('global-cta')?.addEventListener('click', openModal);
  document.querySelector('.hero__cta')?.addEventListener('click', openModal);
  document.querySelector('.modal__close')?.addEventListener('click', closeModal);
  modal?.querySelector('.modal__backdrop')?.addEventListener('click', closeModal);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form), data = Object.fromEntries(formData.entries());
    const statusEl = document.getElementById('form-status');
    try {
      if (CONFIG.contactForm.type === 'telegram' && CONFIG.contactForm.telegramBotToken && CONFIG.contactForm.telegramChatId) {
        const msg = `📩 Новая заявка\nИмя: ${data.name}\nТелефон: ${data.phone}\nEmail: ${data.email}\nСообщение: ${data.message}`;
        await fetch(`https://api.telegram.org/bot${CONFIG.contactForm.telegramBotToken}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CONFIG.contactForm.telegramChatId, text: msg })
        });
      } else if (CONFIG.contactForm.type === 'formspree' && CONFIG.contactForm.formspreeUrl) {
        await fetch(CONFIG.contactForm.formspreeUrl, { method: 'POST', body: formData });
      } else {
        statusEl.textContent = 'Форма временно недоступна. Позвоните нам.';
        return;
      }
      statusEl.textContent = CONFIG.contactForm.successMessage;
      form.reset();
    } catch (err) {
      statusEl.textContent = 'Ошибка отправки. Позвоните нам.';
    }
  });
}

function initCounters() {
  const list = document.getElementById('numbers-list');
  if (!list) return;
  const counters = [
    { value: 150, label: 'Завершённых проектов' },
    { value: 12, label: 'Лет опыта' },
    { value: 100, label: 'Сотрудников' },
    { value: 24, label: 'Гарантия (мес.)' }
  ];
  counters.forEach(item => {
    const el = document.createElement('div');
    el.className = 'number-item';
    el.innerHTML = `<div class="number-item__value" data-target="${item.value}">0</div><div class="number-item__label">${item.label}</div>`;
    list.appendChild(el);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.number-item__value').forEach(valEl => {
          const target = +valEl.dataset.target;
          gsap.to(valEl, {
            innerText: target, duration: 2, snap: { innerText: 1 }, ease: 'power2.out',
            onUpdate() { valEl.textContent = Math.round(valEl.innerText); }
          });
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(list);
}

function initLeafletMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer || typeof L === 'undefined') return;
  const map = L.map(mapContainer).setView([CONFIG.company.coordinates.lat, CONFIG.company.coordinates.lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
  L.marker([CONFIG.company.coordinates.lat, CONFIG.company.coordinates.lng]).addTo(map).bindPopup(`<b>${CONFIG.company.name}</b><br>${CONFIG.company.address}`);
}

function initServicesDetail() {
  const container = document.getElementById('services-detail-container');
  if (!container) return;
  const lottieFiles = {
    building: 'assets/lottie/building.json',
    finishing: 'assets/lottie/finishing.json',
    lowcurrent: 'assets/lottie/lowcurrent.json',
    energy: 'assets/lottie/energy.json'
  };
  const servicesDetail = [
    { ...CONFIG.services[0], fullDesc: 'Проектирование и строительство жилых, коммерческих и промышленных объектов. Монолитные работы, металлоконструкции, кровля.' },
    { ...CONFIG.services[1], fullDesc: 'Внутренняя и наружная отделка премиум-класса: штукатурка, покраска, плитка, дизайнерские покрытия.' },
    { ...CONFIG.services[2], fullDesc: 'Монтаж структурированных кабельных сетей, видеонаблюдение, контроль доступа, умный дом.' },
    { ...CONFIG.services[3], fullDesc: 'Электроснабжение, освещение, трансформаторные подстанции, дизель-генераторы, молниезащита.' }
  ];
  container.innerHTML = servicesDetail.map(s => `
    <div class="service-card" id="${s.id}">
      <div class="service-card__icon" id="lottie-${s.id}" style="width:80px;height:80px;margin:0 auto 1rem;"></div>
      <h3 class="service-card__title">${s.title}</h3>
      <p class="service-card__desc">${s.desc}</p>
      <p class="service-card__desc-full">${s.fullDesc}</p>
    </div>
  `).join('');
  if (typeof lottie !== 'undefined') {
    Object.keys(lottieFiles).forEach(key => {
      const el = document.getElementById(`lottie-${key}`);
      if (el) {
        lottie.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: true, path: lottieFiles[key] });
      }
    });
  }
}

function initProjects() {
  const list = document.getElementById('projects-list');
  if (!list) return;
  const projects = [
    { title: 'ЖК «Северный»', category: 'building', desc: '10-этажный жилой комплекс', img: 'assets/img/project1.jpg' },
    { title: 'Бизнес-центр «Вологда-Сити»', category: 'building', desc: 'Отделка 5000 м²', img: 'assets/img/project2.jpg' },
    { title: 'Завод «Электрон»', category: 'energy', desc: 'Энергоснабжение цеха', img: 'assets/img/project3.jpg' },
    { title: 'Школа №12', category: 'finishing', desc: 'Капитальный ремонт', img: 'assets/img/project4.jpg' },
    { title: 'Системы безопасности ТРЦ', category: 'lowcurrent', desc: 'Видеонаблюдение и СКУД', img: 'assets/img/project5.jpg' }
  ];
  function renderProjects(filter = 'all') {
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
    list.innerHTML = filtered.map(p => `
      <div class="project-card" data-category="${p.category}">
        <img src="${p.img}" alt="${p.title}" class="project-card__img" onerror="this.style.background='#bbb'; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect width=%22300%22 height=%22200%22 fill=%22%23ddd%22/><text x=%2230%22 y=%22110%22 font-size=%2220%22>Нет фото</text></svg>'">
        <div class="project-card__info">
          <span class="project-card__category">${CONFIG.services.find(s => s.id === p.category)?.title || p.category}</span>
          <h3 class="project-card__title">${p.title}</h3>
          <p>${p.desc}</p>
        </div>
      </div>
    `).join('');
    document.querySelectorAll('.project-card').forEach(card => card.addEventListener('click', () => openProjectModal(card)));
  }
  renderProjects();
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });
}

function openProjectModal(card) {
  const modal = document.getElementById('project-modal'), details = document.getElementById('project-details');
  if (!modal || !details) return;
  const img = card.querySelector('.project-card__img')?.src || '';
  const title = card.querySelector('.project-card__title')?.textContent || '';
  const desc = card.querySelector('p')?.textContent || '';
  details.innerHTML = `<img src="${img}" style="width:100%; max-height:400px; object-fit:cover;" alt=""><h2>${title}</h2><p>${desc}</p><p>Подробное описание проекта будет добавлено.</p>`;
  modal.classList.add('active');
  modal.querySelector('.modal__close').onclick = () => modal.classList.remove('active');
  modal.querySelector('.modal__backdrop').onclick = () => modal.classList.remove('active');
}

function initTimeline() {
  const list = document.getElementById('timeline-list');
  if (!list) return;
  const events = [
    { year: 2015, text: 'Основание компании в Вологде, первые частные заказы.' },
    { year: 2017, text: 'Запуск направления слаботочных систем и автоматизации.' },
    { year: 2019, text: 'Первый крупный промышленный объект – завод «Электрон».' },
    { year: 2021, text: 'Открытие отдела энергетики, расширение штата.' },
    { year: 2023, text: 'Более 150 завершённых проектов. Собственный парк техники.' },
    { year: 2026, text: 'Курс на цифровизацию и умное строительство.' }
  ];
  list.innerHTML = events.map(e => `<div class="timeline-item"><div class="timeline-item__year">${e.year}</div><div class="timeline-item__text">${e.text}</div></div>`).join('');
}

function initTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  const team = [
    { name: 'Иван Сергеев', role: 'Главный инженер' },
    { name: 'Ольга Петрова', role: 'Архитектор' },
    { name: 'Алексей Смирнов', role: 'Руководитель проектов' },
    { name: 'Дмитрий Козлов', role: 'Инженер-электрик' },
    { name: 'Елена Иванова', role: 'Дизайнер интерьеров' },
    { name: 'Сергей Николаев', role: 'Прораб' }
  ];
  grid.innerHTML = team.map(m => `
    <div class="team-member">
      <div class="team-member__photo" style="background-image: url('assets/img/team-placeholder.jpg');"></div>
      <div class="team-member__name">${m.name}</div>
      <div class="team-member__role">${m.role}</div>
    </div>
  `).join('');
}

function initCookieConsent() {
  if (localStorage.getItem('cookiesAccepted')) return;
  const consent = document.createElement('div');
  consent.className = 'cookie-consent';
  consent.innerHTML = `
    <div class="cookie-consent__text">
      Мы используем файлы cookie. Продолжая использовать сайт, вы соглашаетесь с <a href="privacy.html">политикой конфиденциальности</a>.
    </div>
    <button class="cookie-consent__btn" id="accept-cookies">Принять</button>
  `;
  document.body.appendChild(consent);
  setTimeout(() => consent.classList.add('active'), 500);
  document.getElementById('accept-cookies').onclick = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    consent.classList.remove('active');
    setTimeout(() => consent.remove(), 400);
  };
}

// Обработчик DOMContentLoaded вызывает всё, см. в начале.
