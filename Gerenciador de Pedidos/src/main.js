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

const ORDER_STATUSES = [
  "Novo Pedido",
  "Produção",
  "Postagem",
  "Enviado",
  "Entregue"
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

const defaultProductionStatuses = [
  "Recebido",
  "Em Produção",
  "Pintura",
  "Pronto"
];

const defaultShippingStatuses = [
  "Pronto",
  "Postagem",
  "Enviado",
  "Entregue"
];

const state = {
  orders: load("orders_v2", seedOrders()),
  expenses: load("expenses_v1", seedExpenses()),
  products: load("products_v1", defaultProducts),
  productionStatuses: load("production_statuses_v1", defaultProductionStatuses),
  shippingStatuses: load("shipping_statuses_v1", defaultShippingStatuses),
  reportPeriod: "30d",
  reportCompare: "anterior",
  reportProduct: "Todos",
  query: "",
  statusFilter: "Todos",
  sortKey: "date",
  sortDirection: "desc",
  page: 1,
  selectedOrder: null,
  detailEditMode: false,
  expandedProductionGroups: {},
  compactCards: load("orders_compact_layout", false),
  productEditorIndex: null,
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
  return baseCost * order.quantity + materialCost;
}

function estimatedProfit(order) {
  return order.totalSale - productCost(order);
}

function filteredOrders() {
  if (state.statusFilter !== "Todos" && !ORDER_STATUSES.includes(state.statusFilter)) {
    state.statusFilter = "Todos";
  }
  const term = state.query.trim().toLowerCase();
  const filtered = state.orders.filter((order) => {
    const orderStatus = getOrderWorkflowStatus(order);
    const matchesStatus = state.statusFilter === "Todos" || orderStatus === state.statusFilter;
    const text = [
      order.id,
      order.client,
      order.product,
      order.payment,
      order.tracking,
      orderStatus
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
  const currentMonthOrders = state.orders.filter((order) => order.date && order.date.startsWith(currentMonth));
  const activeMonthOrders = active.filter((order) => order.date && order.date.startsWith(currentMonth));
  const currentMonthExpenses = state.expenses.filter((expense) => expense.date && expense.date.startsWith(currentMonth));

  const revenue = activeMonthOrders.reduce((sum, order) => sum + order.totalWithShipping, 0);
  const yearlyRevenue = active.filter((order) => order.date && order.date.startsWith(currentYear)).reduce((sum, order) => sum + order.totalWithShipping, 0);
  const profit = activeMonthOrders.reduce((sum, order) => sum + estimatedProfit(order), 0);
  const shippingTotal = activeMonthOrders.reduce((sum, order) => sum + Number(order.shipping || 0), 0);
  const shippingExpenses = currentMonthExpenses
    .filter((expense) => String(expense.category || "").toLowerCase() === "frete")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const expenses = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  
  // Somando o tempo total de produção dos pedidos do mês corrente (tempo total de uso de máquina)
  const totalMachineTime = activeMonthOrders.reduce((sum, order) => sum + Number(order.productionTime || 0), 0);
  
  const keychains = activeMonthOrders.reduce((sum, order) => sum + Number(order.quantity || 0), 0);

  const profitAfterExpenses = revenue - expenses;
  const ticketMedio = revenue / Math.max(activeMonthOrders.length, 1);

  return {
    total: activeMonthOrders.length,
    production: activeMonthOrders.filter((order) => order.status === "Em Producao").length,
    sent: activeMonthOrders.filter((order) => order.status === "Enviado").length,
    revenue,
    yearlyRevenue,
    shippingTotal,
    shippingExpenses,
    totalMachineTime,
    profit,
    expenses,
    profitAfterExpenses,
    ticketMedio,
    keychains,
    pets: currentMonthOrders.length
  };
}

const viewRenderers = {
  dashboard: () => renderDashboard(),
  orders: () => renderOrders(),
  production: () => renderProduction(),
  shipping: () => renderShipping(),
  products: () => renderProducts(),
  expenses: () => renderExpenses(),
  reports: () => renderReports(),
  gallery: () => renderGallery(),
  import: () => renderImport(),
  admin: () => renderAdmin(),
};

function renderCurrentView() {
  const active = state.currentView || "dashboard";
  const fn = viewRenderers[active];
  renderSidebarQueue();
  if (fn) try { fn(); } catch (e) { console.error(`render ${active} error`, e); }
}

function renderSidebarQueue() {
  const el = document.getElementById("productionQueueSummary");
  if (!el) return;

  const productionOrders = state.orders.filter(o =>
    state.productionStatuses.includes(o.status)
  );
  const shippingStatuses = state.shippingStatuses || ["Pronto", "Postagem", "Enviado", "Entregue"];
  const shippingOrders = state.orders.filter(o =>
    shippingStatuses.includes(o.status) && o.status !== "Pronto"
  );
  const totalInProduction = productionOrders.length;
  const totalInShipping = shippingOrders.length;

  const statusCounts = state.productionStatuses.map(status => {
    const count = state.orders.filter(o => o.status === status).length;
    return { status, count };
  });

  el.innerHTML = `
    <span class="tiny-label">Fila de produção</span>
    <strong style="font-size:1.4rem; display:block; margin: 4px 0 10px;">${totalInProduction} em produção</strong>
    <div style="display:grid; gap:5px; margin-bottom:10px;">
      ${statusCounts.map(({ status, count }) => `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem;">
          <span style="color:var(--muted); font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:110px;" title="${status}">${status}</span>
          <span style="background:var(--surface-solid); border:1px solid var(--line); border-radius:999px; padding:1px 9px; font-weight:900; font-size:0.78rem;">${count}</span>
        </div>
      `).join("")}
    </div>
    <div style="border-top:1px solid var(--line); padding-top:8px; display:flex; justify-content:space-between; align-items:center; font-size:0.8rem;">
      <span style="color:var(--muted); font-weight:700;">📦 Em envio</span>
      <span style="font-weight:900;">${totalInShipping}</span>
    </div>
  `;
}

function render() {
  ensureAppStructure();
  renderSidebarQueue();
  Object.entries(viewRenderers).forEach(([view, fn]) => {
    try { fn(); } catch (e) { console.error(`render ${view} error`, e); }
  });
}

function renderProducts() {
  const productsList = state.products;
  const editingIndex = Number.isInteger(state.productEditorIndex) && productsList[state.productEditorIndex] ? state.productEditorIndex : null;
  if (state.productEditorIndex !== editingIndex) state.productEditorIndex = editingIndex;
  const editingProduct = editingIndex !== null ? productsList[editingIndex] : null;
  const avgPrice = productsList.length ? productsList.reduce((s, p) => s + p.unitValue, 0) / productsList.length : 0;
  const avgCost = productsList.length ? productsList.reduce((s, p) => s + p.cost, 0) / productsList.length : 0;
  const avgMargin = avgPrice > 0 ? ((avgPrice - avgCost) / avgPrice * 100) : 0;
  const formTitle = editingProduct ? "Editar produto" : "Adicionar novo produto";
  const formHelper = editingProduct
    ? `Atualizando ${escapeHtml(editingProduct.name)}. Nome, preço e custo podem ser alterados aqui.`
    : "Cadastre um novo item do catálogo para usar nos pedidos.";

  document.getElementById("productsView").innerHTML = `
    <div class="grid metric-grid">
      ${metric("Produtos cadastrados", productsList.length, "Catálogo ativo")}
      ${metric("Preço médio", money(avgPrice), "Venda unitária")}
      ${metric("Custo médio", money(avgCost), "Base de produção")}
      ${metric("Margem média", avgMargin.toFixed(1) + "%", "Lucro bruto estimado")}
    </div>

    <div class="grid content-grid">
      <form class="panel form-grid" id="productForm">
        <input type="hidden" name="productIndex" value="${editingIndex !== null ? editingIndex : ""}" />
        <div class="wide">
          <span class="eyebrow">Catálogo</span>
          <h2>${formTitle}</h2>
          <p class="muted">${formHelper}</p>
        </div>
        <label class="wide">Nome do Produto
          <input name="name" required placeholder="Ex: Chaveiro pet premium" autocomplete="off" value="${editingProduct ? escapeHtml(editingProduct.name) : ""}">
        </label>
        <label>Preço de Venda (R$)
          <input name="unitValue" required type="number" min="0" step="0.01" placeholder="0,00" value="${editingProduct ? editingProduct.unitValue : ""}">
        </label>
        <label>Custo Unitário Base (R$)
          <input name="cost" required type="number" min="0" step="0.01" placeholder="0,00" value="${editingProduct ? editingProduct.cost : ""}">
        </label>
        <div class="wide wrap">
          <button class="primary-button" type="submit">${editingProduct ? "Salvar alterações" : "Adicionar produto"}</button>
          ${editingProduct ? `<button class="ghost-button" type="button" data-cancel-product-edit>Cancelar edição</button>` : ""}
        </div>
      </form>

      <div class="panel">
        <div class="section-head">
          <div>
            <h2>Produtos cadastrados</h2>
            <p class="muted">${productsList.length} produto${productsList.length !== 1 ? "s" : ""} no catálogo</p>
          </div>
          <span class="status-pill status-finalizado">${editingProduct ? "Editando item" : "Cadastro rápido"}</span>
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
                <div class="product-card-actions">
                  <button class="mini-button" type="button" data-start-product-edit="${index}">Editar</button>
                  <button class="mini-button danger-button" type="button" data-delete-product-index="${index}" title="Excluir produto">Excluir</button>
                </div>
              </div>
              <div class="product-card-body">
                <div class="product-card-field">
                  <small>Preço de venda</small>
                  <strong>${money(product.unitValue)}</strong>
                </div>
                <div class="product-card-field">
                  <small>Custo base</small>
                  <strong>${money(product.cost)}</strong>
                </div>
              </div>
              <div class="product-card-footer">
                <span>Lucro unit.: <strong>${money(profit)}</strong></span>
                <span>Margem: <strong>${margin.toFixed(1)}%</strong></span>
              </div>
            </div>`;
          }).join("") : `<p class="muted" style="padding:24px;text-align:center">Nenhum produto cadastrado. Use o formulário ao lado para adicionar.</p>`}
        </div>
      </div>
    </div>
  `;
}

function startProductEdit(index) {
  const product = state.products[index];
  if (!product) return;
  state.productEditorIndex = index;
  renderProducts();
  setView("products");
}

function cancelProductEdit() {
  if (state.productEditorIndex === null) return;
  state.productEditorIndex = null;
  renderProducts();
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
  state.currentView = targetView;
  document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
  document.getElementById(`${targetView}View`).classList.add("active");
  document.getElementById("viewTitle").textContent = document.getElementById(`${targetView}View`).dataset.title;
  document.querySelectorAll("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === targetView));
  // Re-render the newly activated view so data is always fresh
  renderCurrentView();
}

function renderDashboard() {
  const data = metrics();
  const currentYear = new Date().getFullYear();
  const currentMonth = today.toISOString().slice(0, 7);
  const currentMonthOrders = state.orders.filter((order) => order.status !== "Cancelado" && order.date && order.date.startsWith(currentMonth));
  const emotionalStatuses = Array.isArray(state.productionStatuses) && state.productionStatuses.length ? state.productionStatuses : STATUS;
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
      ${metric("Total de pedidos", data.total, "Mês atual")}
      ${metric("Em producao", data.production, "Chaveiros no atelie")}
      ${metric("Pedidos enviados", data.sent, "Com rastreio")}
      ${metric("Faturamento do mes", money(data.revenue), "Vendas ativas")}
      ${metric("Faturamento do Ano", money(data.yearlyRevenue), `Total em ${currentYear}`)}
      ${metric("Despesas do mes", money(data.expenses), "Operacao e marketing")}
      ${metric("Lucro estimado", money(data.profitAfterExpenses), "Liquido aproximado")}
      ${metric("Ticket Médio", money(data.ticketMedio), "Bruto por pedido")}
      ${metric("Tempo de Maquina", `${data.totalMachineTime.toFixed(1)}h`, "Uso total ativo")}
    </div>

    <div class="grid content-grid">
      <div class="panel">
        <div class="section-head"><h3>Fila emocional de producao</h3><button class="mini-button" data-view="orders">Organizar</button></div>
        <div class="status-strip">${emotionalStatuses.map((status) => `<span class="status-pill ${statusClass(status)}">${status}<b>${currentMonthOrders.filter((order) => order.status === status).length}</b></span>`).join("")}</div>
      </div>
      <div class="panel">
        <h3>Proximas entregas</h3>
        <div class="list">${(() => {
          const upcoming = state.orders
            .filter((order) => order.status !== "Entregue" && order.status !== "Cancelado" && order.date)
            .sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"))
            .slice(0, 6);
          if (!upcoming.length) return `<p class="muted" style="padding:12px 0">Nenhum pedido pendente.</p>`;
          return upcoming.map((order) => {
            return `
            <button class="soft-row" data-detail="${order.id}">
              <span><strong>${order.client}</strong><small>${order.product}</small></span>
              <span style="display:flex;align-items:center;gap:6px"><b>${formatDate(order.date)}</b></span>
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
          ${ORDER_STATUSES.map((status) => `<option ${state.statusFilter === status ? "selected" : ""}>${status}</option>`).join("")}
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
                ${tableHeader("date", "Data do Pedido")}
                ${tableHeader("actualDelivery", "Entregue Em")}
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
  const petList = petNamesForOrder(order);
  const petLabel = petList[0] || order.petName || (order.client || "").split(" ")[0] || "Pet";
  const itemLabel = order.quantity > 1 ? `${order.quantity} chaveiros` : "1 chaveiro";
  return `
    <article class="order-card${compact ? " compact" : ""}">
      <div class="order-card-head">
        <div>
          <strong>${escapeHtml(order.client)}</strong>
          <small>${escapeHtml(order.id)}</small>
        </div>
        <span class="status-pill ${statusClass(getOrderWorkflowStatus(order))}">${escapeHtml(getOrderWorkflowStatus(order))}</span>
      </div>
      <div class="order-card-body">
        <div class="order-card-row">
          <div>
            <span>Pet</span>
            <strong>${escapeHtml(petLabel)}</strong>
          </div>
          <div>
            <span>Itens do pedido</span>
            <strong>${itemLabel}</strong>
          </div>
        </div>
        ${petList.length > 1 ? `
          <div class="order-card-pet-list">
            ${petList.map((name, index) => `<span>${index + 1}. ${escapeHtml(name)}</span>`).join("")}
          </div>
        ` : ""}
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
          <div>${detailLine("Data", order.date ? formatDate(order.date) : "Sem data")}</div>
          ${getOrderWorkflowStatus(order) === "Entregue" ? `<div>${detailLine("Entregue Em", order.actualDelivery ? formatDate(order.actualDelivery) : "Pendente")}</div>` : ""}
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
      <td><input class="cell-input date-cell" data-edit="${order.id}" data-field="date" type="date" value="${order.date || ''}"></td>
      <td>
        ${getOrderWorkflowStatus(order) === "Entregue" ? `<input class="cell-input date-cell" data-edit="${order.id}" data-field="actualDelivery" type="date" value="${order.actualDelivery || ''}">` : `<span class="readonly-cell muted" style="font-size:0.8rem">-</span>`}
      </td>
      <td><input class="cell-input wide-cell" data-edit="${order.id}" data-field="tracking" value="${order.tracking}"></td>
      <td><select class="status-select ${statusClass(getOrderWorkflowStatus(order))}" data-status="${order.id}">${ORDER_STATUSES.map((status) => `<option ${status === getOrderWorkflowStatus(order) ? "selected" : ""}>${status}</option>`).join("")}</select></td>
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

function saveProductionStatuses() {
  localStorage.setItem("mpa:production_statuses_v1", JSON.stringify(state.productionStatuses));
}

function mapLegacyStatus(status) {
  if (state.productionStatuses.includes(status)) return status;
  
  const normalized = String(status || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (normalized.includes("recebi") || normalized.includes("novo")) {
    return state.productionStatuses.includes("Recebido") ? "Recebido" : state.productionStatuses[0];
  }
  if (normalized.includes("arte") || normalized.includes("impress") || normalized.includes("criac") || normalized.includes("produ")) {
    return state.productionStatuses.includes("Em Produção") ? "Em Produção" : (state.productionStatuses[1] || state.productionStatuses[0]);
  }
  if (normalized.includes("pint") || normalized.includes("ornam")) {
    return state.productionStatuses.includes("Pintura") ? "Pintura" : (state.productionStatuses[2] || state.productionStatuses[0]);
  }
  if (normalized.includes("mont") || normalized.includes("final") || normalized.includes("foto") || normalized.includes("embal")) {
    return state.productionStatuses.includes("Finalização") ? "Finalização" : (state.productionStatuses[3] || state.productionStatuses[0]);
  }
  if (normalized.includes("pront") || normalized.includes("envi")) {
    return state.productionStatuses.includes("Pronto") ? "Pronto" : (state.productionStatuses[4] || state.productionStatuses[0]);
  }
  
  return state.productionStatuses[0] || "Recebido";
}

function productionBadgeColor(status, delivery) {
  const todayStr = today.toISOString().slice(0,10);
  if (delivery && delivery < todayStr && !["Pronto","Enviado","Cancelado"].includes(status)) return "#e04949"; // atrasado
  const completed = ["Pronto","Enviado"];
  const notStarted = ["Recebido"];
  if (completed.includes(status)) return "#2fbf71"; // green
  if (notStarted.includes(status)) return "#9aa0a6"; // gray
  return "#2b7cff"; // blue - in progress
}

function orderProgress(order) {
  const index = state.productionStatuses.indexOf(order.status);
  if (index < 0) return 0;
  return Math.round(((index + 1) / state.productionStatuses.length) * 100);
}

function orderIsOverdue(order) {
  const todayStr = today.toISOString().slice(0, 10);
  return order.delivery && order.delivery < todayStr && !["Pronto", "Enviado", "Cancelado"].includes(order.status);
}

function getPetBreed(order) {
  const notes = String(order.notes || "").toLowerCase();
  const breeds = ["shih tzu", "poodle", "maltes", "pinscher", "yorkshire", "schnauzer", "bulldog", "spitz", "boxer", "beagle", "labrador", "golden", "pug", "chiahuahua", "dachshund", "vira-lata", "srd", "gato"];
  for (const b of breeds) {
    if (notes.includes(b)) {
      return b.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
  }
  if (order.product) {
    return order.product.replace("Chaveiro", "").replace("Combo 2", "").replace("premium", "").replace("cartoon", "").trim() || "Chaveiro";
  }
  return "Personalizado";
}

function petNameFromClient(client) {
  return String(client || "").trim().split(" ")[0] || "Pet";
}

function normalizePetNames(value, quantity = 1, fallback = "") {
  const raw = String(value || "");
  const names = raw
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (names.length) return names;
  if (quantity > 1) {
    return Array.from({ length: Math.max(1, Number(quantity) || 1) }, (_, index) => `${fallback || "Pet"} ${index + 1}`);
  }
  return [fallback || "Pet"];
}

function petNamesForOrder(order) {
  if (Array.isArray(order.petNames) && order.petNames.length) return order.petNames;
  return normalizePetNames(order.petName, order.quantity, order.petName || petNameFromClient(order.client));
}

function normalizeClientKey(value) {
  return String(value || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function groupOrdersByClient(orders) {
  const groups = new Map();
  orders.forEach((order) => {
    const key = normalizeClientKey(order.client) || order.id;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        client: order.client || "Sem cliente",
        orders: []
      });
    }
    groups.get(key).orders.push(order);
  });
  return Array.from(groups.values()).sort((a, b) => a.client.localeCompare(b.client, "pt-BR"));
}

function getProductionStepInfo(status) {
  const steps = {
    "Em Produção": { key: "productionDone", label: "Produzido" },
    "Pintura": { key: "paintDone", label: "Pintado" }
  };
  return steps[status] || null;
}

function getNextProductionStatus(status) {
  const index = state.productionStatuses.indexOf(status);
  if (index >= 0 && index < state.productionStatuses.length - 1) {
    return state.productionStatuses[index + 1];
  }
  return null;
}

function updateClientGroupProgress(groupOrders, status) {
  const step = getProductionStepInfo(status);
  if (!step) return 0;
  const total = groupOrders.reduce((sum, order) => sum + petNamesForOrder(order).length, 0);
  if (!total) return 0;
  const done = groupOrders.reduce((sum, order) => {
    const names = petNamesForOrder(order);
    const flags = Array.isArray(order[step.key]) ? order[step.key] : [];
    return sum + names.filter((_, index) => !!flags[index]).length;
  }, 0);
  return Math.min(100, Math.round((done / total) * 100));
}

function advanceClientGroupIfComplete(groupOrders, status) {
  const step = getProductionStepInfo(status);
  if (!step) return;
  const nextStatus = getNextProductionStatus(status);
  const done = groupOrders.every((order) => {
    const names = petNamesForOrder(order);
    const flags = Array.isArray(order[step.key]) ? order[step.key] : [];
    return names.length && names.every((_, index) => !!flags[index]);
  });
  if (!done || !nextStatus) return;
  groupOrders.forEach((order) => {
    order.status = nextStatus;
    order[step.key] = [];
    order.history.unshift({ at: formatDateTime(new Date()), text: `Grupo avançou para ${nextStatus}` });
  });
  save();
}

function renderProduction() {
  state.productionSearch = state.productionSearch || "";
  state.productionFilter = state.productionFilter || "Todos";
  state.productionPriorityFilter = state.productionPriorityFilter || "Todos";
  state.productionDateSort = state.productionDateSort || "prox-entrega";

  // Map legacy statuses
  state.orders.forEach(order => {
    if (order.status && !state.productionStatuses.includes(order.status) && !["Enviado", "Entregue", "Cancelado"].includes(order.status)) {
      order.status = mapLegacyStatus(order.status);
    }
  });

  const term = String(state.productionSearch || "").trim().toLowerCase();
  let list = state.orders.filter((order) => state.productionStatuses.includes(order.status));
  
  if (state.productionFilter && state.productionFilter !== "Todos") {
    list = list.filter((order) => order.status === state.productionFilter);
  }
  
  if (state.productionPriorityFilter && state.productionPriorityFilter !== "Todos") {
    list = list.filter((order) => order.priority === state.productionPriorityFilter);
  }
  
  if (term) {
    list = list.filter((order) => {
      const petName = order.petName || (order.client || "").split(" ")[0] || "";
      return `${order.id} ${order.client} ${order.product} ${petName} ${order.priority}`.toLowerCase().includes(term);
    });
  }

  // Sort orders
  list.sort((a, b) => {
    if (state.productionDateSort === "prox-entrega") {
      return (a.delivery || "").localeCompare(b.delivery || "");
    } else if (state.productionDateSort === "longe-entrega") {
      return (b.delivery || "").localeCompare(a.delivery || "");
    } else if (state.productionDateSort === "mais-recente") {
      return (b.date || "").localeCompare(a.date || "");
    } else if (state.productionDateSort === "mais-antigo") {
      return (a.date || "").localeCompare(b.date || "");
    }
    return 0;
  });

  const grouped = state.productionStatuses.reduce((acc, status) => ({ ...acc, [status]: [] }), {});
  list.forEach((order) => {
    if (!grouped[order.status]) grouped[order.status] = [];
    grouped[order.status].push(order);
  });

  document.getElementById("productionView").innerHTML = `
    <div class="panel production-panel">
      <div class="production-header-section">
        <div class="title-area">
          <h2>Controle de Produção</h2>
          <p class="muted">Acompanhe cada pedido em todas as etapas da produção. ❤️</p>
        </div>
        
        <div class="production-toolbar-new">
          <div class="search-wrap">
            <span class="search-icon-new">🔍</span>
            <input id="productionSearch" class="search-input-new" placeholder="Buscar pedido..." value="${escapeHtml(state.productionSearch)}" />
          </div>
          
          <div class="filter-dropdown-wrap">
            <span class="dropdown-icon">📅</span>
            <select id="productionDateSort" class="filter-select-new">
              <option value="prox-entrega" ${state.productionDateSort === "prox-entrega" ? "selected" : ""}>Prazo (Mais próximo)</option>
              <option value="longe-entrega" ${state.productionDateSort === "longe-entrega" ? "selected" : ""}>Prazo (Mais distante)</option>
              <option value="mais-recente" ${state.productionDateSort === "mais-recente" ? "selected" : ""}>Data (Mais recente)</option>
              <option value="mais-antigo" ${state.productionDateSort === "mais-antigo" ? "selected" : ""}>Data (Mais antigo)</option>
            </select>
          </div>

          <div class="filter-dropdown-wrap">
            <span class="dropdown-icon">🚩</span>
            <select id="productionPriorityFilter" class="filter-select-new">
              <option value="Todos" ${state.productionPriorityFilter === "Todos" ? "selected" : ""}>Prioridade (Todas)</option>
              <option value="Alta" ${state.productionPriorityFilter === "Alta" ? "selected" : ""}>Alta</option>
              <option value="Média" ${state.productionPriorityFilter === "Média" ? "selected" : ""}>Média</option>
              <option value="Baixa" ${state.productionPriorityFilter === "Baixa" ? "selected" : ""}>Baixa</option>
            </select>
          </div>

          <div class="filter-dropdown-wrap">
            <span class="dropdown-icon">⚙️</span>
            <select id="productionStatusFilter" class="filter-select-new">
              <option value="Todos" ${state.productionFilter === "Todos" ? "selected" : ""}>Colunas (Todas)</option>
              ${state.productionStatuses.map((s) => `<option value="${s}" ${state.productionFilter === s ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </div>

          <button class="add-col-button" type="button" id="addColBtn" title="Adicionar nova etapa de produção">+ Nova Coluna</button>
          <button class="primary-button-new" type="button" data-open-order>+ Novo Pedido</button>
        </div>
      </div>

      <div class="kanban-board-new">
        ${state.productionStatuses.map((status, index) => {
          const items = grouped[status] || [];
          const clientGroups = groupOrdersByClient(items);
          const stepInfo = getProductionStepInfo(status);
          const headerColors = [
            { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' }, // Recebido - yellow/amber
            { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' }, // Em Produção - orange
            { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' }, // Pintura - pink/red
            { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' }, // Finalização - rose
            { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' }  // Pronto - green
          ];
          const color = headerColors[index % headerColors.length];
          
          return `
            <section class="kanban-column-new">
              <div class="kanban-column-head-new" style="background-color: ${color.bg}; color: ${color.text}; border-bottom: 2px solid ${color.border}">
                <div class="column-title-wrap">
                  <span class="column-index">${index + 1}.</span>
                  <h3 class="column-name">${status.toUpperCase()}</h3>
                  <button class="delete-column-btn-new" data-delete-status="${status}" title="Excluir Coluna">✕</button>
                </div>
                <span class="column-count-badge">${items.length}</span>
              </div>
                <div class="kanban-column-body-new" data-status="${status}">
                ${clientGroups.length ? clientGroups.map((group) => {
                  const primary = group.orders[0];
                  const groupId = `${status}-${group.key}`;
                  const expanded = state.expandedProductionGroups?.[groupId];
                  const totalPets = group.orders.reduce((sum, order) => sum + Number(order.quantity || 1), 0);
                  const primaryPet = primary.petName || (primary.client || "").split(" ")[0] || "-";
                  const photoStyle = primary.petPhoto ? `style="background-image:url('${primary.petPhoto}')"` : "";
                  const breed = getPetBreed(primary);
                  const progress = stepInfo ? updateClientGroupProgress(group.orders, status) : 0;
                  let formattedDate = "";
                  if (primary.date) {
                    const parts = primary.date.split("-");
                    if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`;
                  }
                  return `
                    <article class="kanban-group-card ${expanded ? "expanded" : ""}" draggable="true" data-order="${primary.id}" data-group-key="${group.key}" data-status="${status}">
                      <button class="kanban-group-header" type="button" data-toggle-production-group="${groupId}">
                        <div class="kanban-group-summary">
                          <strong>${escapeHtml(group.client)}</strong>
                          <span>${totalPets} pet${totalPets === 1 ? "" : "s"}${group.orders.length > 1 ? `, ${group.orders.length} pedidos` : ""}</span>
                        </div>
                        <span class="kanban-group-toggle">${expanded ? "Recolher" : "Expandir"}</span>
                      </button>
                      <div class="kanban-group-primary">
                        <div class="kanban-card-keychain-container">
                          <div class="keychain-link-ring"></div>
                          <div class="keychain-link-chain"></div>
                          <div class="kanban-card-photo" ${photoStyle}></div>
                        </div>
                        <div class="kanban-card-info-wrap">
                          <div class="kanban-card-top-row">
                            <span class="kanban-card-id">#${primary.id.split("-").pop() || primary.id}</span>
                            <button class="kanban-card-menu-btn" data-detail="${primary.id}" type="button">⋮</button>
                          </div>
                          <h4 class="kanban-card-pet-name">${escapeHtml(primaryPet)}</h4>
                          <p class="kanban-card-breed">${escapeHtml(breed)}</p>
                          <div class="kanban-card-meta-new">
                            <div class="kanban-card-delivery-row">
                              <span class="calendar-icon-card">📅</span>
                              <span class="date-card">${formattedDate || "Sem data"}</span>
                            </div>
                            <div class="kanban-card-priority-wrap">
                              <span class="priority-dot-new priority-${String(primary.priority).toLowerCase().normalize("NFD").replace(/[ - ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}"></span>
                              <span class="priority-text-new">${escapeHtml(primary.priority)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      ${stepInfo ? `
                        <div class="kanban-progress-row">
                          <div class="kanban-progress">
                            <span style="width:${progress}%"></span>
                          </div>
                          <div class="kanban-progress-meta">
                            <b>${progress}%</b>
                            <small>${progress < 100 ? `${stepInfo.label} pendente` : "Pronto para avançar"}</small>
                          </div>
                        </div>
                      ` : ""}
                      ${expanded ? `
                        <div class="kanban-group-expanded">
                          ${group.orders.map((order) => `
                            ${(() => {
                              const petNames = petNamesForOrder(order);
                              const flags = (stepInfo && Array.isArray(order[stepInfo.key])) ? order[stepInfo.key] : Array.from({ length: petNames.length }, () => false);
                              return `
                            <div class="kanban-mini-order">
                              <button type="button" class="kanban-mini-order-main" data-detail="${order.id}">
                                <span>
                                  <strong>${escapeHtml(order.client || "Sem cliente")}</strong>
                                  <small>${escapeHtml(order.product)}</small>
                                </span>
                                <b>${order.quantity}x</b>
                              </button>
                              ${stepInfo ? `
                                <div class="kanban-mini-order-pets">
                                  ${petNames.map((petName, index) => `
                                    <label class="kanban-mini-order-check">
                                      <input type="checkbox" data-production-step="${status}" data-production-order="${order.id}" data-production-index="${index}" ${flags[index] ? "checked" : ""} />
                                      <span>${escapeHtml(petName)} - ${stepInfo.label}</span>
                                    </label>
                                  `).join("")}
                                </div>
                              ` : ""}
                            </div>
                              `;
                            })()}
                          `).join("")}
                        </div>
                      ` : ""}
                    </article>
                  `;
                }).join("") : ""}
                
                <!-- Custom dashed placeholder at the bottom -->
                <div class="kanban-add-placeholder" data-open-order data-target-status="${status}">
                  <span class="plus-icon">+</span> Adicionar pedido
                </div>
              </div>
            </section>
          `;
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

function getReportDates(period) {
  const end = new Date(today);
  const start = new Date(today);
  if (period === "7d") {
    start.setDate(today.getDate() - 7);
  } else if (period === "30d") {
    start.setDate(today.getDate() - 30);
  } else if (period === "90d") {
    start.setDate(today.getDate() - 90);
  } else if (period === "mes-atual") {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1, 0);
  } else if (period === "ano-atual") {
    start.setMonth(0, 1);
    end.setMonth(11, 31);
  } else {
    start.setDate(today.getDate() - 30);
  }
  return { start, end };
}

function getCompareDates(start, end) {
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const compareEnd = new Date(start);
  compareEnd.setDate(start.getDate() - 1);
  
  const compareStart = new Date(compareEnd);
  compareStart.setDate(compareEnd.getDate() - diffDays);
  
  return { start: compareStart, end: compareEnd };
}

function getOrdersInPeriod(start, end, productFilter = "Todos") {
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);
  return state.orders.filter(order => {
    if (order.status === "Cancelado") return false;
    if (order.date < startStr || order.date > endStr) return false;
    if (productFilter !== "Todos" && order.product !== productFilter) return false;
    return true;
  });
}

function calculateMetricsForPeriod(orders) {
  const faturamento = orders.reduce((sum, o) => sum + o.totalWithShipping, 0);
  const totalPedidos = orders.length;
  const ticketMedio = totalPedidos > 0 ? faturamento / totalPedidos : 0;
  const produtosVendidos = orders.reduce((sum, o) => sum + o.quantity, 0);
  return { faturamento, totalPedidos, ticketMedio, produtosVendidos };
}

function calculateGrowth(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

function generateLineChartSVG(currentDays, prevDays, daysLabels) {
  const maxVal = Math.max(...currentDays, ...prevDays, 100);
  const padMax = maxVal * 1.15;
  
  const width = 600;
  const height = 220;
  const padding = 45;
  
  const pointsCurrent = [];
  const pointsPrev = [];
  
  const getX = (index, total) => padding + (index / (total - 1 || 1)) * (width - 2 * padding);
  const getY = (val) => height - padding - (val / padMax) * (height - 2 * padding);
  
  currentDays.forEach((val, idx) => {
    pointsCurrent.push(`${getX(idx, currentDays.length)},${getY(val)}`);
  });
  
  prevDays.forEach((val, idx) => {
    pointsPrev.push(`${getX(idx, prevDays.length)},${getY(val)}`);
  });
  
  const pathCurrent = pointsCurrent.length > 1 ? `M ${pointsCurrent.join(" L ")}` : "";
  const pathPrev = pointsPrev.length > 1 ? `M ${pointsPrev.join(" L ")}` : "";
  
  let areaPath = "";
  if (pointsCurrent.length > 1) {
    areaPath = `${pathCurrent} L ${getX(currentDays.length - 1, currentDays.length)},${height - padding} L ${getX(0, currentDays.length)},${height - padding} Z`;
  }
  
  let gridsHtml = "";
  for (let i = 0; i <= 4; i++) {
    const yVal = padMax * (i / 4);
    const y = getY(yVal);
    gridsHtml += `
      <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="var(--line)" stroke-dasharray="2,2" stroke-width="1" stroke-opacity="0.6" />
      <text x="${padding - 8}" y="${y + 3}" font-size="8.5" fill="var(--muted)" text-anchor="end">${money(yVal).replace(",00", "")}</text>
    `;
  }
  
  let xLabelsHtml = "";
  const step = Math.max(Math.ceil(currentDays.length / 5), 1);
  for (let i = 0; i < currentDays.length; i += step) {
    const x = getX(i, currentDays.length);
    xLabelsHtml += `
      <text x="${x}" y="${height - 15}" font-size="9" fill="var(--muted)" text-anchor="middle">${daysLabels[i] || ""}</text>
    `;
  }
  if ((currentDays.length - 1) % step !== 0) {
    const lastX = getX(currentDays.length - 1, currentDays.length);
    xLabelsHtml += `
      <text x="${lastX}" y="${height - 15}" font-size="9" fill="var(--muted)" text-anchor="middle">${daysLabels[currentDays.length - 1] || ""}</text>
    `;
  }

  return `
    <svg viewBox="0 0 ${width} ${height}" class="line-chart-svg" style="width: 100%; height: auto; display: block;">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--red)" stop-opacity="0.18" />
          <stop offset="100%" stop-color="var(--red)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${gridsHtml}
      ${pathPrev ? `<path d="${pathPrev}" fill="none" stroke="#fca5a5" stroke-width="1.8" stroke-dasharray="3,3" />` : ""}
      ${areaPath ? `<path d="${areaPath}" fill="url(#chartGradient)" />` : ""}
      ${pathCurrent ? `<path d="${pathCurrent}" fill="none" stroke="var(--red)" stroke-width="2.5" />` : ""}
      ${xLabelsHtml}
    </svg>
  `;
}

function generateDonutChartSVG(data) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return `
      <svg viewBox="0 0 100 100" class="donut-chart-svg" style="max-width: 160px; margin: 0 auto; display: block;">
        <circle cx="50" cy="50" r="35" fill="none" stroke="var(--line)" stroke-width="14" />
        <text x="50" y="54" font-size="8" fill="var(--muted)" text-anchor="middle">Sem dados</text>
      </svg>
    `;
  }
  
  let strokeOffset = 0;
  let segmentsHtml = "";
  
  const r = 35;
  const circumference = 2 * Math.PI * r;
  
  data.forEach(item => {
    const pct = item.value / total;
    const strokeLength = pct * circumference;
    const strokeDash = `${strokeLength} ${circumference - strokeLength}`;
    const rotation = (strokeOffset / circumference) * 360 - 90;
    
    segmentsHtml += `
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="${item.color}" stroke-width="14"
              stroke-dasharray="${strokeDash}" transform="rotate(${rotation} 50 50)" />
    `;
    
    strokeOffset += strokeLength;
  });
  
  return `
    <svg viewBox="0 0 100 100" class="donut-chart-svg" style="max-width: 160px; margin: 0 auto; display: block;">
      <circle cx="50" cy="50" r="35" fill="none" stroke="var(--surface-solid)" stroke-width="14" />
      ${segmentsHtml}
      <circle cx="50" cy="50" r="23" fill="var(--surface-solid)" />
    </svg>
  `;
}

function renderReports() {
  const { start, end } = getReportDates(state.reportPeriod);
  const { start: prevStart, end: prevEnd } = getCompareDates(start, end);
  
  const currentOrders = getOrdersInPeriod(start, end, state.reportProduct);
  const prevOrders = getOrdersInPeriod(prevStart, prevEnd, state.reportProduct);
  
  const current = calculateMetricsForPeriod(currentOrders);
  const prev = calculateMetricsForPeriod(prevOrders);
  const currentAllExpenses = state.expenses
    .filter((expense) => expense.date && expense.date >= start.toISOString().slice(0, 10) && expense.date <= end.toISOString().slice(0, 10))
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const currentShippingExpenses = state.expenses
    .filter((expense) => expense.date && expense.date >= start.toISOString().slice(0, 10) && expense.date <= end.toISOString().slice(0, 10) && String(expense.category || "").toLowerCase() === "frete")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const currentOtherExpenses = currentAllExpenses - currentShippingExpenses;
  const currentShippingReceived = currentOrders.reduce((sum, order) => sum + Number(order.shipping || 0), 0);
  // Lucro Real = Faturamento - Despesas reais cadastradas (sem descontar custo estimado do produto)
  const currentRealProfit = current.faturamento - currentAllExpenses;
  
  const faturamentoGrowth = calculateGrowth(current.faturamento, prev.faturamento);
  const pedidosGrowth = calculateGrowth(current.totalPedidos, prev.totalPedidos);
  const ticketGrowth = calculateGrowth(current.ticketMedio, prev.ticketMedio);
  const produtosGrowth = calculateGrowth(current.produtosVendidos, prev.produtosVendidos);

  // Group current daily faturamento
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const currentDaysVal = Array(diffDays).fill(0);
  const prevDaysVal = Array(diffDays).fill(0);
  const daysLabels = [];

  const fmtDateLabel = (d) => `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`;

  for (let i = 0; i < diffDays; i++) {
    const currDate = new Date(start);
    currDate.setDate(start.getDate() + i);
    const currDateStr = currDate.toISOString().slice(0, 10);
    daysLabels.push(fmtDateLabel(currDate));

    currentOrders.forEach(o => {
      if (o.date === currDateStr) currentDaysVal[i] += o.totalWithShipping;
    });

    const prevDate = new Date(prevStart);
    prevDate.setDate(prevStart.getDate() + i);
    const prevDateStr = prevDate.toISOString().slice(0, 10);
    
    prevOrders.forEach(o => {
      if (o.date === prevDateStr) prevDaysVal[i] += o.totalWithShipping;
    });
  }

  // Get dynamic period labels for filter display
  const fmt = d => `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
  const periodRangeLabel = `${fmt(start)} – ${fmt(end)}`;
  const prevPeriodRangeLabel = `${fmt(prevStart)} – ${fmt(prevEnd)}`;

  // Pedidos por Status
  const statusCounts = {};
  STATUS.forEach(s => { statusCounts[s] = 0; });
  currentOrders.forEach(o => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  
  const statusColorsMap = {
    "Recebido": "#f97316",       // Orange
    "Novo Pedido": "#eab308",     // Yellow
    "Em Produção": "#f97316",     // Orange
    "Em Producao": "#f97316",     // Orange
    "Pintura": "#a855f7",         // Purple
    "Finalização": "#ec4899",     // Pink
    "Pronto para Envio": "#22c55e", // Green
    "Pronto": "#22c55e",          // Green
    "Enviado": "#3b82f6",         // Blue
    "Entregue": "#10b981",        // Teal
    "Cancelado": "#9ca3af"        // Gray
  };

  // Group into consolidated statuses like image:
  // Em produção, Pronto para envio, Entregue, Pendente, Cancelado
  const consolidatedStatuses = [
    { label: "Em produção", keys: ["Em Produção", "Em Producao", "Pintura", "Finalização", "Ornamentos", "Criação do 3D", "Fila Impressão", "Imprimindo 3D"], color: "#f97316" },
    { label: "Pronto para envio", keys: ["Pronto para Envio", "Pronto", "Pronto para Foto", "Embalagem"], color: "#f43f5e" },
    { label: "Entregue", keys: ["Entregue", "Enviado"], color: "#2f8f5b" },
    { label: "Pendente", keys: ["Recebido", "Novo Pedido"], color: "#ffd66b" },
    { label: "Cancelado", keys: ["Cancelado"], color: "#7a6259" }
  ];

  const donutData = consolidatedStatuses.map(group => {
    let count = 0;
    group.keys.forEach(k => {
      count += statusCounts[k] || 0;
    });
    return { label: group.label, value: count, color: group.color };
  }).filter(item => item.value > 0);

  const donutTotal = donutData.reduce((s, d) => s + d.value, 0);

  // Vendas por Produto
  const productGroup = {};
  currentOrders.forEach(o => {
    const breed = getPetBreed(o);
    const prodKey = `Chaveiro Pet - ${breed}`;
    productGroup[prodKey] = (productGroup[prodKey] || 0) + o.quantity;
  });
  
  const sortedProducts = Object.entries(productGroup)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
  
  const topProducts = sortedProducts.slice(0, 4);
  const othersTotal = sortedProducts.slice(4).reduce((sum, p) => sum + p.total, 0);
  if (othersTotal > 0) {
    topProducts.push({ name: "Outros", total: othersTotal });
  }
  const maxProductTotal = Math.max(...topProducts.map(p => p.total), 1);

  // Faturamento por Dia da Semana (Seg a Dom)
  const weekDaysSales = [0, 0, 0, 0, 0, 0, 0]; // 0 = Dom, 1 = Seg, etc.
  currentOrders.forEach(o => {
    const d = new Date(o.date + 'T12:00:00');
    const day = d.getDay();
    weekDaysSales[day] += o.totalWithShipping;
  });

  const weekdayOrdered = [
    { label: "Seg", value: weekDaysSales[1] },
    { label: "Ter", value: weekDaysSales[2] },
    { label: "Qua", value: weekDaysSales[3] },
    { label: "Qui", value: weekDaysSales[4] },
    { label: "Sex", value: weekDaysSales[5] },
    { label: "Sáb", value: weekDaysSales[6] },
    { label: "Dom", value: weekDaysSales[0] }
  ];
  const maxWeekdayVal = Math.max(...weekdayOrdered.map(w => w.value), 100);

  // Top Clientes
  const clientGroup = {};
  currentOrders.forEach(o => {
    clientGroup[o.client] = (clientGroup[o.client] || 0) + o.totalWithShipping;
  });
  const topClients = Object.entries(clientGroup)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const growthPillHtml = (val) => {
    const isPos = val >= 0;
    const color = isPos ? "#2f8f5b" : "#d83f31";
    const sign = isPos ? "↑" : "↓";
    return `
      <span class="growth-text" style="color: ${color}; font-weight: 700; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 3px;">
        ${sign} ${Math.abs(val).toFixed(1)}% <span style="color: var(--muted); font-weight: 400; font-size: 0.75rem;">vs periodo anterior</span>
      </span>
    `;
  };

  const getClientInitial = (name) => String(name || "").trim().charAt(0).toUpperCase() || "C";

  const clientColors = ["#fee2e2", "#ffedd5", "#fef3c7", "#dcfce7", "#e0f2fe", "#f3e8ff"];

  document.getElementById("reportsView").innerHTML = `
    <div class="panel reports-panel">
      <!-- Toolbar Filters -->
      <div class="reports-toolbar-section">
        <div class="filter-dropdown-wrap">
          <span class="dropdown-icon">📅</span>
          <select id="reportPeriodSelect" class="filter-select-new">
            <option value="30d" ${state.reportPeriod === "30d" ? "selected" : ""}>Período: Últimos 30 dias</option>
            <option value="7d" ${state.reportPeriod === "7d" ? "selected" : ""}>Período: Últimos 7 dias</option>
            <option value="90d" ${state.reportPeriod === "90d" ? "selected" : ""}>Período: Últimos 90 dias</option>
            <option value="mes-atual" ${state.reportPeriod === "mes-atual" ? "selected" : ""}>Período: Mês Atual</option>
            <option value="ano-atual" ${state.reportPeriod === "ano-atual" ? "selected" : ""}>Período: Ano Atual</option>
          </select>
        </div>

        <div class="filter-dropdown-wrap">
          <span>Comparar com</span>
          <select id="reportCompareSelect" class="filter-select-new">
            <option value="anterior" ${state.reportCompare === "anterior" ? "selected" : ""}>Período anterior</option>
          </select>
        </div>

        <div class="filter-dropdown-wrap">
          <span class="dropdown-icon">📦</span>
          <select id="reportProductSelect" class="filter-select-new">
            <option value="Todos">Todos os produtos</option>
            ${state.products.map(p => `<option value="${p.name}" ${state.reportProduct === p.name ? "selected" : ""}>${p.name}</option>`).join("")}
          </select>
        </div>

        <button class="export-report-btn" id="exportReportBtn" title="Exportar dados do relatório para CSV">
          <span>📥</span> Exportar Relatório
        </button>
      </div>

      <!-- KPI Cards Row -->
    <div class="grid reports-kpi-grid">
        <!-- Card 1: Faturamento -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Faturamento Total</span>
            <strong class="kpi-value">${money(current.faturamento)}</strong>
            ${growthPillHtml(faturamentoGrowth)}
          </div>
          <div class="kpi-icon-wrap kpi-icon-red">
            <span>$</span>
          </div>
        </div>

        <!-- Card 2: Frete Recebido -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Frete Recebido</span>
            <strong class="kpi-value">${money(currentShippingReceived)}</strong>
            <span class="growth-text" style="color: var(--muted); font-weight: 700; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 3px;">Mensal nos pedidos</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-orange">
            <span>🚚</span>
          </div>
        </div>

        <!-- Card 3: Frete Pago -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Frete Pago</span>
            <strong class="kpi-value">${money(currentShippingExpenses)}</strong>
            <span class="growth-text" style="color: var(--muted); font-weight: 700; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 3px;">Despesa lançada no mês</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-pink">
            <span>📦</span>
          </div>
        </div>

        <!-- Card 4: Total Pedidos -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Total de Pedidos</span>
            <strong class="kpi-value">${current.totalPedidos}</strong>
            ${growthPillHtml(pedidosGrowth)}
          </div>
          <div class="kpi-icon-wrap kpi-icon-orange">
            <span>🛍️</span>
          </div>
        </div>

        <!-- Card 5: Ticket Médio -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Ticket Médio</span>
            <strong class="kpi-value">${money(current.ticketMedio)}</strong>
            ${growthPillHtml(ticketGrowth)}
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <span>📈</span>
          </div>
        </div>

        <!-- Card 6: Produtos Vendidos -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Produtos Vendidos</span>
            <strong class="kpi-value">${current.produtosVendidos}</strong>
            ${growthPillHtml(produtosGrowth)}
          </div>
          <div class="kpi-icon-wrap kpi-icon-pink">
            <span>📦</span>
          </div>
        </div>

        <!-- Card 7: Lucro Real -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Lucro Real</span>
            <strong class="kpi-value">${money(currentRealProfit)}</strong>
            <span class="growth-text" style="color: var(--muted); font-weight: 700; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 3px;">Depois de despesas</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <span>💰</span>
          </div>
        </div>
      </div>

      <!-- Middle Charts Row (Faturamento Line and Donut Status) -->
      <div class="grid reports-middle-grid">
        <!-- Line Chart Panel -->
        <div class="panel chart-panel-new">
          <div class="chart-panel-head">
            <h3>Faturamento</h3>
            <div class="chart-legend-row">
              <span class="legend-indicator legend-curr"><i class="legend-line"></i> ${periodRangeLabel}</span>
              <span class="legend-indicator legend-prev"><i class="legend-line-dashed"></i> ${prevPeriodRangeLabel}</span>
            </div>
          </div>
          <div class="line-chart-container">
            ${generateLineChartSVG(currentDaysVal, prevDaysVal, daysLabels)}
          </div>
        </div>

        <!-- Donut Status Panel -->
        <div class="panel chart-panel-new">
          <div class="chart-panel-head">
            <h3>Pedidos por Status</h3>
          </div>
          <div class="donut-chart-layout">
            <div class="donut-svg-wrap">
              ${generateDonutChartSVG(donutData)}
            </div>
            <div class="donut-legend-wrap">
              ${consolidatedStatuses.map(group => {
                let count = 0;
                group.keys.forEach(k => { count += statusCounts[k] || 0; });
                const pct = donutTotal > 0 ? Math.round((count / donutTotal) * 100) : 0;
                return `
                  <div class="donut-legend-row">
                    <span class="donut-legend-color" style="background-color: ${group.color}"></span>
                    <div class="donut-legend-info">
                      <span class="donut-legend-label">${group.label}</span>
                      <small class="donut-legend-count">${count} pedido${count !== 1 ? "s" : ""}</small>
                    </div>
                    <span class="donut-legend-pct">${pct}%</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Charts Row (Product horizontal, Weekday vertical, Top clients) -->
      <div class="grid reports-bottom-grid">
        <!-- Vendas por Produto -->
        <div class="panel chart-panel-new">
          <div class="chart-panel-head">
            <h3>Vendas por Produto</h3>
            <span class="muted font-small">Total</span>
          </div>
          <div class="product-sales-list">
            ${topProducts.map(p => {
              const widthPct = Math.round((p.total / maxProductTotal) * 100);
              const avatar = p.name === "Outros" ? "🎨" : "🔑";
              return `
                <div class="product-sale-row">
                  <span class="product-sale-icon">${avatar}</span>
                  <div class="product-sale-details">
                    <span class="product-sale-name">${p.name}</span>
                    <div class="product-sale-bar-wrap">
                      <div class="product-sale-bar-fill" style="width: ${widthPct}%"></div>
                    </div>
                  </div>
                  <span class="product-sale-total">${p.total}</span>
                </div>
              `;
            }).join("") || `<p class="muted text-center" style="padding: 24px;">Sem vendas no período.</p>`}
          </div>
        </div>

        <!-- Faturamento por Dia da Semana -->
        <div class="panel chart-panel-new">
          <div class="chart-panel-head">
            <h3>Faturamento por Dia da Semana</h3>
          </div>
          <div class="week-days-bars-layout">
            ${weekdayOrdered.map(w => {
              const barHeight = Math.round((w.value / maxWeekdayVal) * 100);
              return `
                <div class="week-bar-col">
                  <div class="week-bar-tooltip">${money(w.value).replace(",00", "")}</div>
                  <div class="week-bar-container">
                    <div class="week-bar-fill" style="height: ${Math.max(barHeight, 4)}%"></div>
                  </div>
                  <span class="week-bar-label">${w.label}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Top Clientes -->
        <div class="panel chart-panel-new">
          <div class="chart-panel-head">
            <h3>Top Clientes</h3>
            <span class="muted font-small">Total</span>
          </div>
          <div class="top-clients-list">
            ${topClients.map((c, index) => {
              const color = clientColors[index % clientColors.length];
              return `
                <div class="top-client-row">
                  <span class="top-client-avatar" style="background-color: ${color}">${getClientInitial(c.name)}</span>
                  <span class="top-client-name">${c.name}</span>
                  <span class="top-client-amount">${money(c.total)}</span>
                </div>
              `;
            }).join("") || `<p class="muted text-center" style="padding: 24px;">Sem clientes no período.</p>`}
          </div>
        </div>
      </div>

      <!-- Center Status Line -->
      <div class="reports-footer-line">
        <span>❤️ Relatórios atualizados em tempo real.</span>
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
  const workflowStatus = getOrderWorkflowStatus(order);
  const selectedProduct = state.products.find((item) => item.name === order.product);
  const petList = petNamesForOrder(order);
  const petLabel = petList[0] || order.petName || petNameFromClient(order.client);
  const itemList = Array.from({ length: Math.max(Number(order.quantity || 1), 1) }, (_, index) => {
    return petList[index] || `${petLabel} ${index + 1}`;
  });
  const producedFlag = order.productionDone ? "Sim" : "Nao";
  const paintedFlag = order.paintDone ? "Sim" : "Nao";
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
          ${assetPreview(order.keychainMockup, "3D", order.keychainMockupName)}
          <input type="file" accept=".3mf,image/*" data-asset="${order.id}" data-field="keychainMockup">
          <small class="muted">Aceita imagens ou arquivo 3MF do modelo 3D.</small>
        </div>
      </div>
      <div class="grid content-grid">
        <div class="panel inset">
          <h3>Detalhes completos</h3>
          ${state.detailEditMode ? `
            <div class="detail-edit-form">
              <label>
                Nome do pet
                <input id="detailPetName" value="${escapeHtml(order.petName || "")}" placeholder="Nome do pet" />
              </label>
              <label class="wide">
                Nomes dos pets
                <textarea id="detailPetNames" rows="3" placeholder="Um nome por linha ou separado por vírgula">${escapeHtml((order.petNames || []).join(", ") || order.petName || "")}</textarea>
              </label>
              <label>
                Cliente
                <input id="detailClient" value="${escapeHtml(order.client)}" />
              </label>
              <label>
                WhatsApp
                <input id="detailWhatsapp" value="${escapeHtml(order.whatsapp || "")}" placeholder="(11) 99999-9999" />
              </label>
              <label>
                Produto
                <select id="detailProduct">
                  ${state.products.map((product) => `<option value="${escapeHtml(product.name)}" ${product.name === order.product ? "selected" : ""}>${escapeHtml(product.name)}</option>`).join("")}
                </select>
              </label>
              <label>
                Quantidade
                <input id="detailQuantity" type="number" min="1" value="${order.quantity}" />
              </label>
              <label>
                Frete
                <input id="detailShipping" type="number" min="0" step="0.01" value="${order.shipping}" />
              </label>
              <label>
                Pagamento
                <select id="detailPayment">
                  ${["Pix", "Cartao", "Boleto", "Dinheiro"].map((payment) => `<option ${payment === order.payment ? "selected" : ""}>${payment}</option>`).join("")}
                </select>
              </label>
              <label>
                Data do Pedido
                <input id="detailDate" type="date" value="${order.date}" />
              </label>
              <label>
                Entregue Em
                <input id="detailActualDelivery" type="date" value="${order.actualDelivery || ""}" />
              </label>
              <label>
                Rastreio
                <input id="detailTracking" value="${escapeHtml(order.tracking || "")}" placeholder="BR000000000BR" />
              </label>
              <label>
                Status do pedido
                <select id="detailWorkflowStatus">
                  ${ORDER_STATUSES.map((status) => `<option value="${status}" ${status === workflowStatus ? "selected" : ""}>${status}</option>`).join("")}
                </select>
              </label>
              <label>
                Prioridade
                <select id="detailPriority">
                  ${["Alta", "Média", "Baixa"].map((priority) => `<option ${priority === order.priority ? "selected" : ""}>${priority}</option>`).join("")}
                </select>
              </label>
              <div class="quick-actions wrap">
                <button class="primary-button" type="button" data-save-detail-info="${order.id}">Salvar informações</button>
                <button class="ghost-button" type="button" data-cancel-detail-edit>Cancelar</button>
              </div>
            </div>
          ` : `
            <div class="detail-list">
              ${detailLine("Nome do pet", petLabel)}
              ${petList.length > 1 ? detailLine("Nomes dos pets", petList.join(", ")) : ""}
              ${detailLine("Status do pedido", workflowStatus)}
              ${detailLine("WhatsApp", order.whatsapp || "Nao cadastrado")}
              ${detailLine("Produto", order.product)}
              ${detailLine("Quantidade", order.quantity)}
              ${order.quantity > 1 ? detailLine("Itens do pedido", itemList.join(", ")) : ""}
              ${detailLine("Produção", producedFlag)}
              ${detailLine("Pintura", paintedFlag)}
              ${detailLine("Total com frete", money(order.totalWithShipping))}
              ${detailLine("Pagamento", order.payment)}
              ${detailLine("Data do Pedido", order.date ? formatDate(order.date) : "Sem data")}
              ${order.actualDelivery ? detailLine("Entregue Em", formatDate(order.actualDelivery)) : ""}
              ${detailLine("Material", `${order.material}g`)}
              ${detailLine("Tempo de producao", `${order.productionTime}h`)}
            </div>
            <div class="quick-actions">
              <button class="primary-button" type="button" data-toggle-detail-edit>Editar informações</button>
              <button class="ghost-button" type="button" data-copy="${order.tracking}">Copiar rastreio</button>
              <button class="ghost-button" type="button" data-print="${order.id}">Imprimir pedido</button>
              <button class="mini-button danger-button" type="button" data-delete-order="${order.id}">Excluir pedido</button>
            </div>
          `}
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

function assetPreview(src, fallback, filename = "") {
  if (!src) return `<div class="asset-preview empty">${fallback}</div>`;
  const is3mf = String(filename || "").toLowerCase().endsWith(".3mf");
  if (is3mf) {
    return `
      <div class="asset-preview file-preview">
        <strong>${fallback}</strong>
        <span>${escapeHtml(filename || "arquivo.3mf")}</span>
      </div>
    `;
  }
  return `<div class="asset-preview" style="background-image:url('${src}')"></div>`;
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

function getOrderWorkflowStatus(order) {
  const explicit = String(order?.orderStatus || "").trim();
  if (ORDER_STATUSES.includes(explicit)) return explicit;

  const raw = String(order?.status || "").trim();
  if (!raw) return "Novo Pedido";

  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("entreg")) return "Entregue";
  if (normalized.includes("enviad")) return "Enviado";
  if (
    normalized.includes("postag") ||
    normalized.includes("pronto para envio") ||
    normalized.includes("embal") ||
    normalized.includes("expedi") ||
    normalized.includes("saida")
  ) {
    return "Postagem";
  }
  if (
    normalized.includes("novo") ||
    normalized.includes("receb") ||
    normalized.includes("pend")
  ) {
    return "Novo Pedido";
  }
  return "Produção";
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
  if (!order || getOrderWorkflowStatus(order) === status) return;
  order.orderStatus = status;
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
    const kanbanCard = event.target.closest(".kanban-card") || event.target.closest(".kanban-card-new") || event.target.closest(".kanban-group-card");
    if (kanbanCard && !event.target.closest("button") && !event.target.closest("select") && !event.target.closest("input")) {
      openDetails(kanbanCard.dataset.order);
      return;
    }
    const target = event.target.closest("button");
    if (!target) return;
    if (target.id === "exportReportBtn") {
      const { start, end } = getReportDates(state.reportPeriod);
      const filtered = getOrdersInPeriod(start, end, state.reportProduct);
      const headers = ["ID", "Cliente", "Produto", "Quantidade", "Faturamento", "Frete", "Data", "Status"];
      const rows = filtered.map(o => [
        o.id,
        o.client,
        o.product,
        o.quantity,
        o.totalSale.toFixed(2),
        o.shipping.toFixed(2),
        o.date,
        o.status
      ]);
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `relatorio-${state.reportPeriod}-${state.reportProduct}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    if (target.dataset.deleteStatus) {
      const statusToDelete = target.dataset.deleteStatus;
      const count = state.orders.filter(o => o.status === statusToDelete).length;
      let confirmMsg = `Excluir a coluna "${statusToDelete}"?`;
      if (count > 0) {
        const nextTarget = state.productionStatuses.find(s => s !== statusToDelete) || 'Recebido';
        confirmMsg += ` Os ${count} pedidos nesta coluna serão movidos para a coluna ativa "${nextTarget}".`;
      }
      if (window.confirm(confirmMsg)) {
        if (count > 0) {
          const targetStatus = state.productionStatuses.find(s => s !== statusToDelete) || "Recebido";
          state.orders.forEach(o => {
            if (o.status === statusToDelete) {
              o.status = targetStatus;
              o.history.unshift({ at: formatDateTime(new Date()), text: `Status movido para ${targetStatus} devido à exclusão da coluna ${statusToDelete}` });
            }
          });
          save();
        }
        state.productionStatuses = state.productionStatuses.filter(s => s !== statusToDelete);
        saveProductionStatuses();
        render();
      }
      return;
    }
    if (target.id === "addColBtn") {
      const newCol = window.prompt("Digite o nome da nova coluna de produção:");
      if (newCol && newCol.trim()) {
        const colName = newCol.trim();
        if (state.productionStatuses.includes(colName)) {
          window.alert("Esta coluna já existe!");
        } else {
          state.productionStatuses.push(colName);
          saveProductionStatuses();
          render();
        }
      }
      return;
    }
    if (target.dataset.view) {
      setView(target.dataset.view);
      render();
    }
    if (target.dataset.openOrder !== undefined) document.getElementById("orderModal").showModal();
    if (target.dataset.detail) openDetails(target.dataset.detail);
    if (target.dataset.toggleDetailEdit !== undefined) {
      state.detailEditMode = true;
      if (state.selectedOrder) openDetails(state.selectedOrder);
    }
    if (target.dataset.cancelDetailEdit !== undefined) {
      state.detailEditMode = false;
      if (state.selectedOrder) openDetails(state.selectedOrder);
    }
    if (target.dataset.saveDetailInfo) {
      const order = state.orders.find((item) => item.id === target.dataset.saveDetailInfo);
      if (!order) return;
      const productName = String(document.getElementById("detailProduct")?.value || order.product);
      const product = state.products.find((item) => item.name === productName);
      order.petName = String(document.getElementById("detailPetName")?.value || "").trim();
      order.petNames = normalizePetNames(document.getElementById("detailPetNames")?.value || "", order.quantity, order.petName || petNameFromClient(order.client));
      order.client = String(document.getElementById("detailClient")?.value || "").trim() || order.client;
      order.whatsapp = String(document.getElementById("detailWhatsapp")?.value || "").trim();
      order.product = productName;
      order.quantity = Number(document.getElementById("detailQuantity")?.value || order.quantity || 1);
      order.shipping = Number(document.getElementById("detailShipping")?.value || order.shipping || 0);
      order.payment = String(document.getElementById("detailPayment")?.value || order.payment);
      order.date = String(document.getElementById("detailDate")?.value || order.date);
      order.delivery = String(document.getElementById("detailDelivery")?.value || order.delivery);
      order.tracking = String(document.getElementById("detailTracking")?.value || "").trim();
      order.orderStatus = String(document.getElementById("detailWorkflowStatus")?.value || getOrderWorkflowStatus(order));
      order.priority = String(document.getElementById("detailPriority")?.value || order.priority || "Média");
      if (product) order.unitValue = product.unitValue;
      refreshOrderTotals(order);
      order.history.unshift({ at: formatDateTime(new Date()), text: "Informações do pedido atualizadas" });
      save();
      state.detailEditMode = false;
      openDetails(order.id);
    }
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
    if (target.dataset.toggleProductionGroup) {
      const key = target.dataset.toggleProductionGroup;
      state.expandedProductionGroups[key] = !state.expandedProductionGroups[key];
      renderProduction();
    }
    if (target.dataset.deleteOrder) deleteOrder(target.dataset.deleteOrder);
    if (target.dataset.deleteExpense) deleteExpense(target.dataset.deleteExpense);
    if (target.dataset.deleteProductIndex !== undefined) {
      const idx = Number(target.dataset.deleteProductIndex);
      const confirmed = window.confirm(`Excluir o produto "${state.products[idx].name}"?`);
      if (confirmed) {
        if (state.productEditorIndex === idx) {
          state.productEditorIndex = null;
        } else if (state.productEditorIndex !== null && state.productEditorIndex > idx) {
          state.productEditorIndex -= 1;
        }
        state.products.splice(idx, 1);
        saveProducts();
        render();
        hydrateForm();
      }
    }
    if (target.dataset.startProductEdit !== undefined) startProductEdit(Number(target.dataset.startProductEdit));
    if (target.dataset.cancelProductEdit !== undefined) cancelProductEdit();
    if (target.dataset.copy !== undefined) navigator.clipboard?.writeText(target.dataset.copy || "Rastreio pendente");
    if (target.dataset.closeDetail !== undefined) document.getElementById("detailModal").close();
    if (target.dataset.closeDetail !== undefined) state.detailEditMode = false;
    if (target.dataset.saveNotes) {
      const order = state.orders.find((item) => item.id === target.dataset.saveNotes);
      order.notes = document.getElementById("detailNotes").value;
      order.history.unshift({ at: formatDateTime(new Date()), text: "Observacoes atualizadas" });
      save();
      openDetails(order.id);
    }
  });

  document.body.addEventListener("input", (event) => {
    if (event.target.id === "shippingSearch") {
      state.shippingSearch = event.target.value;
      renderShipping();
    }
    if (event.target.dataset.shippingTracking) {
      const order = state.orders.find(o => o.id === event.target.dataset.shippingTracking);
      if (order) {
        order.tracking = event.target.value;
        save();
      }
    }
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
    if (event.target.id === "productionDateSort") {
      state.productionDateSort = event.target.value;
      renderProduction();
    }
    if (event.target.id === "productionPriorityFilter") {
      state.productionPriorityFilter = event.target.value;
      renderProduction();
    }
    if (event.target.id === "reportPeriodSelect") {
      state.reportPeriod = event.target.value;
      renderReports();
    }
    if (event.target.id === "reportCompareSelect") {
      state.reportCompare = event.target.value;
      renderReports();
    }
    if (event.target.id === "reportProductSelect") {
      state.reportProduct = event.target.value;
      renderReports();
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
    if (event.target.dataset.productionStep && event.target.dataset.productionOrder) {
      const order = state.orders.find((item) => item.id === event.target.dataset.productionOrder);
      if (!order) return;
      const status = event.target.dataset.productionStep;
      const step = getProductionStepInfo(status);
      if (!step) return;
      const index = Number(event.target.dataset.productionIndex);
      const petNames = petNamesForOrder(order);
      const currentFlags = Array.isArray(order[step.key]) ? order[step.key] : Array.from({ length: petNames.length }, () => false);
      currentFlags[index] = !!event.target.checked;
      order[step.key] = currentFlags;
      const petName = petNames[index] || `Pet ${index + 1}`;
      order.history.unshift({ at: formatDateTime(new Date()), text: `${step.label} marcado para ${petName} na etapa ${status}` });
      save();
      const groupOrders = state.orders.filter((item) => normalizeClientKey(item.client) === normalizeClientKey(order.client) && item.status === status);
      advanceClientGroupIfComplete(groupOrders, status);
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
    if (event.target.dataset.asset) {
      const order = state.orders.find((item) => item.id === event.target.dataset.asset);
      const file = event.target.files[0];
      if (!file) return;
      order[event.target.dataset.field] = await fileToDataUrl(file);
      order[`${event.target.dataset.field}Name`] = file.name;
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
    const card = event.target.closest(".kanban-card") || event.target.closest(".kanban-card-new") || event.target.closest(".kanban-group-card");
    if (!card) return;
    const payload = {
      type: card.dataset.groupKey ? "group" : "order",
      orderId: card.dataset.order,
      groupKey: card.dataset.groupKey || "",
      status: card.dataset.status || ""
    };
    event.dataTransfer.setData("text/plain", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "move";
  });

  document.body.addEventListener("dragover", (event) => {
    const board = event.target.closest(".kanban-column-body") || event.target.closest(".kanban-column-body-new");
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
    const board = event.target.closest(".kanban-column-body") || event.target.closest(".kanban-column-body-new");
    if (board) {
      board.classList.remove("drag-over");
      return;
    }
    if (event.target.closest("#uploadZone")) {
      event.preventDefault();
      event.target.closest("#uploadZone").classList.remove("dragging");
    }
  });

  document.body.addEventListener("drop", async (event) => {
    const board = event.target.closest(".kanban-column-body") || event.target.closest(".kanban-column-body-new");
    if (board) {
      event.preventDefault();
      board.classList.remove("drag-over");
      const status = board.dataset.status;
      let payload = null;
      try { payload = JSON.parse(event.dataTransfer.getData("text/plain") || "{}"); } catch {}
      if (!payload || !status) return;
      if (payload.type === "group") {
        const sourceOrders = state.orders.filter((item) => normalizeClientKey(item.client) === payload.groupKey && item.status === payload.status);
        if (!sourceOrders.length || payload.status === status) return;
        sourceOrders.forEach((order) => {
          order.status = status;
          if (status === "Entregue" && !order.actualDelivery) order.actualDelivery = new Date().toISOString().slice(0, 10);
          order.history.unshift({ at: formatDateTime(new Date()), text: `Grupo movido para ${status} via quadro` });
        });
        save();
        renderProduction();
        if (typeof renderShipping === "function") renderShipping();
        renderOrders();
      } else if (payload.orderId) {
        const order = state.orders.find((item) => item.id === payload.orderId);
        if (order && status && order.status !== status) {
          order.status = status;
          if (status === "Entregue" && !order.actualDelivery) order.actualDelivery = new Date().toISOString().slice(0, 10);
          order.history.unshift({ at: formatDateTime(new Date()), text: `Status movido para ${status} via quadro` });
          save();
          renderProduction();
          if (typeof renderShipping === "function") renderShipping();
          renderOrders();
        }
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
    const shippingExpense = state.expenses.find((expense) => expense.id === data.shippingExpenseId && expense.category === "Frete");
    const shippingVal = shippingExpense ? Number(shippingExpense.amount || 0) : 0;
    const initialStatus = state.productionStatuses[0] || "Recebido";
    const order = makeOrder(data.client, data.whatsapp, data.product, Number(data.quantity), product.unitValue, shippingVal, data.payment, 0, 5, initialStatus, data.tracking, product.name.includes("Combo") ? 4.8 : 3.2, product.name.includes("Combo") ? 38 : 22, data.notes);
    order.date = data.date || "";
    order.actualDelivery = "";
    order.shippingExpenseId = shippingExpense ? shippingExpense.id : "";
    order.shippingExpenseName = shippingExpense ? shippingExpense.name : "";
    order.shippingExcludedFromReport = true;
    order.petName = String(data.petName || "").trim();
    order.petNames = normalizePetNames(data.petNames || data.petName, Number(data.quantity || 1), order.petName || petNameFromClient(data.client));
    order.orderStatus = "Novo Pedido";
    order.petPhoto = form.photo.files[0] ? await fileToDataUrl(form.photo.files[0]) : "";
    state.orders.unshift(order);
    save();
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
      const name = String(data.name || "").trim();
      const productIndex = data.productIndex !== "" ? Number(data.productIndex) : null;
      if (!name) {
        window.alert("Informe o nome do produto.");
        return;
      }
      if (state.products.some((product, index) => index !== productIndex && product.name.trim().toLowerCase() === name.toLowerCase())) {
        window.alert("Já existe um produto com esse nome.");
        return;
      }
      const nextProduct = {
        name,
        unitValue: Number(data.unitValue || 0),
        cost: Number(data.cost || 0)
      };
      if (Number.isInteger(productIndex) && state.products[productIndex]) {
        const previousName = state.products[productIndex].name;
        state.products[productIndex] = nextProduct;
        if (previousName !== nextProduct.name) {
          state.orders.forEach((order) => {
            if (order.product === previousName) order.product = nextProduct.name;
          });
          if (state.reportProduct === previousName) state.reportProduct = nextProduct.name;
          save();
        }
      } else {
        state.products.push(nextProduct);
      }
      saveProducts();
      state.productEditorIndex = null;
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
  const shippingSelect = document.querySelector("[name='shippingExpenseId']");
  if (shippingSelect) {
    const shippingExpenses = state.expenses
      .filter((expense) => expense.category === "Frete")
      .slice()
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    shippingSelect.innerHTML = [`<option value="">Selecione uma despesa de frete</option>`]
      .concat(
        shippingExpenses.map((expense) => {
          const label = `${expense.name} - ${money(expense.amount)}${expense.date ? ` (${formatDate(expense.date)})` : ""}`;
          return `<option value="${expense.id}" data-shipping-amount="${expense.amount}">${escapeHtml(label)}</option>`;
        })
      )
      .join("");
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

function renderShipping() {
  state.shippingSearch = state.shippingSearch || "";
  state.shippingStatuses = state.shippingStatuses || ["Pronto", "Postagem", "Enviado", "Entregue"];

  const term = String(state.shippingSearch || "").trim().toLowerCase();
  let list = state.orders.filter((order) => state.shippingStatuses.includes(order.status));
  
  if (term) {
    list = list.filter((order) => {
      const petName = order.petName || (order.client || "").split(" ")[0] || "";
      return `${order.id} ${order.client} ${order.product} ${petName} ${order.tracking}`.toLowerCase().includes(term);
    });
  }

  list.sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));

  const grouped = state.shippingStatuses.reduce((acc, status) => ({ ...acc, [status]: [] }), {});
  list.forEach((order) => {
    if (!grouped[order.status]) grouped[order.status] = [];
    grouped[order.status].push(order);
  });

  const headerColors = [
    { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },  // Pronto - green
    { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },  // Postagem - amber
    { bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe' },  // Enviado - indigo
    { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' }   // Entregue - blue
  ];

  document.getElementById("shippingView").innerHTML = `
    <div class="panel production-panel">
      <div class="production-header-section">
        <div class="title-area">
          <h2>Controle de Envio</h2>
          <p class="muted">Acompanhe a logística e os despachos dos pedidos concluídos. 📦</p>
        </div>
        <div class="production-toolbar-new">
          <div class="search-wrap">
            <span class="search-icon-new">🔍</span>
            <input id="shippingSearch" class="search-input-new" placeholder="Buscar envio..." value="${escapeHtml(state.shippingSearch)}" />
          </div>
        </div>
      </div>

      <div class="kanban-board-new">
        ${state.shippingStatuses.map((status, index) => {
          const items = grouped[status] || [];
          const color = headerColors[index % headerColors.length];
          return `
            <section class="kanban-column-new">
              <div class="kanban-column-head-new" style="background-color: ${color.bg}; color: ${color.text}; border-bottom: 2px solid ${color.border}">
                <div class="column-title-wrap">
                  <span class="column-index">${index + 1}.</span>
                  <h3 class="column-name">${status.toUpperCase()}</h3>
                </div>
                <span class="column-count-badge">${items.length}</span>
              </div>
              <div class="kanban-column-body-new" data-status="${status}">
                ${items.map(order => {
                  const petName = order.petName || (order.client || "").split(" ")[0] || "-";
                  const photoStyle = order.petPhoto ? `style="background-image:url('${order.petPhoto}')"` : "";
                  return `
                    <article class="kanban-group-card" draggable="true" data-order="${order.id}" data-status="${status}">
                      <div class="kanban-group-primary" style="padding-top:12px;">
                        <div class="kanban-card-keychain-container">
                          <div class="keychain-link-ring"></div>
                          <div class="keychain-link-chain"></div>
                          <div class="kanban-card-photo" ${photoStyle}></div>
                        </div>
                        <div class="kanban-card-info-wrap" style="width: 100%;">
                          <div class="kanban-card-top-row">
                            <span class="kanban-card-id">#${order.id.split("-").pop() || order.id}</span>
                            <button class="kanban-card-menu-btn" data-detail="${order.id}" type="button">⋮</button>
                          </div>
                          <h4 class="kanban-card-pet-name">${escapeHtml(petName)}</h4>
                          <p class="kanban-card-breed">${escapeHtml(order.client)}</p>
                          <div class="kanban-card-meta-new" style="margin-top:8px;">
                            <input class="cell-input tracking-input" style="width:100%;font-size:0.8rem;padding:4px;" placeholder="Código de rastreio" data-shipping-tracking="${order.id}" value="${escapeHtml(order.tracking || '')}" />
                          </div>
                        </div>
                      </div>
                    </article>
                  `;
                }).join("")}
              </div>
            </section>
          `;
        }).join("")}
      </div>
    </div>
  `;
}
