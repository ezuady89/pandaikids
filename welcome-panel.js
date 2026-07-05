// WELCOME PANEL JS START - PandaiKids Build 13
(function () {
  const STORAGE_KEY = 'pandaikids_child_profile';
  const panel = document.getElementById('pkWelcomePanel');
  const form = document.getElementById('pkWelcomeForm');
  const bubble = document.getElementById('pkPandiBubble');
  const bubbleTitle = document.getElementById('pkBubbleTitle');
  const bubbleText = document.getElementById('pkBubbleText');

  if (!panel || !form || !bubble) return;

  function showBubble(title, text) {
    bubbleTitle.textContent = title;
    bubbleText.textContent = text;
    bubble.hidden = false;
    bubble.classList.add('pk-show');
  }

  function hidePanelThenBubble(profile) {
    panel.classList.add('pk-hide');
    setTimeout(() => {
      panel.style.display = 'none';
      showBubble(
        `Hai, ${profile.name}! 🐼`,
        `Selamat datang ke PandaiKids. Jom belajar sambil bermain!`
      );
    }, 420);
  }

  const savedProfile = localStorage.getItem(STORAGE_KEY);
  if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile);
      panel.style.display = 'none';
      showBubble(
        `Selamat datang kembali, ${profile.name}! 🌟`,
        `Hari ini Pandi sedia belajar bersama awak.`
      );
      return;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const profile = {
      name: document.getElementById('pkChildName').value.trim(),
      state: document.getElementById('pkChildState').value,
      age: document.getElementById('pkChildAge').value
    };

    if (!profile.name || !profile.state || !profile.age) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    hidePanelThenBubble(profile);
  });

  window.resetPandiProfile = function () {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };
})();
// WELCOME PANEL JS END - PandaiKids Build 13
