// assets/js/main.js

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, что CONFIG существует
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG not found. Make sure assets/js/config.js is loaded.');
    return;
  }

  // 1. Применяем данные из конфига ко всем элементам с data-config
  applyConfig();

  // 2. Строим шапку и подвал
  buildHeader();
  buildFooter();

  // 3. Инициализируем компоненты, если их контейнеры есть на странице
  initNavigation();
  initLenis();
  initThreeJS();
  initSplitting();
  initSwiper();
  initMagnetic();
  initForm();
  initCounters();
  initLeafletMap();
});

/* ================================================================
   Применение конфигурации: элементы с data-config="путь.к.ключу"
   Поддерживается вставка текста, плейсхолдеров, атрибутов.
   ================================================================ */
function applyConfig() {
  document.querySelectorAll('[data-config]').forEach(el => {
    const path = el.dataset.config;
    const value = getNestedValue(CONFIG, path);
    if (value === undefined) return;

    // Если у элемента есть data-placeholder, заменяем %s в шаблоне
    const placeholder = el.dataset.placeholder;
    if (placeholder && typeof value === 'string' && value.includes('%s')) {
      const placeholderValue = getNestedValue(CONFIG, placeholder);
      if (placeholderValue) {
        el.textContent = value.replace('%s', placeholderValue);
        return;
      }
    }

    // Если это META или другой элемент с атрибутом content
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

/* ================================================================
   Шапка сайта
   ================================================================ */
function buildHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  header.className = 'header';
  header.innerHTML = `
    <div class="header__inner">
      <a href="index.html" class="logo">${CONFIG.company.shortName}</a>
      <nav class="nav">
        <button class="burger" aria-label="Меню">
          <span></span><span></span><span></span>
        </button>
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

/* ================================================================
   Подвал сайта
   ================================================================ */
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
        <ul>
          ${CONFIG.services.map(s => `<li><a href="services.html#${s.id}">${s.title}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h4>Соцсети</h4>
        <a href="${CONFIG.company.social.telegram}" target="_blank" rel="noopener">Telegram</a><br>
        <a href="${CONFIG.company.social.vk}" target="_blank" rel="noopener">ВКонтакте</a>
      </div>
    </div>
    <div class="footer__dev container">
      <span>Разработано в <a href="${CONFIG.developer.url}" target="_blank" rel="noopener">${CONFIG.developer.name}</a></span>
    </div>
  `;
}

/* ================================================================
   Навигация (бургер, активный пункт)
   ================================================================ */
function initNavigation() {
  const burger = document.querySelector('.burger');
  const navList = document.getElementById('nav-list');
  if (!burger || !navList) return;

  burger.addEventListener('click', () => {
    navList.classList.toggle('active');
  });

  // Подсветка текущей страницы
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('nav__link--active');
    }
  });
}

/* ================================================================
   Плавный скролл (Lenis)
   ================================================================ */
function initLenis() {
  // Если Lenis не подключён, выходим
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis not loaded. Smooth scroll disabled.');
    return;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Привязка якорных ссылок к Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -80 }); // смещение под фикс. шапку
      }
    });
  });
}

/* ================================================================
   3D сцена Three.js на главной (чертёж здания)
   ================================================================ */
function initThreeJS() {
  const container = document.getElementById('three-container');
  if (!container || typeof THREE === 'undefined') return;

  // Базовая сцена: каркас здания, который вращается
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2D2D2D);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(5, 4, 8);
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Сетка-основание
  const gridHelper = new THREE.GridHelper(6, 20, 0x444444, 0x333333);
  scene.add(gridHelper);

  // Строение из проволочных кубов (этажи)
  const buildingGroup = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0xFF5722, wireframe: true });

  for (let i = 0; i < 4; i++) {
    const geometry = new THREE.BoxGeometry(2, 0.8, 1.5);
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 0.4 + i * 1.1;
    buildingGroup.add(cube);
  }
  scene.add(buildingGroup);

  // Освещение
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(3, 5, 2);
  scene.add(directionalLight);

  // Анимация вращения
  function animate() {
    requestAnimationFrame(animate);
    buildingGroup.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animate();

  // Ресайз
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ================================================================
   Splitting.js – анимация появления текста
   ================================================================ */
function initSplitting() {
  if (typeof Splitting === 'undefined') return;

  const targets = document.querySelectorAll('[data-splitting]');
  Splitting({ target: targets, by: 'chars' });

  // Добавляем базовый стиль для анимирования (допустим, последовательное появление)
  targets.forEach(el => {
    el.style.visibility = 'visible'; // если скрывали
    const chars = el.querySelectorAll('.char');
    gsap.from(chars, {
      opacity: 0,
      y: 20,
      stagger: 0.03,
      duration: 0.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
    });
  });
}

/* ================================================================
   Swiper (отзывы)
   ================================================================ */
function initSwiper() {
  const swiperContainer = document.getElementById('testimonials-swiper');
  if (!swiperContainer || typeof Swiper === 'undefined') return;

  // Временно заполняем отзывами
  const wrapper = document.getElementById('testimonials-wrapper');
  if (wrapper && wrapper.children.length === 0) {
    const testimonials = [
      { text: '«Настоящие профессионалы. Сдали ТЦ на 2 месяца раньше срока.»', author: 'Алексей, гендиректор' },
      { text: '«Инженерия на высшем уровне, все системы работают безупречно.»', author: 'Марина, главный инженер' },
      { text: '«Отделка превзошла ожидания. Рекомендую.»', author: 'Дмитрий, частный заказчик' },
    ];
    testimonials.forEach(t => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide testimonial-card';
      slide.innerHTML = `<p class="testimonial-card__text">${t.text}</p>
                         <p class="testimonial-card__author">${t.author}</p>`;
      wrapper.appendChild(slide);
    });
  }

  new Swiper(swiperContainer, {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}

/* ================================================================
   Магнитный эффект кнопок
   ================================================================ */
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    });
  });
}

/* ================================================================
   Отправка формы (Telegram или Formspree)
   ================================================================ */
function initForm() {
  const modal = document.getElementById('form-modal');
  const form = document.getElementById('contact-form');
  const globalCta = document.getElementById('global-cta');
  const heroCta = document.querySelector('.hero__cta');
  const closeBtn = document.querySelector('.modal__close');
  const statusEl = document.getElementById('form-status');

  if (!form) return;

  const openModal = () => modal?.classList.add('active');
  const closeModal = () => modal?.classList.remove('active');

  globalCta?.addEventListener('click', openModal);
  heroCta?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal?.querySelector('.modal__backdrop')?.addEventListener('click', closeModal);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      if (CONFIG.contactForm.type === 'telegram' && CONFIG.contactForm.telegramBotToken && CONFIG.contactForm.telegramChatId) {
        // Отправка в Telegram
        const message = `📩 Новая заявка\nИмя: ${data.name}\nТелефон: ${data.phone}\nEmail: ${data.email}\nСообщение: ${data.message}`;
        const url = `https://api.telegram.org/bot${CONFIG.contactForm.telegramBotToken}/sendMessage`;
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CONFIG.contactForm.telegramChatId,
            text: message,
          }),
        });
        statusEl.textContent = CONFIG.contactForm.successMessage;
      } else if (CONFIG.contactForm.type === 'formspree' && CONFIG.contactForm.formspreeUrl) {
        const response = await fetch(CONFIG.contactForm.formspreeUrl, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          statusEl.textContent = CONFIG.contactForm.successMessage;
        } else {
          throw new Error('Formspree error');
        }
      } else {
        statusEl.textContent = 'Форма временно недоступна. Позвоните нам.';
      }
      form.reset();
    } catch (err) {
      statusEl.textContent = 'Ошибка отправки. Пожалуйста, позвоните по телефону.';
      console.error(err);
    }
  });
}

/* ================================================================
   Анимация цифр (рулонное табло)
   ================================================================ */
function initCounters() {
  const numbersList = document.getElementById('numbers-list');
  if (!numbersList) return;

  // Данные преимуществ
  const counters = [
    { value: 150, label: 'Завершённых проектов' },
    { value: 12, label: 'Лет опыта' },
    { value: 100, label: 'Сотрудников' },
    { value: 24, label: 'Гарантия (мес.)' },
  ];

  counters.forEach(item => {
    const el = document.createElement('div');
    el.className = 'number-item';
    el.innerHTML = `<div class="number-item__value" data-target="${item.value}">0</div>
                    <div class="number-item__label">${item.label}</div>`;
    numbersList.appendChild(el);
  });

  // Запуск счётчиков при прокрутке
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const valueEls = entry.target.querySelectorAll('.number-item__value');
        valueEls.forEach(el => {
          const target = +el.dataset.target;
          gsap.to(el, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(el.innerText);
            },
          });
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(numbersList);
}

/* ================================================================
   Интерактивная карта Leaflet (если подключён)
   ================================================================ */
function initLeafletMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer || typeof L === 'undefined') return;

  const map = L.map(mapContainer).setView([CONFIG.company.coordinates.lat, CONFIG.company.coordinates.lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  L.marker([CONFIG.company.coordinates.lat, CONFIG.company.coordinates.lng])
    .addTo(map)
    .bindPopup(`<b>${CONFIG.company.name}</b><br>${CONFIG.company.address}`);
}
