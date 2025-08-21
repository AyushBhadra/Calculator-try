const display  = document.getElementById('display');
const history  = document.getElementById('history');
const keys     = document.querySelector('.keys');

let justEvaluated = false;

function setDisplay(text){
  display.textContent = text || '0';
}

function append(val){
  // if last op was "=", start fresh on number or dot
  if (justEvaluated && /[0-9.]/.test(val)) {
    setDisplay('');
    justEvaluated = false;
  }
  const cur = display.textContent === '0' ? '' : display.textContent;
  setDisplay(cur + val);
}

function backspace(){
  const cur = display.textContent;
  if (cur.length <= 1){ setDisplay('0'); return; }
  setDisplay(cur.slice(0, -1));
}

function clearAll(){
  setDisplay('0');
  history.textContent = '';
  justEvaluated = false;
}

function isOp(ch){ return ['+','-','*','/'].includes(ch); }

function addOperator(op){
  const cur = display.textContent;
  if (cur === '0' && op !== '-') return; // don't start with op (allow negative if needed)
  if (isOp(cur.slice(-1))) {
    // replace last operator
    setDisplay(cur.slice(0, -1) + op);
  } else {
    setDisplay(cur + op);
  }
  justEvaluated = false;
}

function equals(){
  const expr = display.textContent;
  if (!expr) return;

  try {
    // safe transform already done via data-value; evaluate
    const result = eval(expr);
    history.textContent = expr + ' =';
    setDisplay(String(result));
    justEvaluated = true;
  } catch {
    setDisplay('Error');
    justEvaluated = false;
  }
}

/* --- Click handling (event delegation) --- */
keys.addEventListener('click', (e)=>{
  const b = e.target.closest('.btn');
  if (!b) return;

  const action = b.dataset.action;
  const val    = b.dataset.value;

  if (action === 'clear') return clearAll();
  if (action === 'back')  return backspace();
  if (action === 'equals') return equals();

  if (val){
    // operators come as real JS ops: / * - +
    if (isOp(val)) return addOperator(val);
    return append(val);
  }
});

/* --- Keyboard support --- */
window.addEventListener('keydown', (e)=>{
  const k = e.key;
  if (/\d/.test(k) || k === '.') return append(k);
  if (k === 'x' || k === 'X')     return addOperator('*');
  if (['+','-','*','/'].includes(k)) return addOperator(k);
  if (k === 'Enter' || k === '=') return equals();
  if (k === 'Backspace')          return backspace();
  if (k === 'Escape')             return clearAll();
});
