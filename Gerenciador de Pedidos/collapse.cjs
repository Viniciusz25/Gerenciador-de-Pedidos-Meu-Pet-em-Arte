const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');

const target = `      return \`
    <div class="panel table-shell" style="margin-top:16px">
      <div class="section-head">
        <h2>Despesas de \${monthLabel} <span style="font-size: 0.9rem; font-weight: normal; margin-left: 8px;">(Total: \${money(totalMonth)})</span></h2>
        \${groupIndex === 0 ? \`<button class="mini-button" type="button" id="resetExpenseExamples">Restaurar exemplos</button>\` : ''}
      </div>
      <div class="table-wrap">`;

const replacement = `      return \`
    <div class="panel table-shell" style="margin-top:16px">
      <div class="section-head">
        <h2>Despesas de \${monthLabel} <span style="font-size: 0.9rem; font-weight: normal; margin-left: 8px;">(Total: \${money(totalMonth)})</span></h2>
        <div>
          \${groupIndex > 0 ? \`<button class="mini-button" type="button" onclick="const t = document.getElementById('expense-table-\${groupIndex}'); if(t.style.display==='none'){t.style.display='block';this.innerText='Recolher'}else{t.style.display='none';this.innerText='Expandir'}">Expandir</button>\` : ''}
          \${groupIndex === 0 ? \`<button class="mini-button" type="button" id="resetExpenseExamples">Restaurar exemplos</button>\` : ''}
        </div>
      </div>
      <div class="table-wrap" id="expense-table-\${groupIndex}" style="\${groupIndex > 0 ? 'display:none;' : ''}">`;

// Also check CRLF vs LF
const targetCRLF = target.replace(/\n/g, '\r\n');

if (code.includes(target)) {
  code = code.replace(target, replacement);
} else if (code.includes(targetCRLF)) {
  code = code.replace(targetCRLF, replacement.replace(/\n/g, '\r\n'));
} else {
  console.log("TARGET NOT FOUND");
}

fs.writeFileSync('src/main.js', code);
