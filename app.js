let q=1,xp=0;
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active')}
function goQuiz(){q=1;document.getElementById('qNo').textContent=q;showScreen('quiz')}
function correct(){xp+=10;document.getElementById('xp').textContent=xp;showScreen('reward')}
function wrong(btn){btn.classList.add('shake');setTimeout(()=>btn.classList.remove('shake'),400)}
function afterReward(){q++;if(q>3){showScreen('blind')}else{document.getElementById('qNo').textContent=q;showScreen('quiz')}}
function openBox(){document.querySelector('.magic-box').classList.add('opened');document.getElementById('boxText').textContent='Tahniah! Adam dapat Topi Pandi Merah 🧢'}
function resetGame(){xp=0;document.getElementById('xp').textContent=0;alert('Game reset. Jom mula semula!')}
