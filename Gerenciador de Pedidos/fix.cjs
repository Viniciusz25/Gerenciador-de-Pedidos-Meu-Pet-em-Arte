const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');
code = code.replace(
  /      <\/div>\r?\n    <\/div>\r?\n  `;\r?\n\}/g,
  '      </div>\n    </div>`;\n    }).join("")}\n  `;\n}'
);
fs.writeFileSync('src/main.js', code);
