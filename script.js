const questions = [
  { q: 'A', title: 'Huruf apakah ini?', answers: ['A', 'B', 'C'], correct: 'A' },
  { q: '3', title: 'Nombor apakah ini?', answers: ['2', '3', '5'], correct: '3' },
  { q: 'ب', title: 'Huruf Jawi apakah ini?', answers: ['Alif', 'Ba', 'Ta'], correct: 'Ba' },
  { q: '5 + 1', title: 'Berapa jawapannya?', answers: ['5', '6', '7'], correct: '6' }
];

let current = 0;
let stars = 0;
let coins = 0;
let streak = 0;
let xp = 0;

const questionTitle = document.getElementById('questionTitle');
const questionBox = document.getElementById('questionBox');
const answerGrid = document.getElementById('answerGrid');
const feedback = document.getElementById('feedback');
const starCount = document.getElementById('starCount');
const coinCount = document.getElementById('coinCount');
const streakCount = document.getElementById('streakCount');
const xpFill = document.getElementById('xpFill');
const pandi = document.getElementById('pandi');
const toast = document.getElementById('toast');
const confetti = document.getElementById('confetti');

function startGame(){
  document.getElementById('gameCard').scrollIntoView({behavior:'smooth'});
  showToast('Jom jawab kuiz pertama! 🐼');
}

function renderQuestion(){
  const item = questions[current];
  questionTitle.textContent = item.title;
  questionBox.textContent = item.q;
  feedback.textContent = 'Pilih jawapan yang betul.';
  answerGrid.innerHTML = '';

  item.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(btn, answer, item.correct);
    answerGrid.appendChild(btn);
  });
}

function checkAnswer(btn, answer, correct){
  const buttons = document.querySelectorAll('.answer-btn');
  buttons.forEach(b => b.disabled = true);

  if(answer === correct){
    btn.classList.add('correct');
    stars += 1;
    coins += 5;
    streak += 1;
    xp = Math.min(100, xp + 25);
    feedback.textContent = 'Betul! Pandi bangga dengan awak 🎉';
    pandi.style.animation = 'pandiFloat .45s ease-in-out 3';
    launchConfetti();
    updateStats();
    setTimeout(() => {
      pandi.style.animation = '';
      current = (current + 1) % questions.length;
      if(xp >= 100){
        xp = 0;
        showToast('Level naik! Hebat sangat! ⭐');
      }
      updateStats();
      renderQuestion();
    }, 1200);
  } else {
    btn.classList.add('wrong');
    streak = 0;
    feedback.textContent = 'Hampir betul. Cuba sekali lagi ya 😊';
    updateStats();
    setTimeout(() => {
      buttons.forEach(b => { b.disabled = false; b.classList.remove('wrong'); });
    }, 850);
  }
}

function updateStats(){
  starCount.textContent = stars;
  coinCount.textContent = coins;
  streakCount.textContent = streak;
  xpFill.style.width = xp + '%';
}

function showReward(){
  showToast('Ganjaran: bintang, syiling, streak & XP! 🎁');
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function launchConfetti(){
  const colors = ['#f97316','#22c55e','#3b82f6','#e879f9','#facc15'];
  for(let i = 0; i < 34; i++){
    const piece = document.createElement('span');
    piece.className = 'piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDelay = Math.random() * .25 + 's';
    confetti.appendChild(piece);
    setTimeout(() => piece.remove(), 1700);
  }
}

renderQuestion();
updateStats();
