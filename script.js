const modal = document.getElementById('modal');
const startBtn = document.getElementById('startBtn');
const demoBtn = document.getElementById('demoBtn');
const closeModal = document.getElementById('closeModal');
const okBtn = document.getElementById('okBtn');
const feedback = document.getElementById('feedback');
const coins = document.getElementById('coins');
const stars = document.getElementById('stars');

function openModal(){ modal.classList.add('show'); }
function close(){ modal.classList.remove('show'); }

startBtn.addEventListener('click', openModal);
demoBtn.addEventListener('click', () => {
  feedback.textContent = 'Cuba jawab soalan demo di kad Pandi 🐼';
  document.querySelector('.game-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
closeModal.addEventListener('click', close);
okBtn.addEventListener('click', close);
modal.addEventListener('click', (e) => { if(e.target === modal) close(); });

document.querySelectorAll('.answers button').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('correct-pop','wrong-shake');
    void btn.offsetWidth;
    if(btn.dataset.answer === 'correct'){
      btn.classList.add('correct-pop');
      feedback.textContent = 'Hebat! Jawapan betul 🎉 +10 syiling';
      coins.textContent = Number(coins.textContent) + 10;
      stars.textContent = Number(stars.textContent) + 1;
      launchConfetti();
    } else {
      btn.classList.add('wrong-shake');
      feedback.textContent = 'Hampir betul. Cuba lagi ya 💪';
    }
  });
});

function launchConfetti(){
  const colors = ['#fb4eb3','#7c3aed','#ffd84d','#41d675','#3ba9ff'];
  for(let i=0;i<36;i++){
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random()*100 + 'vw';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDelay = Math.random()*0.25 + 's';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),1700);
  }
}

setTimeout(()=>{
  feedback.textContent = 'Tip: tekan jawapan 5 untuk lihat confetti ✨';
}, 1600);
