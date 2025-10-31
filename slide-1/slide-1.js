const AFTER_TEXTURE_DELAY = 120;
const TEXTURE_FADE_DURATION = 1000;

// Идентификатор активного таймера второй фазы анимации (показ продукта и текста)
let introTimeoutId = null;

/**
 * Запускает анимацию появления элементов слайда с последовательным показом текстуры,
 * продукта и текста. Пропускает анимацию при включённом prefers-reduced-motion.
 */
function runIntroAnimation() {
  // Проверяем настройки доступности: если пользователь отключил анимации, то не запускаем их
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const slide = document.querySelector(".slide");

  if (!slide) {
    return;
  }

  const texture = slide.querySelector(".intro__texture");
  const product = slide.querySelector(".intro__product");
  const text = slide.querySelector(".intro__body");

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
  // Это гарантирует, что браузер применил скрывающий модификатор перед началом анимации
  requestAnimationFrame(() => {
    // Первый этап: показываем текстуру
    if (texture) {
      removeHiddenClass(texture);
    }

    // Второй этап: показываем продукт и текст после завершения анимации текстуры
    // Задержка = время анимации текстуры + дополнительная пауза между этапами
    // Если introTimeout ещё активен, сбрасываем его, чтобы не сработал старый
    if (introTimeoutId !== null) {
      window.clearTimeout(introTimeoutId);
    }

    // Запоминаем id нового introTimeout и запускаем отсчёт до появления продукта и текста
    introTimeoutId = window.setTimeout(() => {
      for (const element of [product, text]) {
        if (element) {
          removeHiddenClass(element);
        }
      }
      // Отмечаем, что показ анимации завершён и таймер больше не активен
      introTimeoutId = null;
    }, TEXTURE_FADE_DURATION + AFTER_TEXTURE_DELAY);
  });
}

/**
 * Скрывает элемент без проигрывания CSS-переходов, добавляя модификатор скрытия.
 * Временно отключает transition для мгновенного применения стилей, затем восстанавливает.
 */
function hideWithoutTransition(element) {
  const hiddenClass = getHiddenClass(element);

  if (!hiddenClass) {
    return;
  }

  const originalTransition = element.style.transition;

  // Отключаем все CSS-переходы для мгновенного изменения стилей
  element.style.transition = "none";
  element.classList.add(hiddenClass);

  // Принудительно запускаем reflow (пересчёт layout браузером) через чтение offsetWidth.
  // Это гарантирует, что браузер применит изменения (transition: none и скрывающий модификатор)
  // до восстановления transition, чтобы анимация стартовала корректно с нового состояния
  void element.offsetWidth;

  // Восстанавливаем оригинальные настройки transition
  element.style.transition = originalTransition;
}

/**
 * Возвращает CSS-класс скрытия для элемента из data-атрибута если он не задан
 */
function getHiddenClass(element) {
  return element.dataset.hiddenClass || "";
}

/**
 * Удаляет CSS-класс скрытия с элемента, если он задан.
 */
function removeHiddenClass(element) {
  const hiddenClass = getHiddenClass(element);

  if (!hiddenClass) {
    return;
  }

  element.classList.remove(hiddenClass);
}

// Обработчик события pageshow срабатывает при показе страницы из кэша.
//
// event.persisted === true означает, что страница восстановлена из Back-Forward Cache
// (например, при навигации кнопками назад/вперёд). В этом случае событие DOMContentLoaded
// не срабатывает, поэтому перезапускаем анимацию вручную для корректного отображения.
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    runIntroAnimation();
  }
});

// Запускаем анимацию при первой загрузке страницы
document.addEventListener("DOMContentLoaded", runIntroAnimation);
