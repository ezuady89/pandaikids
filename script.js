const questions = [
  { q: "2 + 3 = ?", answers: [4, 5, 6, 7], correct: 5 },
  { q: "5 - 2 = ?", answers: [2, 3, 4, 5], correct: 3 },
  { q: "4 + 4 = ?", answers: [6, 7, 8, 9], correct: 8 },
  { q: "10 - 5 = ?", answers: [3, 4, 5, 6], correct: 5 },
  { q: "3 + 6 = ?", answers: [8, 9, 10, 11], correct: 9 }
];

let current = 0;
let stars = 0;
let coins = 0;
let streak = 0;
let xp = 0;
let answered = false;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const questionCountEl = document.getElementById("questionCount");
const starsEl = document.getElementById("stars");
const coinsEl = document.getElementById("coins");
const streakEl = document.getElementById("streak");
const xpFill = document.getElementById("xpFill");
const xpText = document.getElementById("xpText");
const pandiSpeech = document.getElementById("pandiSpeech");
const quizCard = document.getElementById("quizCard");

function startGame() {
  scrollToQuiz();
  pandiSpeech.textContent = "Bagus! Jom jawab soalan pertama.";
}

function scrollToQuiz() {
  document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
}

function loadQuestion() {
  answered = false;
  const item = questions[current];
  questionEl.textContent = item.q;
  questionCountEl.textContent = `Soalan ${current + 1}/${questions.length}`;
  feedbackEl.textContent = "";
  answersEl.innerHTML = "";

  item.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(btn, answer);
    answersEl.appendChild(btn);
  });
}

function checkAnswer(button, answer) {
  if (answered) return;
  answered = true;

  const item = questions[current];

  if (answer === item.correct) {
    button.classList.add("correct");
    stars += 1;
    coins += 10;
    streak += 1;
    xp = Math.min(100, xp + 20);
    feedbackEl.textContent = "Betul! Hebatnya kamu! ⭐";
    feedbackEl.style.color = "#21a34a";
    pandiSpeech.textContent = "Yeay! Jawapan kamu betul!";
    burstConfetti();
  } else {
    button.classList.add("wrong");
    streak = 0;
    feedbackEl.textContent = `Tak apa, jawapan betul ialah ${item.correct}. Cuba lagi ya!`;
    feedbackEl.style.color = "#e04b4b";
    pandiSpeech.textContent = "Tak apa. Pandi tetap bangga!";
    quizCard.classList.add("shake");
    setTimeout(() => quizCard.classList.remove("shake"), 300);
  }

  updateStats();

  setTimeout(() => {
    current++;
    if (current >= questions.length) {
      finishGame();
    } else {
      loadQuestion();
    }
  }, 1150);
}

function updateStats() {
  starsEl.textContent = stars;
  coinsEl.textContent = coins;
  streakEl.textContent = streak;
  xpFill.style.width = `${xp}%`;
  xpText.textContent = `${xp}%`;
}

function finishGame() {
  questionEl.textContent = "Tahniah! Sesi belajar selesai 🎉";
  questionCountEl.textContent = "Selesai";
  answersEl.innerHTML = `<button class="answer-btn" onclick="restartGame()">Main Semula</button>`;
  feedbackEl.textContent = `Kamu kumpul ${stars} bintang dan ${coins} syiling!`;
  feedbackEl.style.color = "#2360a5";
  pandiSpeech.textContent = "Hebat! Esok kita belajar lagi ya.";
  burstConfetti();
}

function restartGame() {
  current = 0;
  stars = 0;
  coins = 0;
  streak = 0;
  xp = 0;
  updateStats();
  pandiSpeech.textContent = "Jom mula semula!";
  loadQuestion();
}

function burstConfetti() {
  const holder = document.getElementById("confetti");
  const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#b983ff"];

  for (let i = 0; i < 36; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    holder.appendChild(piece);
    setTimeout(() => piece.remove(), 1200);
  }
}

loadQuestion();
