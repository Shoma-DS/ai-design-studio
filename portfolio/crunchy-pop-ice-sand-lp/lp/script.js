const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
  mobileNav.setAttribute('aria-hidden', 'true');
  mobileNav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  if (!willOpen) {
    closeMenu();
    return;
  }
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'メニューを閉じる');
  mobileNav.setAttribute('aria-hidden', 'false');
  mobileNav.classList.add('is-open');
  document.body.classList.add('menu-open');
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    menuButton.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 767) closeMenu();
});
