// assets/js/config.js
// Все ключевые данные компании и настройки сайта. Меняйте здесь, и изменения применятся везде.
const CONFIG = {
  company: {
    name: 'Северный Инжиниринг',        // Название компании для Вологды
    shortName: 'СевИнжиниринг',
    slogan: 'Создаём объекты будущего',
    foundingYear: 2015,
    phone: '+7 (995) 788-66-68',        // Формат для людей
    phoneRaw: '89957886668',            // Для ссылок tel:
    email: 'pstudio817@yandex.ru',
    address: 'г. Вологда, ул. Чернышевского, 120Г',
    workingHours: 'Пн–Пт: 8:00–19:00',
    coordinates: { lat: 59.2181, lng: 39.8836 }, // Примерные координаты Вологды
    social: {
      telegram: 'https://t.me/bananaagency817',  // временно
      vk: 'https://vk.com/bananaagency817'       // временно
    }
  },
  developer: {
    name: 'Банановое агентство 817',
    url: 'https://studio817.ru/banan'
  },
  seo: {
    siteName: 'Северный Инжиниринг - строительство, отделка, инженерия',
    titleTemplate: '%s | Северный Инжиниринг',
    description: 'Полный цикл инженерных и строительных работ в Вологде: проектирование, строительство, отделка, слаботочные системы, энергетика. Технологии, надёжность, сроки.',
    keywords: 'строительство Вологда, отделка, инженерия, слаботочка, энергетика, строительная компания',
    ogImage: 'assets/img/og-image.jpg', // путь без начального слеша
    siteUrl: 'https://yourgithubpages.url'
  },
  services: [
    { id: 'building', title: 'Строительство', desc: 'Возведение зданий и сооружений', icon: '🏗️' },
    { id: 'finishing', title: 'Отделка', desc: 'Премиум-отделочные работы', icon: '🎨' },
    { id: 'lowcurrent', title: 'Слаботочные системы', desc: 'Умные сети и автоматизация', icon: '🔌' },
    { id: 'energy', title: 'Энергетика', desc: 'Электроснабжение и освещение', icon: '⚡' }
  ],
  contactForm: {
    // Для Telegram: укажите токен и chat_id. Безопасность: на статике токен виден.
    // Рекомендация: используйте Formspree как более безопасную альтернативу (formspreeUrl).
    type: 'telegram', // 'telegram' или 'formspree'
    telegramBotToken: '', // Заполните реальным токеном бота (или оставьте пустым для отключения)
    telegramChatId: '',   // ID чата (число или @username)
    formspreeUrl: 'https://formspree.io/f/your-form-id', // fallback
    successMessage: 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 15 минут.'
  }
};
// Запрещаем изменение
Object.freeze(CONFIG);
