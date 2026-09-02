const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');

// Replace all occurrences of the broken pattern back to normal
code = code.replace(/    <\/div>`;\r?\n    }\).join\(\"\"\)}\r?\n  `;\r?\n\}/g, '    </div>\n  `;\n}');

fs.writeFileSync('src/main.js', code);
