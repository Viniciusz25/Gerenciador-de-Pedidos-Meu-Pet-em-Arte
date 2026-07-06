const STATUS = [
  "Novo Pedido",
  "Em Producao",
  "Criação do 3D",
  "Fila Impressão",
  "Imprimindo 3D",
  "Pintura",
  "Ornamentos",
  "Pronto para Foto",
  "Embalagem",
  "Pronto para Envio",
  "Enviado",
  "Entregue",
  "Cancelado"
];

const SPREADSHEET_COLUMNS = [
  "Clientes",
  "Produto",
  "Quantidade",
  "Valor por Unidade",
  "Total Venda",
  "Frete SP",
  "Total com Frete",
  "Forma de Pagamento",
  "Data",
  "Entrega",
  "Codigo de Rastreio",
  "Status",
  "Tempo de Producao",
  "Quantidade de Material Utilizado"
];

const defaultProducts = [
  { name: "Chaveiro pet cartoon", unitValue: 69.9, cost: 22.4 },
  { name: "Chaveiro pet premium", unitValue: 89.9, cost: 31.8 },
  { name: "Combo 2 chaveiros", unitValue: 129.9, cost: 44.2 },
  { name: "Chaveiro + arte digital", unitValue: 109.9, cost: 36.6 }
];

const expenseCategories = ["Equipamento", "Material", "Frete", "Anuncios", "Embalagem", "Energia", "Outros"];

const today = new Date();
const pageSize = 6;

const state = {
  orders: load("orders_v2", seedOrders()),
  expenses: load("expenses_v1", seedExpenses()),
  products: load("products_v1", defaultProducts),
  query: "",
  statusFilter: "Todos",
  sortKey: "date",
  sortDirection: "desc",
  page: 1,
  selectedOrder: null,
  compactCards: load("orders_compact_layout", false),
  importRows: [],
  importFileName: "",
  importSummary: ""
  ,shippingRates: load("shipping_rates", { SP: 14.9 })
};

// viewMode: 'list' or 'cards' (cards = small cards)
state.viewMode = load("orders_view_mode", state.compactCards ? "cards" : "list");
state.compactCards = state.viewMode === "cards";

if (!Array.isArray(state.orders)) state.orders = [];
if (!Array.isArray(state.expenses)) state.expenses = seedExpenses();

function seedExpenses() {
  return [
    { id: "EXP-001", name: "Custo equipamento mensal", category: "Equipamento", amount: 320, date: addDays(-2), notes: "Parcela/depreciacao da impressora 3D" },
    { id: "EXP-002", name: "Filamento PLA/PETG", category: "Material", amount: 480, date: addDays(-1), notes: "Reposicao de material para chaveiros" },
    { id: "EXP-003", name: "Fretes e etiquetas", category: "Frete", amount: 210, date: addDays(-4), notes: "Custos nao repassados ao cliente" },
    { id: "EXP-004", name: "Anuncios Instagram", category: "Anuncios", amount: 350, date: addDays(-6), notes: "Campanha mensal de criativos pet" },
    { id: "EXP-005", name: "Embalagens premium", category: "Embalagem", amount: 160, date: addDays(-3), notes: "Saquinhos, tags e caixas" },
    { id: "EXP-006", name: "Energia da producao", category: "Energia", amount: 95, date: addDays(-5), notes: "Estimativa mensal" }
  ];
}

function seedOrders() {
  return [
    makeOrder("Luna Maria", "(11) 98765-4321", "Chaveiro pet premium", 1, 89.9, 14.9, "Pix", -2, 4, "Arte Gerada", "BR987654321BR", 3.5, 24, "Cachorrinha caramelo com lacinho vermelho.", "Alta", "Luna"),
    makeOrder("Thor Almeida", "(11) 97654-3210", "Combo 2 chaveiros", 2, 129.9, 18.5, "Cartao", -8, -1, "Enviado", "BR123456789BR", 5.2, 44, "Dois mockups: um preto e um amarelo suave.", "Média", "Thor"),
    makeOrder("Mel Costa", "(11) 96543-2109", "Chaveiro pet cartoon", 1, 69.9, 12.9, "Pix", 0, 5, "Recebido", "", 2.4, 18, "Cliente enviou foto frontal.", "Baixa", "Mel"),
    makeOrder("Bob Ferreira", "(11) 95432-1098", "Chaveiro + arte digital", 1, 109.9, 15.5, "Boleto", -15, -6, "Pronto para Envio", "BR456789123BR", 4.3, 26, "Arte aprovada com fundo creme.", "Média", "Bob"),
    makeOrder("Nina Rocha", "(11) 94321-0987", "Chaveiro pet premium", 1, 89.9, 13.9, "Pix", -1, 3, "Finalização", "", 3.8, 25, "Aguardando etiqueta de envio.", "Alta", "Nina"),
    makeOrder("Amora Lima", "(11) 93210-9876", "Chaveiro pet cartoon", 2, 69.9, 16.9, "Cartao", -4, 2, "Pintura", "", 4.8, 36, "Pedido com dois pets na mesma embalagem.", "Média", "Amora"),
    makeOrder("Tobias Nunes", "(11) 92109-8765", "Chaveiro pet premium", 1, 89.9, 11.9, "Pix", -30, -22, "Cancelado", "", 0, 0, "Cancelado antes da arte.", "Baixa", "Tobias"),
    makeOrder("Pipoca Martins", "(11) 91098-7654", "Chaveiro + arte digital", 1, 109.9, 19.9, "Cartao", -11, -3, "Montagem", "BR654321987BR", 4.1, 27, "Cliente pediu arte em alta para imprimir.", "Alta", "Pipoca")
  ];
}

function makeOrder(client, whatsapp, product, quantity, unitValue, shipping, payment, dateOffset, deliveryOffset, status, tracking, productionTime, material, notes, priority = "Média", petName = "") {
  const date = addDays(dateOffset);
  const delivery = addDays(deliveryOffset);
  const totalSale = quantity * unitValue;
  return {
    id: nextInternalCode(date),
    client,
    whatsapp: whatsapp || "",
    product,
    quantity,
    unitValue,
    totalSale,
    shipping,
    totalWithShipping: totalSale + shipping,
    payment,
    date,
    delivery,
    tracking,
    status,
    productionTime,
    material,
    notes,
    priority,
    petName,
    petPhoto: "",
    generatedArt: "",
    keychainMockup: "",
    history: [{ at: formatDateTime(new Date()), text: `Pedido criado com status ${status}` }]
  };
}

function addDays(offset) {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function nextInternalCode(dateValue = new Date().toISOString()) {
  const stamp = String(dateValue).replaceAll("-", "").slice(2, 8);
  const random = Math.floor(100 + Math.random() * 899);
  return `MPA-${stamp}-${random}`;
}

function nextExpenseId() {
  const numbers = state.expenses
    .map((expense) => Number(String(expense.id).replace(/\D/g, "")))
    .filter(Boolean);
  return `EXP-${String(Math.max(0, ...numbers) + 1).padStart(3, "0")}`;
}

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(`mpa:${key}`)) || fallback;
  } catch {
    return fallback;
  }
}

function save() {
  localStorage.setItem("mpa:orders_v2", JSON.stringify(state.orders));
  runAutoBackup();
}

function saveExpenses() {
  localStorage.setItem("mpa:expenses_v1", JSON.stringify(state.expenses));
  runAutoBackup();
}

function saveProducts() {
  localStorage.setItem("mpa:products_v1", JSON.stringify(state.products));
  runAutoBackup();
}

function saveShippingRates() {
  localStorage.setItem("mpa:shipping_rates", JSON.stringify(state.shippingRates || {}));
  runAutoBackup();
}

function runAutoBackup() {
  try {
    const backup = {
      app: "Meu Pet em Arte",
      version: 1,
      createdAt: new Date().toISOString(),
      orders: state.orders,
      expenses: state.expenses,
      products: state.products,
      importBatches: load("import_batches", []),
      theme: localStorage.getItem("mpa:theme_v2") || "light"
    };
    localStorage.setItem("mpa:auto_backup", JSON.stringify(backup));
    localStorage.setItem("mpa:auto_backup_time", new Date().toLocaleString("pt-BR"));
  } catch (e) {
    console.error("Erro ao gerar backup automático", e);
  }
}

function restoreAutoBackup() {
  try {
    const raw = localStorage.getItem("mpa:auto_backup");
    if (!raw) throw new Error("Nenhum backup automático encontrado.");
    const backup = JSON.parse(raw);
    const confirmed = window.confirm(`Restaurar o último backup automático feito em ${localStorage.getItem("mpa:auto_backup_time")}? Os dados atuais serão substituídos.`);
    if (!confirmed) return;
    state.orders = backup.orders || [];
    state.expenses = backup.expenses || [];
    state.products = backup.products || defaultProducts;
    state.importRows = [];
    state.importFileName = "";
    state.importSummary = "";
    state.query = "";
    state.statusFilter = "Todos";
    state.page = 1;
    localStorage.setItem("mpa:orders_v2", JSON.stringify(state.orders));
    localStorage.setItem("mpa:expenses_v1", JSON.stringify(state.expenses));
    localStorage.setItem("mpa:products_v1", JSON.stringify(state.products));
    localStorage.setItem("mpa:import_batches", JSON.stringify(Array.isArray(backup.importBatches) ? backup.importBatches : []));
    if (backup.theme) localStorage.setItem("mpa:theme_v2", backup.theme);
    document.body.classList.toggle("dark", backup.theme === "dark");
    render();
    setView("dashboard");
    window.alert("Backup automático restaurado com sucesso!");
  } catch (error) {
    window.alert(error.message);
  }
}

function saveImportBatch(batch) {
  const batches = load("import_batches", []);
  batches.unshift(batch);
  localStorage.setItem("mpa:import_batches", JSON.stringify(batches.slice(0, 20)));
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function productCost(order) {
  const product = state.products.find((item) => item.name === order.product);
  const baseCost = product ? product.cost : order.unitValue * 0.36;
  const materialCost = order.material * 0.11;
  const shippingAssist = order.shipping * 0.12;
  return baseCost * order.quantity + materialCost + shippingAssist;
}

function estimatedProfit(order) {
  return order.totalWithShipping - productCost(order);
}

function filteredOrders() {
  const term = state.query.trim().toLowerCase();
  const filtered = state.orders.filter((order) => {
    const matchesStatus = state.statusFilter === "Todos" || order.status === state.statusFilter;
    const text = [
      order.id,
      order.client,
      order.product,
      order.payment,
      order.tracking,
      order.status
    ].join(" ").toLowerCase();
    return matchesStatus && (!term || text.includes(term));
  });

  filtered.sort((a, b) => {
    const key = state.sortKey;
    const first = a[key];
    const second = b[key];
    const modifier = state.sortDirection === "asc" ? 1 : -1;
    if (typeof first === "number") return (first - second) * modifier;
    return String(first).localeCompare(String(second), "pt-BR") * modifier;
  });

  return filtered;
}

function metrics() {
  const currentMonth = today.toISOString().slice(0, 7);
  const currentYear = today.toISOString().slice(0, 4);
  const active = state.orders.filter((order) => order.status !== "Cancelado");
  const currentMonthOrders = active.filter((order) => order.date && order.date.startsWith(currentMonth));
  const currentMonthExpenses = state.expenses.filter((expense) => expense.date && expense.date.startsWith(currentMonth));

  const revenue = currentMonthOrders.reduce((sum, order) => sum + order.totalWithShipping, 0);
  const yearlyRevenue = active.filter((order) => order.date && order.date.startsWith(currentYear)).reduce((sum, order) => sum + order.totalWithShipping, 0);
  const profit = currentMonthOrders.reduce((sum, order) => sum + estimatedProfit(order), 0);
  const shippingTotal = currentMonthOrders.reduce((sum, order) => sum + Number(order.shipping || 0), 0);
  const expenses = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  
  // Somando o tempo total de produção dos pedidos do mês corrente (tempo total de uso de máquina)
  const totalMachineTime = currentMonthOrders.reduce((sum, order) => sum + Number(order.productionTime || 0), 0);
  
  const keychains = currentMonthOrders.reduce((sum, order) => sum + Number(order.quantity || 0), 0);

  const profitAfterExpenses = profit - expenses;
  // Ticket médio calculando despesas: (Faturamento do mês - Despesas) / número de pedidos ativos do mês
  const ticketMedio = (revenue - expenses) / Math.max(currentMonthOrders.length, 1);

  return {
    total: currentMonthOrders.length,
    production: currentMonthOrders.filter((order) => order.status === "Em Producao").length,
    sent: currentMonthOrders.filter((order) => order.status === "Enviado").length,
    revenue,
    yearlyRevenue,
    shippingTotal,
    totalMachineTime,
    profit,
    expenses,
    profitAfterExpenses,
    ticketMedio,
    keychains,
    pets: currentMonthOrders.length
  };
}

function render() {
  ensureAppStructure();
  try { renderDashboard(); } catch (e) { console.error('renderDashboard error', e); }
  try { renderOrders(); } catch (e) { console.error('renderOrders error', e); }
  try { renderProduction(); } catch (e) { console.error('renderProduction error', e); }
  try { renderProducts(); } catch (e) { console.error('renderProducts error', e); }
  try { renderExpenses(); } catch (e) { console.error('renderExpenses error', e); }
  try { renderReports(); } catch (e) { console.error('renderReports error', e); }
  try { renderGallery(); } catch (e) { console.error('renderGallery error', e); }
  try { renderImport(); } catch (e) { console.error('renderImport error', e); }
  try { renderAdmin(); } catch (e) { console.error('renderAdmin error', e); }
}

function renderProducts() {
  const productsList = state.products;
  const avgPrice = productsList.length ? productsList.reduce((s, p) => s + p.unitValue, 0) / productsList.length : 0;
  const avgCost = productsList.length ? productsList.reduce((s, p) => s + p.cost, 0) / productsList.length : 0;
  const avgMargin = avgPrice > 0 ? ((avgPrice - avgCost) / avgPrice * 100) : 0;

  document.getElementById("productsView").innerHTML = `
    <div class="grid metric-grid">
      ${metric("Produtos cadastrados", productsList.length, "Catálogo ativo")}
      ${metric("Preço médio", money(avgPrice), "Venda unitária")}
      ${metric("Custo médio", money(avgCost), "Base de produção")}
      ${metric("Margem média", avgMargin.toFixed(1) + "%", "Lucro bruto estimado")}
    </div>

    <div class="grid content-grid">
      <form class="panel form-grid" id="productForm">
        <div class="wide">
          <span class="eyebrow">Catálogo</span>
          <h2>Cadastrar Novo Produto</h2>
          <p class="muted">Preencha os campos abaixo. O produto ficará disponível para seleção nos novos pedidos.</p>
        </div>
        <label class="wide">Nome do Produto
          <input name="name" required placeholder="Ex: Chaveiro pet premium" autocomplete="off">
        </label>
        <label>Preço de Venda (R$)
          <input name="unitValue" required type="number" min="0" step="0.01" placeholder="0,00">
        </label>
        <label>Custo Unitário Base (R$)
          <input name="cost" required type="number" min="0" step="0.01" placeholder="0,00">
        </label>
        <div class="wide" style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="primary-button" type="submit">＋ Adicionar Produto</button>
        </div>
      </form>

      <div class="panel">
        <div class="section-head">
          <div>
            <h2>Produtos Ativos</h2>
            <p class="muted">${productsList.length} produto${productsList.length !== 1 ? "s" : ""} no catálogo</p>
          </div>
        </div>
        <div class="product-cards-grid">
          ${productsList.length ? productsList.map((product, index) => {
            const margin = product.unitValue > 0 ? ((product.unitValue - product.cost) / product.unitValue * 100) : 0;
            const profit = product.unitValue - product.cost;
            return `
            <div class="product-card">
              <div class="product-card-header">
                <div class="product-card-icon">${product.name.includes("Combo") ? "📦" : product.name.includes("arte") || product.name.includes("Arte") ? "🎨" : "🔑"}</div>
                <div class="product-card-info">
                  <strong>${escapeHtml(product.name)}</strong>
                  <span class="product-card-margin ${margin >= 50 ? "margin-high" : margin >= 30 ? "margin-mid" : "margin-low"}">${margin.toFixed(0)}% margem</span>
                </div>
                <button class="mini-button danger-button" type="button" data-delete-product-index="${index}" title="Excluir produto">✕</button>
              </div>
              <div class="product-card-body">
                <div class="product-card-field">
                  <small>Preço de venda</small>
                  <input class="cell-input money-cell" data-product-edit="${index}" data-field="unitValue" type="number" min="0" step="0.01" value="${product.unitValue}">
                </div>
                <div class="product-card-field">
                  <small>Custo base</small>
                  <input class="cell-input money-cell" data-product-edit="${index}" data-field="cost" type="number" min="0" step="0.01" value="${product.cost}">
                </div>
              </div>
              <div class="product-card-footer">
                <span>Lucro unit.: <strong>${money(profit)}</strong></span>
              </div>
            </div>`;
          }).join("") : `<p class="muted" style="padding:24px;text-align:center">Nenhum produto cadastrado. Use o formulário ao lado para adicionar.</p>`}
        </div>
      </div>
    </div>
  `;
}

function ensureAppStructure() {
  const main = document.querySelector(".main");
  if (main && !document.getElementById("expensesView")) {
    const section = document.createElement("section");
    section.className = "view";
    section.id = "expensesView";
    section.dataset.title = "Despesas";
    const reports = document.getElementById("reportsView");
    main.insertBefore(section, reports || null);
  }

  const sideNav = document.getElementById("sideNav");
  if (sideNav && !sideNav.querySelector('[data-view="expenses"]')) {
    const button = document.createElement("button");
    button.className = "nav-item";
    button.dataset.view = "expenses";
    button.type = "button";
    button.textContent = "Despesas";
    const reportsButton = sideNav.querySelector('[data-view="reports"]');
    sideNav.insertBefore(button, reportsButton || null);
  }

  const mobileNav = document.getElementById("mobileNav");
  if (mobileNav && !mobileNav.querySelector('[data-view="expenses"]')) {
    const button = document.createElement("button");
    button.className = "mobile-item";
    button.dataset.view = "expenses";
    button.type = "button";
    button.textContent = "Despesas";
    const reportsButton = mobileNav.querySelector('[data-view="reports"]');
    mobileNav.insertBefore(button, reportsButton || null);
  }
}

function setView(view) {
  ensureAppStructure();
  const targetView = document.getElementById(`${view}View`) ? view : "dashboard";
  document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
  document.getElementById(`${targetView}View`).classList.add("active");
  document.getElementById("viewTitle").textContent = document.getElementById(`${targetView}View`).dataset.title;
  document.querySelectorAll("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === targetView));
}

function renderDashboard() {
  const data = metrics();
  const currentYear = new Date().getFullYear();
  const currentMonth = today.toISOString().slice(0, 7);
  const currentMonthOrders = state.orders.filter((order) => order.status !== "Cancelado" && order.date && order.date.startsWith(currentMonth));
  document.getElementById("dashboardView").innerHTML = `
    <section class="hero-panel panel">
      <div>
        <span class="eyebrow">SaaS pet/cartoon premium</span>
        <h2>+ de ${data.pets} pets ja viraram arte &hearts;</h2>
        <p>Controle cada chaveiro personalizado desde o pedido ate a etiqueta de envio, com numeros claros e uma experiencia gostosa de usar.</p>
        <div class="quick-actions">
          <button class="primary-button" type="button" data-open-order>Novo pedido</button>
          <button class="ghost-button" type="button" data-view="orders">Ver tabela</button>
        </div>
      </div>
      <div class="logo-showcase" aria-label="Logo Meu Pet em Arte">
        <img src="assets/logo-meu-pet-em-arte.png" alt="Logo Meu Pet em Arte" />
      </div>
      <div class="pet-showcase" aria-hidden="true">
        <span class="paw paw-a"></span>
        <span class="paw paw-b"></span>
        <span class="star star-a">*</span>
        <span class="star star-b">*</span>
        <span class="heart">&hearts;</span>
      </div>
    </section>

    <div class="grid metric-grid">
      ${metric("Total de pedidos", data.total, "Base completa")}
      ${metric("Em producao", data.production, "Chaveiros no atelie")}
      ${metric("Pedidos enviados", data.sent, "Com rastreio")}
      ${metric("Faturamento do mes", money(data.revenue), "Vendas ativas")}
      ${metric("Faturamento do Ano", money(data.yearlyRevenue), `Total em ${currentYear}`)}
      ${metric("Despesas do mes", money(data.expenses), "Operacao e marketing")}
      ${metric("Lucro estimado", money(data.profitAfterExpenses), "Liquido aproximado")}
      ${metric("Ticket Medio (Liq)", money(data.ticketMedio), "Despesas deduzidas")}
      ${metric("Tempo de Maquina", `${data.totalMachineTime.toFixed(1)}h`, "Uso total ativo")}
    </div>

    <div class="grid content-grid">
      <div class="panel">
        <div class="section-head"><h3>Fila emocional de producao</h3><button class="mini-button" data-view="orders">Organizar</button></div>
        <div class="status-strip">${STATUS.map((status) => `<span class="status-pill ${statusClass(status)}">${status}<b>${currentMonthOrders.filter((order) => order.status === status).length}</b></span>`).join("")}</div>
      </div>
      <div class="panel">
        <h3>Proximas entregas</h3>
        <div class="list">${(() => {
          const todayStr = today.toISOString().slice(0, 10);
          const upcoming = currentMonthOrders
            .filter((order) => order.status !== "Entregue" && order.status !== "Cancelado" && order.delivery)
            .sort((a, b) => (a.delivery || "9999").localeCompare(b.delivery || "9999"))
            .slice(0, 6);
          if (!upcoming.length) return `<p class="muted" style="padding:12px 0">Nenhuma entrega pendente.</p>`;
          return upcoming.map((order) => {
            const isLate = order.delivery < todayStr;
            const isToday = order.delivery === todayStr;
            const tag = isLate ? `<span class="status-pill status-cancelado" style="font-size:.68rem;padding:2px 8px">Atrasado</span>` : isToday ? `<span class="status-pill status-finalizado" style="font-size:.68rem;padding:2px 8px">Hoje</span>` : "";
            return `
            <button class="soft-row" data-detail="${order.id}">
              <span><strong>${order.client}</strong><small>${order.product}</small></span>
              <span style="display:flex;align-items:center;gap:6px">${tag}<b>${formatDate(order.delivery)}</b></span>
            </button>`;
          }).join("");
        })()}</div>
      </div>
    </div>
  `;
}

function metric(label, value, helper) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${helper}</small></article>`;
}

function tableHeader(key, label) {
  const mark = state.sortKey === key ? (state.sortDirection === "asc" ? "up" : "down") : "";
  return `<th><button class="sort-button" data-sort="${key}">${label}<span>${mark}</span></button></th>`;
}

function renderOrders() {
  const orders = filteredOrders();
  try { console.debug("renderOrders: state.orders.length=", state.orders && state.orders.length, "filtered.length=", orders.length, state.viewMode); } catch(e) { console.debug('renderOrders debug error', e); }
  const pages = Math.max(Math.ceil(orders.length / pageSize), 1);
  state.page = Math.min(state.page, pages);
  const pageOrders = orders.slice((state.page - 1) * pageSize, state.page * pageSize);
  document.getElementById("ordersView").innerHTML = `
    <div class="panel table-shell">
      <div class="table-toolbar">
        <input class="search-input" id="orderSearch" value="${escapeHtml(state.query)}" placeholder="Buscar cliente, produto, rastreio ou status" />
        <select id="statusFilter">
          <option>Todos</option>
          ${STATUS.map((status) => `<option ${state.statusFilter === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
        <button class="ghost-button" type="button" data-toggle-view title="${state.viewMode === 'list' ? 'Exibir em cartões pequenos' : 'Exibir em lista'}">
          ${state.viewMode === 'list' ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>'}
        </button>
        <button class="primary-button" type="button" data-open-order>Novo pedido</button>
      </div>
      ${state.viewMode === 'list' ? `
      <div class="panel table-shell">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                ${tableHeader("client", "Cliente")}
                ${tableHeader("product", "Produto")}
                ${tableHeader("quantity", "Quantidade")}
                ${tableHeader("unitValue", "Valor por Unidade")}
                ${tableHeader("totalSale", "Total Venda")}
                ${tableHeader("shipping", "Frete SP")}
                ${tableHeader("totalWithShipping", "Total com Frete")}
                ${tableHeader("payment", "Forma de Pagamento")}
                ${tableHeader("date", "Data")}
                ${tableHeader("delivery", "Entrega")}
                ${tableHeader("tracking", "Codigo de Rastreio")}
                ${tableHeader("status", "Status")}
                ${tableHeader("productionTime", "Tempo de Producao")}
                ${tableHeader("material", "Quantidade de Material Utilizado")}
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              ${pageOrders.map(orderRow).join("")}
            </tbody>
          </table>
        </div>
      </div>
      ` : `
      <div class="orders-grid${state.compactCards ? " compact" : ""}">
        ${pageOrders.length ? pageOrders.map(orderCard).join("") : `<div class="empty-state">Nenhum pedido encontrado.</div>`}
      </div>
      `}
      <div class="pagination">
        <span>${orders.length} pedidos encontrados</span>
        <div>
          <button class="mini-button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>Anterior</button>
          <strong>${state.page} / ${pages}</strong>
          <button class="mini-button" data-page="${state.page + 1}" ${state.page === pages ? "disabled" : ""}>Proxima</button>
        </div>
      </div>
    </div>
  `;
}

function orderCard(order) {
  const compact = state.compactCards;
  return `
    <article class="order-card${compact ? " compact" : ""}">
      <div class="order-card-head">
        <div>
          <strong>${escapeHtml(order.client)}</strong>
          <small>${escapeHtml(order.id)}</small>
        </div>
        <span class="status-pill ${statusClass(order.status)}">${escapeHtml(order.status)}</span>
      </div>
      <div class="order-card-body">
        <div class="order-card-row">
          <div>
            <span>Produto</span>
            <strong>${escapeHtml(order.product)}</strong>
          </div>
          <div>
            <span>Quantidade</span>
            <strong>${order.quantity} unidade${order.quantity === 1 ? "" : "s"}</strong>
          </div>
        </div>
        <div class="order-card-row">
          <div>
            <span>Pagamento</span>
            <strong>${escapeHtml(order.payment)}</strong>
          </div>
          <div>
            <span>Frete</span>
            <strong>${money(order.shipping)}</strong>
          </div>
        </div>
        <div class="order-card-summary">
          <div>${detailLine("Venda", money(order.totalSale))}</div>
          <div>${detailLine("Total c/ frete", money(order.totalWithShipping))}</div>
        </div>
        <div class="order-card-grid">
          <div>${detailLine("Data", formatDate(order.date))}</div>
          <div>${detailLine("Entrega", formatDate(order.delivery))}</div>
          <div>${detailLine("Rastreio", order.tracking ? escapeHtml(order.tracking) : "Pendente")}</div>
          <div>${detailLine("Producao", `${order.productionTime} h`)}</div>
        </div>
        ${compact ? "" : `
        <div class="order-card-notes">
          <span>Observacoes</span>
          <p>${escapeHtml(order.notes || "Sem observacoes")}</p>
        </div>
        `}
      </div>
      <div class="order-card-actions">
        <button class="mini-button" type="button" data-detail="${order.id}">Abrir</button>
        <button class="mini-button" type="button" data-print="${order.id}">Imprimir</button>
        <button class="mini-button danger-button" type="button" data-delete-order="${order.id}">Excluir</button>
      </div>
    </article>
  `;
}

function orderRow(order) {
  return `
    <tr>
      <td>
        <input class="cell-input name-cell" data-edit="${order.id}" data-field="client" value="${escapeHtml(order.client)}">
        <button class="link-button compact-link" data-detail="${order.id}"><small>${order.id}</small></button>
      </td>
      <td>
        <select class="cell-input product-cell" data-edit="${order.id}" data-field="product">
          ${state.products.map((product) => `<option value="${product.name}" ${product.name === order.product ? "selected" : ""}>${product.name}</option>`).join("")}
        </select>
      </td>
      <td><input class="cell-input" data-edit="${order.id}" data-field="quantity" type="number" min="1" value="${order.quantity}"></td>
      <td><input class="cell-input money-cell" data-edit="${order.id}" data-field="unitValue" type="number" min="0" step="0.01" value="${order.unitValue}"></td>
      <td><span class="readonly-cell">${money(order.totalSale)}</span></td>
      <td><input class="cell-input money-cell" data-edit="${order.id}" data-field="shipping" type="number" min="0" step="0.01" value="${order.shipping}"></td>
      <td><span class="readonly-cell">${money(order.totalWithShipping)}</span></td>
      <td>
        <select class="cell-input payment-cell" data-edit="${order.id}" data-field="payment">
          ${["Pix", "Cartao", "Boleto", "Dinheiro"].map((payment) => `<option ${payment === order.payment ? "selected" : ""}>${payment}</option>`).join("")}
        </select>
      </td>
      <td><input class="cell-input date-cell" data-edit="${order.id}" data-field="date" type="date" value="${order.date}"></td>
      <td><input class="cell-input date-cell" data-edit="${order.id}" data-field="delivery" type="date" value="${order.delivery}"></td>
      <td><input class="cell-input wide-cell" data-edit="${order.id}" data-field="tracking" value="${order.tracking}"></td>
      <td><select class="status-select ${statusClass(order.status)}" data-status="${order.id}">${STATUS.map((status) => `<option ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
      <td><input class="cell-input" data-edit="${order.id}" data-field="productionTime" type="number" step="0.1" value="${order.productionTime}"> h</td>
      <td><input class="cell-input" data-edit="${order.id}" data-field="material" type="number" step="0.1" value="${order.material}"> g</td>
      <td class="row-actions">
        <button class="mini-button" data-detail="${order.id}">Abrir</button>
        <button class="mini-button" data-print="${order.id}">Imprimir</button>
        <button class="mini-button danger-button" data-delete-order="${order.id}">Excluir</button>
      </td>
    </tr>
  `;
}

function expenseTotalsByCategory() {
  const currentMonth = today.toISOString().slice(0, 7);
  const currentMonthExpenses = state.expenses.filter((expense) => expense.date && expense.date.startsWith(currentMonth));
  return expenseCategories.map((category) => ({
    category,
    total: currentMonthExpenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  })).filter((item) => item.total > 0);
}

const productionStatuses = [
  "Recebido",
  "Arte Gerada",
  "Impressão",
  "Pintura",
  "Montagem",
  "Finalização",
  "Pronto para Envio",
  "Enviado"
];

function productionBadgeColor(status, delivery) {
  const todayStr = today.toISOString().slice(0,10);
  if (delivery && delivery < todayStr && !["Pronto para Envio","Enviado","Cancelado"].includes(status)) return "#e04949"; // atrasado
  const completed = ["Pronto para Envio","Enviado"];
  const notStarted = ["Recebido"];
  if (completed.includes(status)) return "#2fbf71"; // green
  if (notStarted.includes(status)) return "#9aa0a6"; // gray
  return "#2b7cff"; // blue - in progress
}

function orderProgress(order) {
  const index = productionStatuses.indexOf(order.status);
  if (index < 0) return 0;
  return Math.round(((index + 1) / productionStatuses.length) * 100);
}

function orderIsOverdue(order) {
  const todayStr = today.toISOString().slice(0, 10);
  return order.delivery && order.delivery < todayStr && !["Pronto para Envio", "Enviado", "Cancelado"].includes(order.status);
}

function renderProduction() {
  state.productionSearch = state.productionSearch || "";
  state.productionFilter = state.productionFilter || "Todos";

  const term = String(state.productionSearch || "").trim().toLowerCase();
  let list = state.orders.filter((order) => productionStatuses.includes(order.status));
  if (state.productionFilter && state.productionFilter !== "Todos") {
    list = list.filter((order) => order.status === state.productionFilter);
  }
  if (term) {
    list = list.filter((order) => {
      const petName = order.petName || (order.client || "").split(" ")[0] || "";
      return `${order.id} ${order.client} ${order.product} ${petName} ${order.priority}`.toLowerCase().includes(term);
    });
  }

  const currentMonth = today.toISOString().slice(0, 7);
  const inProductionCount = state.orders.filter((order) => productionStatuses.includes(order.status) && order.status !== "Enviado").length;
  const delayedCount = state.orders.filter((order) => orderIsOverdue(order) && order.date && order.date.startsWith(currentMonth)).length;

  const grouped = productionStatuses.reduce((acc, status) => ({ ...acc, [status]: [] }), {});
  list.forEach((order) => {
    if (!grouped[order.status]) grouped[order.status] = [];
    grouped[order.status].push(order);
  });

  document.getElementById("productionView").innerHTML = `
    <div class="grid metric-grid">
      ${metric("Pedidos em producao", inProductionCount, "Ativos")}
      ${metric("Pedidos atrasados", delayedCount, "Atenção imediata")}
      ${metric("Total geral", state.orders.length, "Base total")}
    </div>

    <div class="panel">
      <div class="section-head production-header">
        <div>
          <span class="eyebrow">Painel de Produção</span>
          <h2>Controle de Produção</h2>
          <p class="muted">Arraste os pedidos entre etapas para atualizar o fluxo e acompanhe prazos e entregas com rapidez.</p>
        </div>
        <div class="production-toolbar">
          <div class="production-search">
            <span class="search-icon">🔎</span>
            <input id="productionSearch" class="search-input" placeholder="Buscar pedido, cliente, produto ou pet" value="${escapeHtml(state.productionSearch)}" />
          </div>
          <select id="productionStatusFilter" class="production-filter-select">
            ${["Todos", ...productionStatuses].map((s) => `<option ${state.productionFilter === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
          <button class="primary-button small" type="button" data-open-order>+ Novo pedido</button>
        </div>
      </div>
      <div class="kanban-board">
        ${productionStatuses.map((status) => {
          const items = grouped[status] || [];
          return `
            <section class="kanban-column">
              <div class="kanban-column-head">
                <div>
                  <h3>${status}</h3>
                  <small>${items.length} pedido${items.length !== 1 ? "s" : ""}</small>
                </div>
              </div>
              <div class="kanban-column-body" data-status="${status}">
                ${items.length ? items.sort((a, b) => a.delivery.localeCompare(b.delivery)).map((order) => {
                  const overdue = orderIsOverdue(order);
                  const progress = orderProgress(order);
                  const petName = order.petName || (order.client || "").split(" ")[0] || "-";
                  const photoStyle = order.petPhoto ? `style="background-image:url('${order.petPhoto}')"` : "";
                  const overdueClass = overdue ? ' class="kanban-card-overdue"' : "";
                  return `
                    <article class="kanban-card ${overdue ? "overdue" : ""}" draggable="true" data-order="${order.id}">
                      <div class="kanban-card-header">
                        <div>
                          <small class="muted">${formatDate(order.date)}</small>
                          <strong>${order.id}</strong>
                        </div>
                        <span class="status-pill" style="background:${productionBadgeColor(order.status, order.delivery)}">${order.status}</span>
                      </div>
                          <div class="kanban-card-body">
                        <div class="kanban-card-photo" ${photoStyle}></div>
                        <div>
                          <p class="kanban-card-title">${escapeHtml(order.petName || petName)}</p>
                          <p class="kanban-card-subtitle">${escapeHtml(order.product)} • ${escapeHtml(order.client)}</p>
                          <p class="muted">Pedido ${order.id}</p>
                        </div>
                      </div>
                      <div class="kanban-card-meta">
                        <span>Data: <strong>${formatDate(order.date)}</strong></span>
                        <span>Prazo: <strong${overdueClass}>${formatDate(order.delivery)}</strong></span>
                        <span class="priority-pill priority-${String(order.priority).toLowerCase().normalize("NFD").replace(/[ -]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}">${escapeHtml(order.priority)}</span>
                      </div>
                      <div class="kanban-progress"><span style="width:${progress}%"></span></div>
                      <div class="kanban-card-footer">
                        <select data-status="${order.id}" class="production-status-select">
                          ${productionStatuses.map((s) => `<option ${order.status === s ? "selected" : ""}>${s}</option>`).join("")}
                        </select>
                        <button class="mini-button" type="button" data-detail="${order.id}">Detalhes</button>
                      </div>
                    </article>`;
                }).join("") : `<div class="kanban-empty">Nenhum pedido aqui.</div>`}
              </div>
            </section>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderExpenses() {
  const data = metrics();
  const currentMonth = today.toISOString().slice(0, 7);
  const currentMonthExpenses = state.expenses.filter((expense) => expense.date && expense.date.startsWith(currentMonth));
  const total = data.expenses;
  const biggest = currentMonthExpenses.slice().sort((a, b) => Number(b.amount) - Number(a.amount))[0];
  document.getElementById("expensesView").innerHTML = `
    <div class="grid metric-grid">
      ${metric("Despesas do mes", money(total), "Total operacional")}
      ${metric("Maior despesa", biggest ? money(biggest.amount) : money(0), biggest ? biggest.name : "Sem despesas")}
      ${metric("Categorias", expenseTotalsByCategory().length, "Tipos com lancamentos")}
      ${metric("Lucro pos despesas", money(metrics().profitAfterExpenses), "Estimativa liquida")}
    </div>

    <div class="grid content-grid">
      <form class="panel form-grid" id="expenseForm">
        <div class="wide">
          <span class="eyebrow">Novo lancamento</span>
          <h2>Adicionar despesa</h2>
        </div>
        <label>Descricao
          <input name="name" required placeholder="Ex: Anuncios Instagram">
        </label>
        <label>Categoria
          <select name="category">${expenseCategories.map((category) => `<option>${category}</option>`).join("")}</select>
        </label>
        <label>Valor
          <input name="amount" required type="number" min="0" step="0.01" placeholder="0,00">
        </label>
        <label>Data
          <input name="date" required type="date" value="${addDays(0)}">
        </label>
        <label class="wide">Observacao
          <textarea name="notes" rows="3" placeholder="Detalhes do custo"></textarea>
        </label>
        <div class="wide">
          <button class="primary-button" type="submit">Salvar despesa</button>
        </div>
      </form>

      <div class="panel">
        <h2>Resumo por categoria</h2>
        <div class="list">
          ${expenseTotalsByCategory().map((item) => `
            <div class="soft-row">
              <span><strong>${item.category}</strong><small>${Math.round((item.total / Math.max(total, 1)) * 100)}% do total</small></span>
              <b>${money(item.total)}</b>
            </div>
          `).join("") || `<p class="muted">Nenhuma despesa cadastrada.</p>`}
        </div>
      </div>
      <div class="panel">
        <h2>Tarifas de frete por Estado</h2>
        <form id="shippingRatesForm" class="panel form-grid">
          <label>Estado (UF)
            <input name="uf" required maxlength="2" placeholder="SP">
          </label>
          <label>Valor do frete
            <input name="rate" required type="number" min="0" step="0.01" placeholder="0,00">
          </label>
          <div class="wide">
            <button class="primary-button" type="submit">Salvar tarifa</button>
          </div>
        </form>
        <div class="list">
          ${Object.entries(state.shippingRates || {}).length ? Object.entries(state.shippingRates).map(([uf, rate]) => `
            <div class="soft-row">
              <span><strong>${uf}</strong></span>
              <b>${money(rate)}</b>
              <button class="mini-button danger-button" type="button" data-delete-shipping="${uf}">Excluir</button>
            </div>
          `).join("") : `<p class="muted">Nenhuma tarifa cadastrada.</p>`}
        </div>
      </div>
    </div>

    <div class="panel table-shell" style="margin-top:16px">
      <div class="section-head">
        <h2>Lista de despesas</h2>
        <button class="mini-button" type="button" id="resetExpenseExamples">Restaurar exemplos</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Descricao</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Observacao</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            ${state.expenses.map((expense) => `
              <tr>
                <td><input class="cell-input name-cell" data-expense-edit="${expense.id}" data-field="name" value="${escapeHtml(expense.name)}"></td>
                <td>
                  <select class="cell-input product-cell" data-expense-edit="${expense.id}" data-field="category">
                    ${expenseCategories.map((category) => `<option ${category === expense.category ? "selected" : ""}>${category}</option>`).join("")}
                  </select>
                </td>
                <td><input class="cell-input money-cell" data-expense-edit="${expense.id}" data-field="amount" type="number" min="0" step="0.01" value="${expense.amount}"></td>
                <td><input class="cell-input date-cell" data-expense-edit="${expense.id}" data-field="date" type="date" value="${expense.date}"></td>
                <td><input class="cell-input note-cell" data-expense-edit="${expense.id}" data-field="notes" value="${escapeHtml(expense.notes || "")}"></td>
                <td class="row-actions"><button class="mini-button danger-button" type="button" data-delete-expense="${expense.id}">Excluir</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderReports() {
  const reportMetrics = metrics();
  const totalOrders = state.orders.length;
  const totalSales = state.orders.reduce((sum, order) => sum + order.totalWithShipping, 0);
  const totalShipping = state.orders.reduce((sum, order) => sum + order.shipping, 0);
  const statusMax = Math.max(...STATUS.map((status) => state.orders.filter((order) => order.status === status).length), 1);
  const productSales = state.products
    .map((product) => ({
      name: product.name,
      total: state.orders.filter((order) => order.product === product.name).reduce((sum, order) => sum + order.quantity, 0)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const last6Months = [];
  const todayDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(todayDate.getFullYear(), todayDate.getMonth() - i, 1);
    const monthKey = d.toISOString().slice(0, 7);
    const label = `${monthNames[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    const totalSalesInMonth = state.orders
      .filter((o) => o.status !== "Cancelado" && o.date && o.date.startsWith(monthKey))
      .reduce((sum, o) => sum + o.totalWithShipping, 0);
    last6Months.push({ label, value: totalSalesInMonth });
  }

  const maxValue = Math.max(...last6Months.map((m) => m.value), 1);
  const chartHtml = last6Months
    .map((m) => {
      const pct = Math.round((m.value / maxValue) * 100);
      const height = Math.max(pct, 10);
      return `<span class="bar" style="height:${height}%" title="${money(m.value)}"><small>${m.label}<br><b>${money(m.value)}</b></small></span>`;
    })
    .join("");

  const previousMonth = last6Months[last6Months.length - 2];
  const currentMonth = last6Months[last6Months.length - 1];
  
  // Crescimento comparando média dos últimos 3 meses com média dos 3 meses anteriores
  const last3Months = last6Months.slice(-3);
  const prev3Months = last6Months.slice(-6, -3);
  const avg3Current = last3Months.reduce((sum, m) => sum + m.value, 0) / last3Months.length;
  const avg3Previous = prev3Months.length > 0 ? prev3Months.reduce((sum, m) => sum + m.value, 0) / prev3Months.length : 0;
  
  const monthlyGrowth = avg3Previous && avg3Previous > 0
    ? ((avg3Current - avg3Previous) / avg3Previous) * 100
    : avg3Current > 0 ? 100 : 0;
  const growthLabel = monthlyGrowth === 0 ? "0%" : `${monthlyGrowth > 0 ? "+" : ""}${monthlyGrowth.toFixed(1)}%`;
  const growthClass = monthlyGrowth > 0 ? "growth-positive" : monthlyGrowth < 0 ? "growth-negative" : "growth-neutral";
  const growthIcon = monthlyGrowth > 0 ? "▲" : monthlyGrowth < 0 ? "▼" : "▬";

  document.getElementById("reportsView").innerHTML = `
    <div class="grid report-grid">
      <div class="panel report-summary-panel">
        <div class="report-summary-grid">
          <div class="report-summary-card">
            <span>Total de pedidos</span>
            <strong>${totalOrders}</strong>
          </div>
          <div class="report-summary-card">
            <span>Vendas totais</span>
            <strong>${money(totalSales)}</strong>
          </div>
          <div class="report-summary-card">
            <span>Ticket médio</span>
            <strong>${money(reportMetrics.ticketMedio)}</strong>
          </div>
          <div class="report-summary-card report-growth-card">
            <span>Crescimento mensal</span>
            <strong class="growth-pill ${growthClass}">${growthIcon} ${growthLabel}</strong>
          </div>
          <div class="report-summary-card">
            <span>Lucro estimado</span>
            <strong>${money(reportMetrics.profitAfterExpenses)}</strong>
          </div>
          <div class="report-summary-card">
            <span>Custo de frete</span>
            <strong>${money(totalShipping)}</strong>
          </div>
        </div>
      </div>
      <div class="panel">
        <h3>Vendas mensais</h3>
        <div class="sales-list">
          ${last6Months.map((m) => {
            const pct = Math.round((m.value / maxValue) * 100);
            return `
              <div class="sales-card">
                <div class="sales-card-head">
                  <span>${m.label}</span>
                  <strong>${money(m.value)}</strong>
                </div>
                <div class="sales-bar"><i style="width:${pct}%"></i></div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
      <div class="panel">
        <h3>Pedidos por status</h3>
        <div class="list">${STATUS.map((status) => {
          const total = state.orders.filter((order) => order.status === status).length;
          return `<div class="progress-row"><span>${status}</span><b>${total}</b><i style="width:${(total / statusMax) * 100}%;"></i></div>`;
        }).join("")}</div>
      </div>
      <div class="panel">
        <h3>Produtos mais vendidos</h3>
        <div class="list">${productSales.map((item) => `<div class="soft-row"><span>${item.name}</span><b>${item.total} un.</b></div>`).join("")}</div>
      </div>
    </div>
  `;
}

function renderGallery() {
  const completed = state.orders.filter((order) => ["Entregue", "Finalizado"].includes(order.status));
  document.getElementById("galleryView").innerHTML = `
    <div class="grid gallery-grid">
      ${completed.map((order) => `
        <button class="gallery-card" data-detail="${order.id}">
          <div class="mockup-thumb">${petInitials(order.client)}</div>
          <span class="status-pill ${statusClass(order.status)}">${order.status}</span>
          <strong>${order.client}</strong>
          <small>${order.product}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderImport() {
  const batches = load("import_batches", []);
  document.getElementById("importView").innerHTML = `
    <div class="grid content-grid">
      <div class="panel">
        <h2>Importar pedidos do Excel</h2>
        <p class="muted">Selecione uma planilha .xlsx, .xls ou .csv. O sistema reconhece as colunas automaticamente e importa todas as linhas da planilha.</p>
        <div class="upload-zone" id="uploadZone">
          <input id="spreadsheetInput" type="file" accept=".xlsx,.xls,.csv">
          <strong>${state.importFileName || "Escolha ou arraste a planilha de pedidos"}</strong>
          <span>CSV funciona offline; Excel carrega SheetJS automaticamente quando necessario</span>
        </div>
        ${state.importSummary ? `<div class="import-summary">${state.importSummary}</div>` : ""}
        <div class="quick-actions wrap" style="margin-top:14px">
          <button class="primary-button" type="button" id="confirmImport" ${state.importRows.length ? "" : "disabled"}>Importar ${state.importRows.length} pedidos</button>
          <button class="ghost-button" type="button" id="clearImport" ${state.importRows.length ? "" : "disabled"}>Limpar previa</button>
          <button class="ghost-button" type="button" id="downloadTemplate">Baixar modelo CSV</button>
        </div>
        ${renderImportPreview()}
      </div>
      <div class="panel">
        <h3>Colunas esperadas</h3>
        <div class="column-map">${SPREADSHEET_COLUMNS.map((column) => `<span>${column}</span>`).join("")}</div>
        <h3 style="margin-top:18px">Ultimas importacoes</h3>
        <div class="list">
          ${batches.length ? batches.map((batch) => `
            <div class="soft-row">
              <span><strong>${batch.fileName}</strong><small>${batch.createdAt}</small></span>
              <b>${batch.importedCount} pedidos</b>
            </div>
          `).join("") : `<p class="muted">Nenhuma planilha importada ainda.</p>`}
        </div>
      </div>
    </div>
  `;
}

function renderImportPreview() {
  if (!state.importRows.length) return "";
  return `
    <div class="import-preview">
      <div class="section-head">
        <h3>Previa da importacao</h3>
        <span class="status-pill status-novo-pedido">${state.importRows.length} linhas lidas</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Total com Frete</th>
              <th>Pagamento</th>
              <th>Entrega</th>
              <th>Rastreio</th>
              <th>Status</th>
              <th>Material</th>
            </tr>
          </thead>
          <tbody>
            ${state.importRows.slice(0, 8).map((order) => `
              <tr>
                <td>${escapeHtml(order.client)}</td>
                <td>${escapeHtml(order.product)}</td>
                <td>${order.quantity}</td>
                <td>${money(order.totalWithShipping)}</td>
                <td>${escapeHtml(order.payment)}</td>
                <td>${formatDate(order.delivery)}</td>
                <td>${escapeHtml(order.tracking || "Pendente")}</td>
                <td><span class="status-pill ${statusClass(order.status)}">${order.status}</span></td>
                <td>${order.material}g</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      ${state.importRows.length > 8 ? `<p class="muted">Mostrando 8 de ${state.importRows.length} linhas. Todas as linhas serao importadas.</p>` : ""}
    </div>
  `;
}

function renderAdmin() {
  const lastBackupTime = localStorage.getItem("mpa:auto_backup_time") || "Nenhum realizado ainda";
  document.getElementById("adminView").innerHTML = `
    <div class="grid content-grid">
      <div class="panel">
        <span class="eyebrow" style="color: var(--red-dark); font-weight:800;">Banco de Dados</span>
        <h2 style="margin-top:4px;">Seguranca &amp; Backups</h2>
        <p class="muted">Gerencie a integridade dos seus dados e realize backups de seguranca.</p>
        
        <div class="soft-row" style="margin-bottom:14px; background: color-mix(in srgb, var(--yellow) 12%, var(--surface-solid)); display:flex; flex-direction:column; align-items:flex-start; gap:6px;">
          <span style="font-weight:900; color:var(--ink);">Backup Automatico de Seguranca</span>
          <small>Status: <span class="status-pill status-finalizado" style="padding:2px 8px; font-size:0.7rem; font-weight:800;">ATIVO</span></small>
          <small>Ultima salvaguarda automatica: <strong>${lastBackupTime}</strong></small>
          <button class="primary-button" type="button" id="restoreAutoBackupBtn" style="margin-top:8px; min-height:36px; padding:0 12px; font-size:0.85rem;">Restaurar Ultimo Backup Automatico</button>
        </div>

        <div class="quick-actions wrap" style="margin-top:16px;">
          <button class="ghost-button" id="downloadBackup">Baixar arquivo de backup (.json)</button>
          <label class="backup-file-button">
            Subir arquivo de backup
            <input id="restoreBackupInput" type="file" accept=".json">
          </label>
          <button class="mini-button" id="exportJson">Exportar JSON bruto</button>
        </div>
        <p class="muted backup-note" style="margin-top:10px;">O backup completo salva pedidos, despesas, produtos, historico de importacoes, tema e configuracoes locais deste navegador.</p>
      </div>

      <div class="panel">
        <span class="eyebrow" style="color: var(--red-dark); font-weight:800;">Administrativo</span>
        <h2 style="margin-top:4px;">Ferramentas do Sistema</h2>
        <p class="muted">Acoes globais e ferramentas para operacao do atelie.</p>
        
        <div class="quick-actions wrap" style="margin-top:12px; gap:8px;">
          <button class="mini-button" id="printLabels" style="width:100%; text-align:left;">Etiquetas de envio</button>
          <button class="mini-button" id="printOrders" style="width:100%; text-align:left;">Impressao de pedidos</button>
          <button class="mini-button" id="resetDemo" style="width:100%; text-align:left;">Restaurar dados demo</button>
          <button class="mini-button danger-button" id="wipeSystemData" style="width:100%; text-align:left;">Zerar todo o sistema</button>
        </div>
        <p class="danger-note" style="margin-top:14px; font-size:0.8rem;">Use "Zerar todo o sistema" antes de importar uma planilha definitiva. Essa acao limpa de forma irreversivel todos os dados.</p>
      </div>
    </div>
      </div>
      <div class="stack-list" style="margin-top:12px; display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
        <span style="display:block;"><strong>Frontend:</strong> React + Tailwind + shadcn/ui</span>
        <span style="display:block;"><strong>Animacoes:</strong> Framer Motion</span>
        <span style="display:block;"><strong>Autenticacao:</strong> Supabase Auth</span>
        <span style="display:block;"><strong>Banco de Dados:</strong> PostgreSQL</span>
        <span style="display:block;"><strong>Storage:</strong> Assets &amp; Imagens</span>
      </div>
    </div>
  `;
}

function openDetails(id) {
  const order = state.orders.find((item) => item.id === id);
  if (!order) return;
  state.selectedOrder = order.id;
  const modal = document.getElementById("detailModal");
  modal.innerHTML = `
    <article class="modal-card detail-card">
      <div class="modal-head">
        <div>
          <span class="eyebrow">${order.id}</span>
          <h2>${order.client}</h2>
        </div>
        <button class="ghost-button" type="button" data-close-detail>Fechar</button>
      </div>
      <div class="grid detail-grid">
        <div class="asset-card">
          <span>Foto do pet</span>
          ${assetPreview(order.petPhoto, petInitials(order.client))}
          <input type="file" accept="image/*" data-asset="${order.id}" data-field="petPhoto">
        </div>
        <div class="asset-card">
          <span>Arte gerada</span>
          ${assetPreview(order.generatedArt, "ART")}
          <input type="file" accept="image/*" data-asset="${order.id}" data-field="generatedArt">
        </div>
        <div class="asset-card">
          <span>Mockup do chaveiro</span>
          ${assetPreview(order.keychainMockup, "3D")}
          <input type="file" accept="image/*" data-asset="${order.id}" data-field="keychainMockup">
        </div>
      </div>
      <div class="grid content-grid">
        <div class="panel inset">
          <h3>Detalhes completos</h3>
          <div class="detail-list">
            ${detailLine("WhatsApp", order.whatsapp || "Nao cadastrado")}
            ${detailLine("Produto", order.product)}
            ${detailLine("Quantidade", order.quantity)}
            ${detailLine("Total com frete", money(order.totalWithShipping))}
            ${detailLine("Pagamento", order.payment)}
            ${detailLine("Entrega", formatDate(order.delivery))}
            ${detailLine("Material", `${order.material}g`)}
            ${detailLine("Tempo de producao", `${order.productionTime}h`)}
          </div>
          <div class="quick-actions">
            <button class="primary-button" type="button" data-copy="${order.tracking}">Copiar rastreio</button>
            <button class="ghost-button" type="button" data-print="${order.id}">Imprimir pedido</button>
            <button class="mini-button danger-button" type="button" data-delete-order="${order.id}">Excluir pedido</button>
          </div>
        </div>
        <div class="panel inset">
          <h3>Observacoes</h3>
          <textarea id="detailNotes" rows="5">${escapeHtml(order.notes || "")}</textarea>
          <button class="primary-button" type="button" data-save-notes="${order.id}">Salvar observacoes</button>
          <h3>Historico</h3>
          <div class="history-list">${order.history.map((item) => `<div><b>${item.at}</b><span>${item.text}</span></div>`).join("")}</div>
        </div>
      </div>
    </article>
  `;
  if (!modal.open) modal.showModal();
}

function assetPreview(src, fallback) {
  return src ? `<div class="asset-preview" style="background-image:url('${src}')"></div>` : `<div class="asset-preview empty">${fallback}</div>`;
}

function detailLine(label, value) {
  return `<div><span>${label}</span><strong>${value}</strong></div>`;
}

function petInitials(name) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function statusClass(status) {
  return `status-${status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-")}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function normalizeHeader(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function getCell(row, ...columnNames) {
  for (const columnName of columnNames) {
    const wanted = normalizeHeader(columnName);
    const key = Object.keys(row).find((item) => normalizeHeader(item) === wanted);
    if (key && row[key] !== undefined && row[key] !== "") return row[key];
  }
  return "";
}

function parseNumber(value) {
  if (typeof value === "number") return value;
  const clean = String(value || "")
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(clean) || 0;
}

function parseSpreadsheetDate(value) {
  if (!value) return addDays(0);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    excelEpoch.setUTCDate(excelEpoch.getUTCDate() + value);
    return excelEpoch.toISOString().slice(0, 10);
  }
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const match = text.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (match) {
    const day = match[1].padStart(2, "0");
    const month = match[2].padStart(2, "0");
    const year = match[3].length === 2 ? `20${match[3]}` : match[3];
    return `${year}-${month}-${day}`;
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? addDays(0) : parsed.toISOString().slice(0, 10);
}

function normalizeStatus(value) {
  const normalized = normalizeHeader(value);
  return STATUS.find((status) => normalizeHeader(status) === normalized) || "Novo Pedido";
}

function isImportDataRow(row) {
  const client = String(getCell(row, "Clientes", "Cliente", "Nome") || "").trim();
  const product = String(getCell(row, "Produto", "Produtos") || "").trim();
  const normalizedClient = normalizeHeader(client);
  const normalizedProduct = normalizeHeader(product);
  if (!client || !product) return false;
  if (normalizedClient === "clientes" || normalizedProduct === "produto") return false;
  if (["total", "totais", "subtotal", "resumo"].includes(normalizedClient)) return false;
  return true;
}

function rowToOrder(row, index) {
  const client = String(getCell(row, "Clientes", "Cliente", "Nome") || "").trim();
  const product = String(getCell(row, "Produto", "Produtos") || "").trim();
  const quantity = parseNumber(getCell(row, "Quantidade", "Qtd")) || 1;
  const unitValue = parseNumber(getCell(row, "Valor por Unidade", "Valor Unitario", "Valor"));
  const totalSale = parseNumber(getCell(row, "Total Venda", "Total")) || quantity * unitValue;
  const shipping = parseNumber(getCell(row, "Frete SP", "Frete"));
  const totalWithShipping = parseNumber(getCell(row, "Total com Frete", "Total Final")) || totalSale + shipping;
  const date = parseSpreadsheetDate(getCell(row, "Data", "Data Pedido"));
  const delivery = parseSpreadsheetDate(getCell(row, "Entrega", "Data Entrega"));
  const tracking = String(getCell(row, "Codigo de Rastreio", "Rastreio") || "").trim();
  const status = normalizeStatus(getCell(row, "Status"));
  const productionTime = parseNumber(getCell(row, "Tempo de Producao", "Tempo"));
  const material = parseNumber(getCell(row, "Quantidade de Material Utilizado", "Material"));
  const payment = String(getCell(row, "Forma de Pagamento", "Pagamento") || "Pix").trim();
  const order = {
    id: `MPA-${date.replaceAll("-", "").slice(2)}-${String(index + 1).padStart(3, "0")}`,
    client,
    product,
    quantity,
    unitValue: unitValue || totalSale / Math.max(quantity, 1),
    totalSale,
    shipping,
    totalWithShipping,
    payment,
    date,
    delivery,
    tracking,
    status,
    productionTime,
    material,
    notes: "Importado de planilha",
    petPhoto: "",
    generatedArt: "",
    keychainMockup: "",
    history: [{ at: formatDateTime(new Date()), text: "Pedido importado de planilha" }]
  };
  refreshOrderTotals(order);
  if (totalSale) order.totalSale = totalSale;
  if (totalWithShipping) order.totalWithShipping = totalWithShipping;
  return order;
}

function parseCsv(text) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) || "";
  const delimiter = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ";" : ",";
  const rows = [];
  let current = [];
  let cell = "";
  let insideQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === delimiter && !insideQuotes) {
      current.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      current.push(cell);
      if (current.some((item) => String(item).trim())) rows.push(current);
      current = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  current.push(cell);
  if (current.some((item) => String(item).trim())) rows.push(current);
  const headers = rows.shift() || [];
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

async function readSpreadsheet(file) {
  const extension = file.name.split(".").pop().toLowerCase();
  if (extension === "csv") {
    return parseCsv(await file.text());
  }
  if (!window.XLSX) await loadXlsxLibrary();
  if (!window.XLSX) {
    throw new Error("Para importar Excel .xlsx/.xls, conecte a internet para carregar a biblioteca SheetJS ou exporte a planilha como CSV.");
  }
  const buffer = await file.arrayBuffer();
  const workbook = window.XLSX.read(buffer, { type: "array", cellDates: true });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return window.XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
}

function loadXlsxLibrary() {
  const sources = ["vendor/xlsx.full.min.js", "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"];
  return new Promise((resolve) => {
    if (window.XLSX) {
      resolve();
      return;
    }
    const trySource = (index) => {
      if (!sources[index]) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = sources[index];
      script.onload = () => resolve();
      script.onerror = () => trySource(index + 1);
      document.head.appendChild(script);
    };
    trySource(0);
  });
}

async function handleSpreadsheetFile(file) {
  try {
    const rawRows = await readSpreadsheet(file);
    const dataRows = rawRows.filter(isImportDataRow);
    const rows = dataRows.map(rowToOrder);
    state.importRows = rows;
    state.importFileName = file.name;
    state.importSummary = rows.length
      ? `Planilha lida com sucesso: ${rows.length} pedidos validos encontrados. ${rawRows.length - dataRows.length} linhas vazias ou incompletas foram ignoradas.`
      : "Nenhum pedido valido foi encontrado. Verifique se as colunas Clientes e Produto estao preenchidas.";
  } catch (error) {
    state.importRows = [];
    state.importFileName = file.name;
    state.importSummary = error.message;
  }
  renderImport();
}

function confirmSpreadsheetImport() {
  state.importRows.forEach((incoming) => {
    incoming.history.unshift({ at: formatDateTime(new Date()), text: `Importado pela planilha ${state.importFileName}` });
    state.orders.unshift(incoming);
  });
  save();
  saveImportBatch({
    fileName: state.importFileName,
    importedCount: state.importRows.length,
    createdAt: formatDateTime(new Date())
  });
  state.importSummary = `Importacao concluida: ${state.importRows.length} pedidos importados.`;
  state.importRows = [];
  render();
  setView("orders");
}

function refreshOrderTotals(order) {
  order.quantity = Number(order.quantity || 1);
  order.unitValue = Number(order.unitValue || 0);
  order.shipping = Number(order.shipping || 0);
  order.productionTime = Number(order.productionTime || 0);
  order.material = Number(order.material || 0);
  order.totalSale = order.quantity * order.unitValue;
  order.totalWithShipping = order.totalSale + order.shipping;
}

function updateStatus(id, status) {
  const order = state.orders.find((item) => item.id === id);
  if (!order || order.status === status) return;
  order.status = status;
  order.history.unshift({ at: formatDateTime(new Date()), text: `Status alterado para ${status}` });
  save();
  render();
}

async function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function printOrder(id) {
  const order = state.orders.find((item) => item.id === id);
  if (!order) return;
  const content = `Pedido ${order.id}\nCliente: ${order.client}\nProduto: ${order.product}\nQuantidade: ${order.quantity}\nTotal: ${money(order.totalWithShipping)}\nEntrega: ${formatDate(order.delivery)}\nRastreio: ${order.tracking || "Pendente"}\nObservacoes: ${order.notes || ""}`;
  const printWindow = window.open("", "_blank", "noopener");
  printWindow.document.write(`<pre style="font:16px system-ui;white-space:pre-wrap">${escapeHtml(content)}</pre>`);
  printWindow.print();
}

function exportJson() {
  const blob = new Blob([JSON.stringify({ orders: state.orders, expenses: state.expenses, columns: SPREADSHEET_COLUMNS }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "meu-pet-em-arte-pedidos.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadBackup() {
  const backup = {
    app: "Meu Pet em Arte",
    version: 1,
    createdAt: new Date().toISOString(),
    orders: state.orders,
    expenses: state.expenses,
    importBatches: load("import_batches", []),
    theme: localStorage.getItem("mpa:theme_v2") || "light",
    columns: SPREADSHEET_COLUMNS
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `backup-meu-pet-em-arte-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function restoreBackup(file) {
  try {
    const backup = JSON.parse(await file.text());
    if (!Array.isArray(backup.orders)) throw new Error("Arquivo de backup invalido: pedidos nao encontrados.");
    const expenseCount = Array.isArray(backup.expenses) ? backup.expenses.length : 0;
    const confirmed = window.confirm(`Restaurar backup com ${backup.orders.length} pedidos e ${expenseCount} despesas? Os dados atuais serao substituidos.`);
    if (!confirmed) return;
    state.orders = backup.orders;
    state.expenses = Array.isArray(backup.expenses) ? backup.expenses : [];
    state.importRows = [];
    state.importFileName = "";
    state.importSummary = "";
    state.query = "";
    state.statusFilter = "Todos";
    state.page = 1;
    localStorage.setItem("mpa:orders_v2", JSON.stringify(state.orders));
    localStorage.setItem("mpa:expenses_v1", JSON.stringify(state.expenses));
    localStorage.setItem("mpa:import_batches", JSON.stringify(Array.isArray(backup.importBatches) ? backup.importBatches : []));
    if (backup.theme) localStorage.setItem("mpa:theme_v2", backup.theme);
    document.body.classList.toggle("dark", backup.theme === "dark");
    render();
    setView("dashboard");
  } catch (error) {
    window.alert(error.message || "Nao foi possivel restaurar o backup.");
  }
}

function wipeSystemData() {
  const confirmed = window.confirm("Zerar todos os pedidos e historicos de importacao? Use isso apenas antes de uma importacao limpa.");
  if (!confirmed) return;
  state.orders = [];
  state.expenses = [];
  state.importRows = [];
  state.importFileName = "";
  state.importSummary = "Sistema zerado. Agora voce pode importar uma planilha limpa.";
  state.query = "";
  state.statusFilter = "Todos";
  state.page = 1;
  localStorage.setItem("mpa:orders_v2", JSON.stringify([]));
  localStorage.setItem("mpa:expenses_v1", JSON.stringify([]));
  localStorage.removeItem("mpa:import_batches");
  render();
  setView("import");
}

function deleteOrder(id) {
  const order = state.orders.find((item) => item.id === id);
  if (!order) return;
  const confirmed = window.confirm(`Excluir o pedido ${order.id} de ${order.client}? Essa acao nao pode ser desfeita.`);
  if (!confirmed) return;
  state.orders = state.orders.filter((item) => item.id !== id);
  state.selectedOrder = null;
  save();
  render();
  const detailModal = document.getElementById("detailModal");
  if (detailModal.open) detailModal.close();
  setView("orders");
}

function deleteExpense(id) {
  state.expenses = state.expenses.filter((expense) => expense.id !== id);
  saveExpenses();
  render();
  setView("expenses");
}

function resetDemoData() {
  state.orders = seedOrders();
  state.expenses = seedExpenses();
  state.importRows = [];
  state.importFileName = "";
  state.importSummary = "";
  state.query = "";
  state.statusFilter = "Todos";
  state.page = 1;
  localStorage.setItem("mpa:orders_v2", JSON.stringify(state.orders));
  localStorage.setItem("mpa:expenses_v1", JSON.stringify(state.expenses));
  localStorage.removeItem("mpa:import_batches");
  render();
  setView("dashboard");
}

function resetExpenseExamples() {
  state.expenses = seedExpenses();
  saveExpenses();
  render();
  setView("expenses");
}

function downloadImportTemplate() {
  const example = [
    SPREADSHEET_COLUMNS.join(";"),
    [
      "Cliente Exemplo",
      "Chaveiro pet premium",
      "1",
      "89,90",
      "89,90",
      "14,90",
      "104,80",
      "Pix",
      "26/05/2026",
      "30/05/2026",
      "BR000000000BR",
      "Novo Pedido",
      "3,5",
      "24"
    ].join(";")
  ].join("\n");
  const blob = new Blob([example], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "modelo-importacao-meu-pet-em-arte.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  document.body.addEventListener("click", (event) => {
    const kanbanCard = event.target.closest(".kanban-card");
    if (kanbanCard && !event.target.closest("button") && !event.target.closest("select") && !event.target.closest("input")) {
      openDetails(kanbanCard.dataset.order);
      return;
    }
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.view) setView(target.dataset.view);
    if (target.dataset.openOrder !== undefined) document.getElementById("orderModal").showModal();
    if (target.dataset.detail) openDetails(target.dataset.detail);
    if (target.dataset.page) {
      state.page = Number(target.dataset.page);
      renderOrders();
    }
    if (target.dataset.sort) {
      state.sortDirection = state.sortKey === target.dataset.sort && state.sortDirection === "asc" ? "desc" : "asc";
      state.sortKey = target.dataset.sort;
      renderOrders();
    }
    if (target.dataset.print) printOrder(target.dataset.print);
    if (target.dataset.toggleView !== undefined) {
      // toggle between 'list' and 'cards'
      state.viewMode = state.viewMode === "list" ? "cards" : "list";
      state.compactCards = state.viewMode === "cards";
      localStorage.setItem("mpa:orders_view_mode", state.viewMode);
      localStorage.setItem("mpa:orders_compact_layout", JSON.stringify(state.compactCards));
      renderOrders();
    }
    if (target.dataset.deleteOrder) deleteOrder(target.dataset.deleteOrder);
    if (target.dataset.deleteExpense) deleteExpense(target.dataset.deleteExpense);
    if (target.dataset.deleteProductIndex !== undefined) {
      const idx = Number(target.dataset.deleteProductIndex);
      const confirmed = window.confirm(`Excluir o produto "${state.products[idx].name}"?`);
      if (confirmed) {
        state.products.splice(idx, 1);
        saveProducts();
        render();
        hydrateForm();
      }
    }
    if (target.dataset.copy !== undefined) navigator.clipboard?.writeText(target.dataset.copy || "Rastreio pendente");
    if (target.dataset.closeDetail !== undefined) document.getElementById("detailModal").close();
    if (target.dataset.saveNotes) {
      const order = state.orders.find((item) => item.id === target.dataset.saveNotes);
      order.notes = document.getElementById("detailNotes").value;
      order.history.unshift({ at: formatDateTime(new Date()), text: "Observacoes atualizadas" });
      save();
      openDetails(order.id);
    }
  });

  document.body.addEventListener("input", (event) => {
    if (event.target.id === "orderSearch") {
      state.query = event.target.value;
      state.page = 1;
      renderOrders();
    }
    if (event.target.id === "productionSearch") {
      state.productionSearch = event.target.value;
      renderProduction();
    }
  });

  document.body.addEventListener("change", async (event) => {
    if (event.target.id === "statusFilter") {
      state.statusFilter = event.target.value;
      state.page = 1;
      renderOrders();
    }
    if (event.target.id === "productionStatusFilter") {
      state.productionFilter = event.target.value;
      renderProduction();
    }
    if (event.target.dataset.status) updateStatus(event.target.dataset.status, event.target.value);
    if (event.target.dataset.assignResp) {
      const order = state.orders.find((item) => item.id === event.target.dataset.assignResp);
      if (!order) return;
      order.responsible = event.target.value;
      order.history.unshift({ at: formatDateTime(new Date()), text: `Responsável atribuído: ${event.target.value}` });
      save();
      renderProduction();
    }
    if (event.target.dataset.edit) {
      const order = state.orders.find((item) => item.id === event.target.dataset.edit);
      if (!order) return;
      const field = event.target.dataset.field;
      const previousProduct = order.product;
      order[field] = event.target.type === "number" ? Number(event.target.value) : event.target.value;
      if (field === "product" && previousProduct !== order.product) {
        const product = state.products.find((item) => item.name === order.product);
        if (product) order.unitValue = product.unitValue;
      }
      refreshOrderTotals(order);
      order.history.unshift({ at: formatDateTime(new Date()), text: `Campo ${field} atualizado` });
      save();
      render();
    }
    if (event.target.dataset.expenseEdit) {
      const expense = state.expenses.find((item) => item.id === event.target.dataset.expenseEdit);
      if (!expense) return;
      const field = event.target.dataset.field;
      expense[field] = event.target.type === "number" ? Number(event.target.value) : event.target.value;
      saveExpenses();
      render();
      setView("expenses");
    }
    if (event.target.dataset.productEdit !== undefined) {
      const idx = Number(event.target.dataset.productEdit);
      const field = event.target.dataset.field;
      state.products[idx][field] = Number(event.target.value);
      saveProducts();
      render();
      hydrateForm();
    }
    if (event.target.dataset.asset) {
      const order = state.orders.find((item) => item.id === event.target.dataset.asset);
      const file = event.target.files[0];
      if (!file) return;
      order[event.target.dataset.field] = await fileToDataUrl(file);
      order.history.unshift({ at: formatDateTime(new Date()), text: "Imagem adicionada ao pedido" });
      save();
      openDetails(order.id);
    }
    if (event.target.id === "spreadsheetInput") {
      const file = event.target.files[0];
      if (file) await handleSpreadsheetFile(file);
    }
    if (event.target.id === "restoreBackupInput") {
      const file = event.target.files[0];
      if (file) await restoreBackup(file);
      event.target.value = "";
    }
  });

  document.body.addEventListener("dragstart", (event) => {
    const card = event.target.closest(".kanban-card");
    if (!card) return;
    event.dataTransfer.setData("text/plain", card.dataset.order);
    event.dataTransfer.effectAllowed = "move";
  });

  document.body.addEventListener("dragover", (event) => {
    const board = event.target.closest(".kanban-column-body");
    if (board) {
      event.preventDefault();
      board.classList.add("drag-over");
      return;
    }
    if (event.target.closest("#uploadZone")) {
      event.preventDefault();
      event.target.closest("#uploadZone").classList.add("dragging");
    }
  });

  document.body.addEventListener("dragleave", (event) => {
    const board = event.target.closest(".kanban-column-body");
    if (board) {
      board.classList.remove("drag-over");
      return;
    }
    if (event.target.closest("#uploadZone")) {
      event.target.closest("#uploadZone").classList.remove("dragging");
    }
  });

  document.body.addEventListener("drop", async (event) => {
    const board = event.target.closest(".kanban-column-body");
    if (board) {
      event.preventDefault();
      board.classList.remove("drag-over");
      const orderId = event.dataTransfer.getData("text/plain");
      const order = state.orders.find((item) => item.id === orderId);
      const status = board.dataset.status;
      if (order && status && order.status !== status) {
        order.status = status;
        order.history.unshift({ at: formatDateTime(new Date()), text: `Status movido para ${status} via quadro` });
        save();
        render();
      }
      return;
    }
    const zone = event.target.closest("#uploadZone");
    if (!zone) return;
    event.preventDefault();
    zone.classList.remove("dragging");
    const file = event.dataTransfer.files[0];
    if (file) await handleSpreadsheetFile(file);
  });

  document.getElementById("newOrderButton").addEventListener("click", () => {
    document.getElementById("newOrderPhotoPreview").style.display = "none";
    document.getElementById("orderModal").showModal();
  });
  document.getElementById("closeOrderModal").addEventListener("click", () => document.getElementById("orderModal").close());
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("mpa:theme_v2", document.body.classList.contains("dark") ? "dark" : "light");
  });
  document.getElementById("orderForm").photo.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    const preview = document.getElementById("newOrderPhotoPreview");
    if (file) {
      const url = await fileToDataUrl(file);
      preview.style.backgroundImage = `url('${url}')`;
      preview.style.display = "block";
      preview.classList.remove("empty");
    } else {
      preview.style.display = "none";
    }
  });
  document.body.addEventListener("click", (event) => {
    if (event.target.id === "confirmImport") confirmSpreadsheetImport();
    if (event.target.id === "downloadTemplate") downloadImportTemplate();
    if (event.target.id === "wipeSystemData") wipeSystemData();
    if (event.target.id === "restoreAutoBackupBtn") restoreAutoBackup();
    if (event.target.id === "exportJson") exportJson();
    if (event.target.id === "downloadBackup") downloadBackup();
    if (event.target.id === "resetDemo") resetDemoData();
    if (event.target.id === "resetExpenseExamples") resetExpenseExamples();
    if (event.target.id === "clearImport") {
      state.importRows = [];
      state.importFileName = "";
      state.importSummary = "";
      renderImport();
    }
    if (event.target.dataset.deleteShipping) {
      const uf = event.target.dataset.deleteShipping;
      if (uf && state.shippingRates && state.shippingRates[uf] !== undefined) {
        delete state.shippingRates[uf];
        saveShippingRates();
        render();
      }
    }
    if (event.target.dataset.productionSort) {
      // toggle production sort direction
      state.productionSortKey = event.target.dataset.productionSort;
      state.productionSortDirection = state.productionSortDirection === "asc" ? "desc" : "asc";
      renderProduction();
    }
  });
  document.getElementById("orderForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const product = state.products.find((item) => item.name === data.product) || state.products[0];
    // Determine shipping: use state-based rate only if checkbox selected, otherwise use provided shipping input
    const uf = data.state ? String(data.state).trim().toUpperCase() : "";
    const useState = !!data.useStateShipping;
    const shippingVal = useState && uf && state.shippingRates && state.shippingRates[uf] !== undefined ? Number(state.shippingRates[uf]) : Number(data.shipping || 0);
    const order = makeOrder(data.client, data.whatsapp, data.product, Number(data.quantity), product.unitValue, shippingVal, data.payment, 0, 5, "Novo Pedido", data.tracking, product.name.includes("Combo") ? 4.8 : 3.2, product.name.includes("Combo") ? 38 : 22, data.notes);
    order.petPhoto = form.photo.files[0] ? await fileToDataUrl(form.photo.files[0]) : "";
    state.orders.unshift(order);
    save();
    // If user chose to apply state-based shipping, create an expense record for the freight
    if (useState && uf) {
      state.expenses.unshift({
        id: nextExpenseId(),
        name: `Frete ${uf} - ${order.id}`,
        category: "Frete",
        amount: Number(shippingVal || 0),
        date: order.date,
        notes: `Frete do pedido ${order.id} (automático)`
      });
      saveExpenses();
    }
    form.reset();
    document.getElementById("newOrderPhotoPreview").style.display = "none";
    document.getElementById("orderModal").close();
    setView("orders");
    render();
  });
  document.body.addEventListener("submit", (event) => {
    if (event.target.id === "expenseForm") {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target));
      state.expenses.unshift({
        id: nextExpenseId(),
        name: data.name,
        category: data.category,
        amount: Number(data.amount || 0),
        date: data.date,
        notes: data.notes || ""
      });
      saveExpenses();
      event.target.reset();
      render();
      setView("expenses");
    }
    if (event.target.id === "shippingRatesForm") {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target));
      const uf = String(data.uf || "").trim().toUpperCase();
      const rate = Number(data.rate || 0);
      if (!uf) return window.alert("Informe o estado (UF).");
      state.shippingRates = state.shippingRates || {};
      state.shippingRates[uf] = rate;
      saveShippingRates();
      event.target.reset();
      render();
      setView("expenses");
    }
    if (event.target.id === "productForm") {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target));
      state.products.push({
        name: data.name,
        unitValue: Number(data.unitValue || 0),
        cost: Number(data.cost || 0)
      });
      saveProducts();
      event.target.reset();
      render();
      hydrateForm();
      setView("products");
    }
  });
}

function hydrateForm() {
  const select = document.querySelector("[name='product']");
  if (select) {
    select.innerHTML = state.products.map((product) => `<option value="${product.name}">${product.name} - ${money(product.unitValue)}</option>`).join("");
  }
  const stateSelect = document.querySelector("[name='state']");
  if (stateSelect) {
    stateSelect.innerHTML = [`
      <option value="">Escolha o estado (frete automático)</option>
      `].concat(Object.keys(state.shippingRates || {}).map((uf) => `<option value="${uf}">${uf} - ${money(state.shippingRates[uf])}</option>`)).join("");
    const shippingInput = document.querySelector("[name='shipping']");
    const useStateCheckbox = document.querySelector("[name='useStateShipping']");
    function updateShippingState() {
      const uf = String(stateSelect.value || "").trim().toUpperCase();
      if (shippingInput) {
        if (useStateCheckbox && useStateCheckbox.checked && uf && state.shippingRates && state.shippingRates[uf] !== undefined) {
          shippingInput.value = state.shippingRates[uf];
          shippingInput.disabled = true;
        } else {
          shippingInput.disabled = false;
        }
      }
    }
    stateSelect.addEventListener("change", updateShippingState);
    if (useStateCheckbox) useStateCheckbox.addEventListener("change", updateShippingState);
    // initialize
    updateShippingState();
  }
}

if (localStorage.getItem("mpa:theme_v2") === "dark") document.body.classList.add("dark");
hydrateForm();
bindEvents();
render();
setView("dashboard");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
