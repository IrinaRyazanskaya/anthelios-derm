const TEXTURE_FADE_DURATION = 1000;
const AFTER_TEXTURE_DELAY = 120;

const runIntroAnimation = () => {
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

  const sequenceTargets = [texture, product, text].filter(Boolean);
  if (!sequenceTargets.length) {
    return;
  }

  sequenceTargets.forEach((element) => {
    element.classList.remove('is-hidden');
    element.classList.add('is-hidden');
  });

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

document.addEventListener('DOMContentLoaded', runIntroAnimation);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    runIntroAnimation();
  }
});
