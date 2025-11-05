window.addEventListener('scroll', () => {
  const header = document.getElementById('main-header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

function toggleMobileMenu() {
  const mobileNav = document.getElementById('mobile-nav');
  const backdrop = document.getElementById('mobile-backdrop');

  if (mobileNav && backdrop) {
    mobileNav.classList.toggle('active');
    backdrop.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.querySelector('.burger-menu');
  const closeMenu = document.querySelector('.close-menu');
  const backdrop = document.getElementById('mobile-backdrop');
  
  if (burgerMenu) {
    burgerMenu.addEventListener('click', toggleMobileMenu);
  }
  
  if (closeMenu) {
    closeMenu.addEventListener('click', toggleMobileMenu);
  }
  
  if (backdrop) {
    backdrop.addEventListener('click', toggleMobileMenu);
  }
});

window.toggleMobileMenu = toggleMobileMenu;
