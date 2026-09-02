const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');
code = code.replace(
  '    </div>`;\n    }).join("")}\n  `;\n}\n\nfunction startProductEdit',
  '    </div>\n  `;\n}\n\nfunction startProductEdit'
);
// In case of CRLF:
code = code.replace(
  '    </div>`;\r\n    }).join("")}\r\n  `;\r\n}\r\n\r\nfunction startProductEdit',
  '    </div>\r\n  `;\r\n}\r\n\r\nfunction startProductEdit'
);
fs.writeFileSync('src/main.js', code);
