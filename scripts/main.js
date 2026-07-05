const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const sideMenu = document.getElementById('sideMenu');

menuBtn?.addEventListener('click', () => sideMenu.classList.add('open'));
closeMenu?.addEventListener('click', () => sideMenu.classList.remove('open'));
sideMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => sideMenu.classList.remove('open'));
});
