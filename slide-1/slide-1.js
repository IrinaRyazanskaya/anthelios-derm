const AFTER_TEXTURE_DELAY = 120;
const TEXTURE_FADE_DURATION = 1000;

/**
 * Запускает анимацию появления элементов слайда с последовательным показом текстуры,
 * продукта и текста. Пропускает анимацию при включённом prefers-reduced-motion.
 */
function runIntroAnimation() {
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
  
  const elements = [texture, product, text].filter(Boolean);
  
  if (!elements.length) {
    return;
  }

  for (const target of elements) {
    hideWithoutTransition(target);
  }

  requestAnimationFrame(() => {
    if (texture) {
      texture.classList.remove('is-hidden');
    }

    window.setTimeout(() => {
      [product, text].forEach((element) => {
        if (element) {
          element.classList.remove('is-hidden');
        }
      });
    }, TEXTURE_FADE_DURATION + AFTER_TEXTURE_DELAY);
  });
};

/**
 * Скрывает элемент без проигрывания CSS-переходов, добавляя класс is-hidden.
 * Временно отключает transition для мгновенного применения стилей, затем восстанавливает.
 */
function hideWithoutTransition(element) {
  const originalTransition = element.style.transition;

  element.style.transition = 'none';
  element.classList.add('is-hidden');

  // Принудительно запускаем reflow, чтобы анимации стартовали заново
  element.offsetWidth;

  element.style.transition = originalTransition;
};

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    runIntroAnimation();
  }
});

document.addEventListener('DOMContentLoaded', runIntroAnimation);
