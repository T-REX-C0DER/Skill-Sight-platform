(function(){
  const questions = window.javascriptQuestions || [];
  const total = questions.length;
  let current = 0;
  const answers = new Array(total).fill(null);
  const marked = new Set();
  // track if test has been submitted; only reveal correct answers after submission
  window.SUBMITTED = false;

  const qText = document.getElementById('questionText');
  const optionsDiv = document.getElementById('options');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const markBtn = document.getElementById('markBtn');
  const submitBtn = document.getElementById('submitBtn');
  const navigatorDiv = document.getElementById('questionNavigator');
  const answeredCount = document.getElementById('answeredCount');
  const codeSnippet = document.getElementById('codeSnippet');

  const missingElements = [];
  ['questionText','options','prevBtn','nextBtn','markBtn','submitBtn','questionNavigator','answeredCount','timer'].forEach(id => {
    if(!document.getElementById(id)) missingElements.push(id);
  });
  if(missingElements.length){
    console.error('javascript-test: missing required DOM elements:', missingElements);
  }

  const disabled = total === 0;
  if(disabled){
    if(qText) qText.textContent = 'No questions available.';
    if(prevBtn) prevBtn.disabled = true;
    if(nextBtn) nextBtn.disabled = true;
    if(markBtn) markBtn.disabled = true;
    if(submitBtn) submitBtn.disabled = true;
  }

  function renderNavigator(){
    if(!navigatorDiv) return;
    navigatorDiv.innerHTML = '';
    questions.forEach((q, idx)=>{
      const b = document.createElement('div');
      b.className = 'nav-item' + (answers[idx] != null ? ' answered' : '');
      if(marked.has(idx)) b.className += ' marked';
      if(idx === current) {
        b.className += ' current';
        b.setAttribute('aria-current','true');
      }
      b.textContent = idx+1;
      b.tabIndex = 0;
      b.setAttribute('role','button');
      b.addEventListener('click', ()=>{ goTo(idx); });
      b.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') goTo(idx); });
      navigatorDiv.appendChild(b);
    });
    if(answeredCount) answeredCount.textContent = answers.filter(a=>a!=null).length;
  }

  function render(){
    if(disabled) return;
    try{
      const q = questions[current];
      if(!q) return;

      if(qText) qText.textContent = (current+1) + '. ' + q.question;

      if(q.codeSnippet && codeSnippet){
        codeSnippet.style.display = 'block';
        codeSnippet.textContent = q.codeSnippet;
      } else if(codeSnippet){
        codeSnippet.style.display = 'none';
      }

      if(!optionsDiv) return;
      optionsDiv.innerHTML = '';

      q.options.forEach((opt, i)=>{
        const label = document.createElement('label');
        label.className = 'option';
        label.tabIndex = 0;

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'option';
        input.value = i;
        if(answers[current] === i) {
          input.checked = true;
          label.classList.add('selected');
        }

        input.addEventListener('change', ()=>{
          answers[current] = i;
          render();
        });

        const span = document.createElement('span');
        span.className = 'option-text';
        span.textContent = opt;

        label.appendChild(input);
        label.appendChild(span);

        // Only reveal correct/incorrect markers after submission
        if(window.SUBMITTED){
          if(i === q.answerIndex) label.classList.add('correct');
          if(answers[current] === i && answers[current] !== q.answerIndex) label.classList.add('incorrect');
        }

        label.addEventListener('click', (e)=>{
          if(e.target !== input){
            answers[current] = i;
            render();
          }
        });

        optionsDiv.appendChild(label);
      });

      if(markBtn) markBtn.textContent = marked.has(current)? 'Unmark' : 'Mark for Review';
      if(prevBtn) prevBtn.disabled = current === 0;
      if(nextBtn) nextBtn.textContent = current === total-1? 'Finish' : 'Next Question';
      renderNavigator();

      const pct = Math.round(((current+1)/total) * 100);
      const progressTextEl = document.getElementById('progressText');
      const progressFill = document.getElementById('progressFill');
      if(progressTextEl) progressTextEl.textContent = `Question ${current+1} of ${total}`;
      if(progressFill) progressFill.style.width = pct + '%';
    }catch(err){
      console.error('javascript-test: render error', err);
    }
  }

  function goTo(idx){ current = idx; render(); }

  if(prevBtn) prevBtn.addEventListener('click', ()=>{ if(current>0){ current--; render(); } });
  if(nextBtn) nextBtn.addEventListener('click', ()=>{
    if(current < total-1){ current++; } else { submit(); }
    render();
  });
  if(markBtn) markBtn.addEventListener('click', ()=>{
    if(marked.has(current)) marked.delete(current); else marked.add(current);
    render();
  });
  if(submitBtn) submitBtn.addEventListener('click', submit);

  function submit(auto=false){
    const answered = answers.filter(a=>a!=null).length;
    if(!auto){ if(!confirm(`You answered ${answered} of ${total} questions. Submit assessment?`)) return; }
    let score = 0;
    questions.forEach((q,i)=>{ if(q.answerIndex === answers[i]) score++; });
    if(window.TEST_FAILED) score = 0; // mark as failed
    showResults(score);
  }

  function showResults(score){
    // mark submitted and reveal answers
    window.SUBMITTED = true;
    render();
    const wrong = total - score;
    const overlay = document.createElement('div');
    overlay.id = 'resultsOverlay';
    overlay.innerHTML = `
      <div class="panel">
        <div class="score">Submitted — ${score} / ${total}</div>
        <div class="summary-row">
          <div>✅ Correct: <strong>${score}</strong></div>
          <div>❌ Wrong: <strong>${wrong}</strong></div>
          <div>📊 Score: <strong>${Math.round((score/total)*100)}%</strong></div>
        </div>
        <div id="resultList"></div>
        <div style="text-align:right">
          <button class="btn" id="backToDashboard">Back to Dashboard</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const resultList = document.getElementById('resultList');
    questions.forEach((q,i)=>{
      const item = document.createElement('div');
      item.className = 'q-item';
      const userAnsIdx = answers[i];
      const userText = userAnsIdx == null? '<em>Unanswered</em>' : q.options[userAnsIdx];
      const correctText = q.options[q.answerIndex];
      item.innerHTML = `
        <div style="font-weight:700">${i+1}. ${q.question}</div>
        <div style="margin-top:6px">Your answer: <span class="a">${userText}</span> — Correct: <span class="a">${correctText}</span></div>
      `;
      resultList.appendChild(item);
    });

    document.getElementById('backToDashboard').addEventListener('click', ()=>{
      window.location.href = '../user pages/dashboard.html';
    });
    try{ persistResult(); }catch(e){}
  }

  // persist result so dashboards can pick up verified skills
  function persistResult(){
    try{
      const skillKey = 'JavaScript';
      const payload = { score: scoreForPersist(), total, ts: Date.now() };
      localStorage.setItem('skillResult:' + skillKey, JSON.stringify(payload));
      if(payload.score >= 15){
        localStorage.setItem('skillVerified:' + skillKey, JSON.stringify(payload));
      }
    }catch(e){ console.warn('persistResult failed', e); }
  }

  function scoreForPersist(){
    let s = 0; questions.forEach((q,i)=>{ if(q.answerIndex === answers[i]) s++; });
    if(window.TEST_FAILED) s = 0; return s;
  }

  // persist will be triggered when results are shown

  render();

  let time = 30*60;
  const timerEl = document.getElementById('timer');
  if(timerEl){
    function tick(){
      time--; if(time<0){ submit(); return; }
      const m = Math.floor(time/60).toString().padStart(2,'0');
      const s = (time%60).toString().padStart(2,'0');
      timerEl.textContent = `${m}:${s}`;
    }
    setInterval(tick,1000);
  } else {
    console.warn('javascript-test: timer element not found');
  }
})();

