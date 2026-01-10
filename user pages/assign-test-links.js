(function(){
  const mapping = {
    'JS':'../Tests/javascript-test.html',
    'JAVASCRIPT':'../Tests/javascript-test.html',
    'SQL':'../Tests/sql-test.html',
    'PHP':'../Tests/php-test.html',
    'PY':'../Tests/python-test.html',
    'PYTHON':'../Tests/python-test.html',
    'TS':'../Tests/javascript-test.html'
  };

  function resolveLink(card){
    const markEl = card.querySelector('.skill-mark');
    if(!markEl) return null;
    const key = (markEl.textContent||'').trim().toUpperCase();
    return mapping[key] || null;
  }

  function wire(){
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach(card=>{
      const link = card.querySelector('.card-foot .link.small');
      if(!link) return;
      const target = resolveLink(card);
      if(target){
        link.setAttribute('href', target);
        link.addEventListener('click', ()=>{});
      } else {
        link.setAttribute('href', '#');
        link.addEventListener('click', (e)=>{ e.preventDefault(); alert('This test is not available in the local build yet.'); });
      }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
