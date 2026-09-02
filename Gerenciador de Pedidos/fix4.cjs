const fs = require('fs');
let lines = fs.readFileSync('src/main.js', 'utf8').split('\n');
const index = lines.findIndex(l => l.includes('Excluir</button></td>'));

const insertion = `              </tr>
            \`).join("")}
          </tbody>
        </table>
      </div>
    </div>\`;
    }).join("")}
  \`;
}

function getReportDates(period) {
  const end = new Date(today);
  const start = new Date(today);
  if (period === "7d") {
    start.setDate(today.getDate() - 7);`;

lines.splice(index + 1, 0, ...insertion.split('\n'));
fs.writeFileSync('src/main.js', lines.join('\n'));
