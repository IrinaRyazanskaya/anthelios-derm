const AFTER_TEXTURE_DELAY = 120;
const TEXTURE_FADE_DURATION = 1000;

/**
 * Запускает анимацию появления элементов слайда с последовательным показом текстуры,
 * продукта и текста. Пропускает анимацию при включённом prefers-reduced-motion.
 */
function runIntroAnimation() {
  // Проверяем настройки доступности: если пользователь отключил анимации, то не запускаем их
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const slide = document.querySelector('.slide');

  if (!slide) {
    return;
  }

  const texture = slide.querySelector('.intro__texture');
  const product = slide.querySelector('.intro__product');
  const text = slide.querySelector('.intro__body');
  
  // Фильтруем только существующие элементы (удаляем null/undefined из массива)
  const elements = [texture, product, text].filter(Boolean);
  
  if (!elements.length) {
    return;
  }

  // Скрываем все элементы мгновенно (без CSS-переходов) перед началом анимации
  for (const target of elements) {
    hideWithoutTransition(target);
  }

  // Используем requestAnimationFrame для синхронизации с циклом отрисовки браузера.
  // Это гарантирует, что браузер применил изменения (is-hidden) перед началом анимации
  requestAnimationFrame(() => {
    // Первый этап: показываем текстуру
    if (texture) {
      texture.classList.remove('is-hidden');
    }

    // Второй этап: показываем продукт и текст после завершения анимации текстуры
    // Задержка = время анимации текстуры + дополнительная пауза между этапами
    window.setTimeout(() => {
      for (const element of [product, text]) {
        if (element) {
          element.classList.remove('is-hidden');
        }
      }
    }, TEXTURE_FADE_DURATION + AFTER_TEXTURE_DELAY);
  });
};

/**
 * Скрывает элемент без проигрывания CSS-переходов, добавляя класс is-hidden.
 * Временно отключает transition для мгновенного применения стилей, затем восстанавливает.
 */
function hideWithoutTransition(element) {
  const originalTransition = element.style.transition;

  // Отключаем все CSS-переходы для мгновенного изменения стилей
  element.style.transition = 'none';
  element.classList.add('is-hidden');

  // Принудительно запускаем reflow (пересчёт layout браузером) через чтение offsetWidth.
  // Это гарантирует, что браузер применит изменения (transition: none и is-hidden)
  // до восстановления transition, чтобы анимация стартовала корректно с нового состояния
  element.offsetWidth;

  // Восстанавливаем оригинальные настройки transition
  element.style.transition = originalTransition;
};

// Обработчик события pageshow срабатывает при показе страницы из кэша.
//
// event.persisted === true означает, что страница восстановлена из Back-Forward Cache
// (например, при навигации кнопками назад/вперёд). В этом случае событие DOMContentLoaded
// не срабатывает, поэтому перезапускаем анимацию вручную для корректного отображения.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    runIntroAnimation();
  }
});

// Запускаем анимацию при первой загрузке страницы
document.addEventListener('DOMContentLoaded', runIntroAnimation);
