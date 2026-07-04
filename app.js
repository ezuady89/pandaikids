const go = id => {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
};
document.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.go)));

document.querySelectorAll('[data-answer]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.answer === '8') {
      btn.classList.add('good');
      setTimeout(() => go('reward'), 450);
    } else {
      btn.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:260});
    }
  });
});
let t = 18;
setInterval(() => {
  const timer = document.getElementById('timer');
  if (!timer) return;
  if (document.getElementById('quiz').classList.contains('active')) {
    t = Math.max(0, t - 1);
    timer.textContent = t;
  }
}, 1000);
