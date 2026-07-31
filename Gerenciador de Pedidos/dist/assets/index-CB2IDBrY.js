(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const Lt=["Novo Pedido","Em Producao","Criação do 3D","Fila Impressão","Imprimindo 3D","Pintura","Ornamentos","Pronto para Foto","Embalagem","Pronto para Envio","Enviado","Entregue","Cancelado"],xt=["Clientes","Produto","Quantidade","Valor por Unidade","Total Venda","Frete SP","Total com Frete","Forma de Pagamento","Data","Entrega","Codigo de Rastreio","Status","Tempo de Producao","Quantidade de Material Utilizado"],ut=["Novo Pedido","Produção","Postagem","Enviado","Entregue"],Ht=[{name:"Chaveiro pet cartoon",unitValue:69.9,cost:22.4},{name:"Chaveiro pet premium",unitValue:89.9,cost:31.8},{name:"Combo 2 chaveiros",unitValue:129.9,cost:44.2},{name:"Chaveiro + arte digital",unitValue:109.9,cost:36.6}],Dt=["Equipamento","Material","Frete","Anuncios","Embalagem","Energia","Outros"],U=new Date,Et=6,oe=["Recebido","Em Produção","Pintura","Pronto"],se=["Pronto","Postagem","Enviado","Entregue"],a={orders:[],expenses:J("expenses_v1",wt()),products:J("products_v1",Ht),productionStatuses:J("production_statuses_v1",oe),shippingStatuses:J("shipping_statuses_v1",se),reportPeriod:"30d",reportCompare:"anterior",reportProduct:"Todos",query:"",statusFilter:"Todos",sortKey:"date",sortDirection:"desc",page:1,selectedOrder:null,detailEditMode:!1,expandedProductionGroups:{},compactCards:J("orders_compact_layout",!1),productEditorIndex:null,importRows:[],importFileName:"",importSummary:"",shippingRates:J("shipping_rates",{SP:14.9})};a.viewMode=J("orders_view_mode",a.compactCards?"cards":"list");a.compactCards=a.viewMode==="cards";Array.isArray(a.orders)||(a.orders=[]);Array.isArray(a.expenses)||(a.expenses=wt());function wt(){return[{id:"EXP-001",name:"Custo equipamento mensal",category:"Equipamento",amount:320,date:G(-2),notes:"Parcela/depreciacao da impressora 3D"},{id:"EXP-002",name:"Filamento PLA/PETG",category:"Material",amount:480,date:G(-1),notes:"Reposicao de material para chaveiros"},{id:"EXP-003",name:"Fretes e etiquetas",category:"Frete",amount:210,date:G(-4),notes:"Custos nao repassados ao cliente"},{id:"EXP-004",name:"Anuncios Instagram",category:"Anuncios",amount:350,date:G(-6),notes:"Campanha mensal de criativos pet"},{id:"EXP-005",name:"Embalagens premium",category:"Embalagem",amount:160,date:G(-3),notes:"Saquinhos, tags e caixas"},{id:"EXP-006",name:"Energia da producao",category:"Energia",amount:95,date:G(-5),notes:"Estimativa mensal"}]}function ct(){return[X("Luna Maria","(11) 98765-4321","Chaveiro pet premium",1,89.9,14.9,"Pix",-2,4,"Arte Gerada","BR987654321BR",3.5,24,"Cachorrinha caramelo com lacinho vermelho.","Alta","Luna"),X("Thor Almeida","(11) 97654-3210","Combo 2 chaveiros",2,129.9,18.5,"Cartao",-8,-1,"Enviado","BR123456789BR",5.2,44,"Dois mockups: um preto e um amarelo suave.","Média","Thor"),X("Mel Costa","(11) 96543-2109","Chaveiro pet cartoon",1,69.9,12.9,"Pix",0,5,"Recebido","",2.4,18,"Cliente enviou foto frontal.","Baixa","Mel"),X("Bob Ferreira","(11) 95432-1098","Chaveiro + arte digital",1,109.9,15.5,"Boleto",-15,-6,"Pronto para Envio","BR456789123BR",4.3,26,"Arte aprovada com fundo creme.","Média","Bob"),X("Nina Rocha","(11) 94321-0987","Chaveiro pet premium",1,89.9,13.9,"Pix",-1,3,"Finalização","",3.8,25,"Aguardando etiqueta de envio.","Alta","Nina"),X("Amora Lima","(11) 93210-9876","Chaveiro pet cartoon",2,69.9,16.9,"Cartao",-4,2,"Pintura","",4.8,36,"Pedido com dois pets na mesma embalagem.","Média","Amora"),X("Tobias Nunes","(11) 92109-8765","Chaveiro pet premium",1,89.9,11.9,"Pix",-30,-22,"Cancelado","",0,0,"Cancelado antes da arte.","Baixa","Tobias"),X("Pipoca Martins","(11) 91098-7654","Chaveiro + arte digital",1,109.9,19.9,"Cartao",-11,-3,"Montagem","BR654321987BR",4.1,27,"Cliente pediu arte em alta para imprimir.","Alta","Pipoca")]}function X(t,e,n,s,r,o,i,d,l,c,m,p,f,k,w="Média",N=""){const h=G(d),S=G(l),y=s*r;return{id:ne(h),client:t,whatsapp:e||"",product:n,quantity:s,unitValue:r,totalSale:y,shipping:o,totalWithShipping:y+o,payment:i,date:h,delivery:S,tracking:m,status:c,productionTime:p,material:f,notes:k,priority:w,petName:N,petPhoto:"",generatedArt:"",keychainMockup:"",history:[{at:q(new Date),text:`Pedido criado com status ${c}`}]}}function G(t){const e=new Date(U);return e.setDate(e.getDate()+t),e.toISOString().slice(0,10)}function ne(t=new Date().toISOString()){const e=String(t).replaceAll("-","").slice(2,8),n=Math.floor(100+Math.random()*899);return`MPA-${e}-${n}`}function ie(){const t=a.expenses.map(e=>Number(String(e.id).replace(/\D/g,""))).filter(Boolean);return`EXP-${String(Math.max(0,...t)+1).padStart(3,"0")}`}const vt={db:null,async init(){return new Promise((t,e)=>{const n=indexedDB.open("mpa_db",1);n.onupgradeneeded=s=>{s.target.result.createObjectStore("keyval")},n.onsuccess=s=>{this.db=s.target.result,t()},n.onerror=()=>e(n.error)})},async get(t){return this.db||await this.init(),new Promise((e,n)=>{const o=this.db.transaction("keyval","readonly").objectStore("keyval").get(t);o.onsuccess=()=>e(o.result),o.onerror=()=>n(o.error)})},async set(t,e){return this.db||await this.init(),new Promise((n,s)=>{const i=this.db.transaction("keyval","readwrite").objectStore("keyval").put(e,t);i.onsuccess=()=>n(),i.onerror=()=>s(i.error)})}};function J(t,e){try{return JSON.parse(localStorage.getItem(`mpa:${t}`))||e}catch{return e}}function R(){try{vt.set("orders_v2",a.orders).catch(t=>{console.error("Erro ao salvar no IndexedDB:",t),alert("Erro ao salvar no banco de dados. "+t.message)}),St()}catch(t){t.name==="QuotaExceededError"&&(alert("Ops! O armazenamento do navegador estourou (limite de fotos/dados atingido). Seu pedido não pôde ser salvo. Limpe ou faça backup de pedidos antigos para liberar espaço!"),console.error(t))}}function yt(){localStorage.setItem("mpa:expenses_v1",JSON.stringify(a.expenses)),St()}function jt(){localStorage.setItem("mpa:products_v1",JSON.stringify(a.products)),St()}function Vt(){localStorage.setItem("mpa:shipping_rates",JSON.stringify(a.shippingRates||{})),St()}function St(){try{const t={app:"Meu Pet em Arte",version:1,createdAt:new Date().toISOString(),orders:a.orders,expenses:a.expenses,products:a.products,importBatches:J("import_batches",[]),theme:localStorage.getItem("mpa:theme_v2")||"light"};localStorage.setItem("mpa:auto_backup",JSON.stringify(t)),localStorage.setItem("mpa:auto_backup_time",new Date().toLocaleString("pt-BR"))}catch(t){console.error("Erro ao gerar backup automático",t)}}function re(){try{const t=localStorage.getItem("mpa:auto_backup");if(!t)throw new Error("Nenhum backup automático encontrado.");const e=JSON.parse(t);if(!window.confirm(`Restaurar o último backup automático feito em ${localStorage.getItem("mpa:auto_backup_time")}? Os dados atuais serão substituídos.`))return;a.orders=e.orders||[],a.expenses=e.expenses||[],a.products=e.products||Ht,a.importRows=[],a.importFileName="",a.importSummary="",a.query="",a.statusFilter="Todos",a.page=1,localStorage.setItem("mpa:orders_v2",JSON.stringify(a.orders)),localStorage.setItem("mpa:expenses_v1",JSON.stringify(a.expenses)),localStorage.setItem("mpa:products_v1",JSON.stringify(a.products)),localStorage.setItem("mpa:import_batches",JSON.stringify(Array.isArray(e.importBatches)?e.importBatches:[])),e.theme&&localStorage.setItem("mpa:theme_v2",e.theme),document.body.classList.toggle("dark",e.theme==="dark"),F(),j("dashboard"),window.alert("Backup automático restaurado com sucesso!")}catch(t){window.alert(t.message)}}function de(t){const e=J("import_batches",[]);e.unshift(t),localStorage.setItem("mpa:import_batches",JSON.stringify(e.slice(0,20)))}function x(t){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(t||0))}function nt(t){return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(`${t}T12:00:00`))}function q(t){return new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(t)}function le(t){const e=a.products.find(r=>r.name===t.product),n=e?e.cost:t.unitValue*.36,s=t.material*.11;return n*t.quantity+s}function ce(t){return t.totalSale-le(t)}function pe(){a.statusFilter!=="Todos"&&!ut.includes(a.statusFilter)&&(a.statusFilter="Todos");const t=a.query.trim().toLowerCase(),e=a.orders.filter(n=>{const s=z(n),r=a.statusFilter==="Todos"||s===a.statusFilter,o=[n.id,n.client,n.product,n.payment,n.tracking,s].join(" ").toLowerCase();return r&&(!t||o.includes(t))});return e.sort((n,s)=>{const r=a.sortKey,o=n[r],i=s[r],d=a.sortDirection==="asc"?1:-1;return typeof o=="number"?(o-i)*d:String(o).localeCompare(String(i),"pt-BR")*d}),e}function Nt(){const t=U.toISOString().slice(0,7),e=U.toISOString().slice(0,4),n=a.orders.filter(h=>h.status!=="Cancelado"),s=a.orders.filter(h=>h.date&&h.date.startsWith(t)),r=n.filter(h=>h.date&&h.date.startsWith(t)),o=a.expenses.filter(h=>h.date&&h.date.startsWith(t)),i=r.reduce((h,S)=>h+S.totalWithShipping,0),d=n.filter(h=>h.date&&h.date.startsWith(e)).reduce((h,S)=>h+S.totalWithShipping,0),l=r.reduce((h,S)=>h+ce(S),0),c=r.reduce((h,S)=>h+Number(S.shipping||0),0),m=o.filter(h=>String(h.category||"").toLowerCase()==="frete").reduce((h,S)=>h+Number(S.amount||0),0),p=o.reduce((h,S)=>h+Number(S.amount||0),0),f=r.reduce((h,S)=>h+Number(S.productionTime||0),0),k=r.reduce((h,S)=>h+Number(S.quantity||0),0),w=i-p,N=i/Math.max(r.length,1);return{total:r.length,production:r.filter(h=>h.status==="Em Producao").length,sent:r.filter(h=>h.status==="Enviado").length,revenue:i,yearlyRevenue:d,shippingTotal:c,shippingExpenses:m,totalMachineTime:f,profit:l,expenses:p,profitAfterExpenses:w,ticketMedio:N,keychains:k,pets:s.length}}const ue={dashboard:()=>fe(),orders:()=>tt(),production:()=>Q(),shipping:()=>st(),products:()=>Ot(),expenses:()=>Pe(),finance:()=>De(),import:()=>Rt(),admin:()=>Me()};function me(){const t=document.getElementById("productionQueueSummary");if(!t)return;const e=a.orders.filter(d=>a.productionStatuses.includes(d.status)),n=a.shippingStatuses||["Pronto","Postagem","Enviado","Entregue"],s=a.orders.filter(d=>n.includes(d.status)&&d.status!=="Pronto"),r=e.length,o=s.length,i=a.productionStatuses.map(d=>{const l=a.orders.filter(c=>c.status===d).length;return{status:d,count:l}});t.innerHTML=`
    <span class="tiny-label">Fila de produção</span>
    <strong style="font-size:1.4rem; display:block; margin: 4px 0 10px;">${r} em produção</strong>
    <div style="display:grid; gap:5px; margin-bottom:10px;">
      ${i.map(({status:d,count:l})=>`
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem;">
          <span style="color:var(--muted); font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:110px;" title="${d}">${d}</span>
          <span style="background:var(--surface-solid); border:1px solid var(--line); border-radius:999px; padding:1px 9px; font-weight:900; font-size:0.78rem;">${l}</span>
        </div>
      `).join("")}
    </div>
    <div style="border-top:1px solid var(--line); padding-top:8px; display:flex; justify-content:space-between; align-items:center; font-size:0.8rem;">
      <span style="color:var(--muted); font-weight:700;">📦 Em envio</span>
      <span style="font-weight:900;">${o}</span>
    </div>
  `}function F(){Qt(),me(),$t(),Object.entries(ue).forEach(([t,e])=>{try{e()}catch(n){console.error(`render ${t} error`,n)}})}function Ot(){const t=a.products,e=Number.isInteger(a.productEditorIndex)&&t[a.productEditorIndex]?a.productEditorIndex:null;a.productEditorIndex!==e&&(a.productEditorIndex=e);const n=e!==null?t[e]:null,s=t.length?t.reduce((l,c)=>l+c.unitValue,0)/t.length:0,r=t.length?t.reduce((l,c)=>l+c.cost,0)/t.length:0,o=s>0?(s-r)/s*100:0,i=n?"Editar produto":"Adicionar novo produto",d=n?`Atualizando ${v(n.name)}. Nome, preço e custo podem ser alterados aqui.`:"Cadastre um novo item do catálogo para usar nos pedidos.";document.getElementById("productsView").innerHTML=`
    <div class="grid metric-grid">
      ${O("Produtos cadastrados",t.length,"Catálogo ativo")}
      ${O("Preço médio",x(s),"Venda unitária")}
      ${O("Custo médio",x(r),"Base de produção")}
      ${O("Margem média",o.toFixed(1)+"%","Lucro bruto estimado")}
    </div>

    <div class="grid content-grid">
      <form class="panel form-grid" id="productForm">
        <input type="hidden" name="productIndex" value="${e!==null?e:""}" />
        <div class="wide">
          <span class="eyebrow">Catálogo</span>
          <h2>${i}</h2>
          <p class="muted">${d}</p>
        </div>
        <label class="wide">Nome do Produto
          <input name="name" required placeholder="Ex: Chaveiro pet premium" autocomplete="off" value="${n?v(n.name):""}">
        </label>
        <label>Preço de Venda (R$)
          <input name="unitValue" required type="number" min="0" step="0.01" placeholder="0,00" value="${n?n.unitValue:""}">
        </label>
        <label>Custo Unitário Base (R$)
          <input name="cost" required type="number" min="0" step="0.01" placeholder="0,00" value="${n?n.cost:""}">
        </label>
        <div class="wide wrap">
          <button class="primary-button" type="submit">${n?"Salvar alterações":"Adicionar produto"}</button>
          ${n?'<button class="ghost-button" type="button" data-cancel-product-edit>Cancelar edição</button>':""}
        </div>
      </form>

      <div class="panel">
        <div class="section-head">
          <div>
            <h2>Produtos cadastrados</h2>
            <p class="muted">${t.length} produto${t.length!==1?"s":""} no catálogo</p>
          </div>
          <span class="status-pill status-finalizado">${n?"Editando item":"Cadastro rápido"}</span>
        </div>
        <div class="product-cards-grid">
          ${t.length?t.map((l,c)=>{const m=l.unitValue>0?(l.unitValue-l.cost)/l.unitValue*100:0,p=l.unitValue-l.cost;return`
            <div class="product-card">
              <div class="product-card-header">
                <div class="product-card-icon">${l.name.includes("Combo")?"📦":l.name.includes("arte")||l.name.includes("Arte")?"🎨":"🔑"}</div>
                <div class="product-card-info">
                  <strong>${v(l.name)}</strong>
                  <span class="product-card-margin ${m>=50?"margin-high":m>=30?"margin-mid":"margin-low"}">${m.toFixed(0)}% margem</span>
                </div>
                <div class="product-card-actions">
                  <button class="mini-button" type="button" data-start-product-edit="${c}">Editar</button>
                  <button class="mini-button danger-button" type="button" data-delete-product-index="${c}" title="Excluir produto">Excluir</button>
                </div>
              </div>
              <div class="product-card-body">
                <div class="product-card-field">
                  <small>Preço de venda</small>
                  <strong>${x(l.unitValue)}</strong>
                </div>
                <div class="product-card-field">
                  <small>Custo base</small>
                  <strong>${x(l.cost)}</strong>
                </div>
              </div>
              <div class="product-card-footer">
                <span>Lucro unit.: <strong>${x(p)}</strong></span>
                <span>Margem: <strong>${m.toFixed(1)}%</strong></span>
              </div>
            </div>`}).join(""):'<p class="muted" style="padding:24px;text-align:center">Nenhum produto cadastrado. Use o formulário ao lado para adicionar.</p>'}
        </div>
      </div>
    </div>
  `}function ge(t){a.products[t]&&(a.productEditorIndex=t,Ot(),j("products"))}function he(){a.productEditorIndex!==null&&(a.productEditorIndex=null,Ot())}function Qt(){const t=document.querySelector(".main");if(t&&!document.getElementById("expensesView")){const s=document.createElement("section");s.className="view",s.id="expensesView",s.dataset.title="Despesas";const r=document.getElementById("financeView");t.insertBefore(s,r||null)}const e=document.getElementById("sideNav");if(e&&!e.querySelector('[data-view="expenses"]')){const s=document.createElement("button");s.className="nav-item",s.dataset.view="expenses",s.type="button",s.textContent="Despesas";const r=e.querySelector('[data-view="reports"]');e.insertBefore(s,r||null)}const n=document.getElementById("mobileNav");if(n&&!n.querySelector('[data-view="expenses"]')){const s=document.createElement("button");s.className="mobile-item",s.dataset.view="expenses",s.type="button",s.textContent="Despesas";const r=n.querySelector('[data-view="reports"]');n.insertBefore(s,r||null)}}function j(t){Qt();const e=document.getElementById(`${t}View`)?t:"dashboard";a.currentView=e,document.querySelectorAll(".view").forEach(n=>n.classList.remove("active")),document.getElementById(`${e}View`).classList.add("active"),document.getElementById("viewTitle").textContent=document.getElementById(`${e}View`).dataset.title,document.querySelectorAll("[data-view]").forEach(n=>n.classList.toggle("active",n.dataset.view===e))}function fe(){const t=U.toISOString().slice(0,7),e=a.orders.filter(p=>p.status!=="Cancelado");e.filter(p=>p.date&&p.date.startsWith(t));const n=Array.isArray(a.productionStatuses)&&a.productionStatuses.length?a.productionStatuses:Lt,s=e.filter(p=>z(p)==="Novo Pedido").length,r=e.filter(p=>z(p)==="Produção").length,o=e.filter(p=>z(p)==="Postagem").length,i=e.filter(p=>{const f=p.history&&p.history.find(k=>k.text.toLowerCase().includes("enviado"));return z(p)==="Enviado"&&f&&f.at.startsWith(U.toISOString().slice(0,10).split("-").reverse().join("/"))}).length,d=e.filter(p=>$e(p)),l=e.slice(0,6),c=n.map(p=>{const f=e.filter(k=>k.status===p).length;return`<span class="status-pill ${mt(p)}">${p}<b>${f}</b></span>`}).join("");document.getElementById("dashboardView").innerHTML=`
    <section class="hero-panel panel" style="min-height: auto; padding: 20px;">
      <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
           <input type="text" id="dashboardSearch" placeholder="Buscar pedido, cliente, telefone..." style="flex:1; min-width:250px; padding: 12px; border-radius: 8px; border: none; font-size: 1rem; color: #1a1a1a;" />
           <button class="primary-button" data-open-order>Novo Pedido</button>
        </div>
        <div class="quick-actions" style="display:flex; gap:8px; flex-wrap: wrap;">
          <button class="ghost-button" data-view="orders" onclick="setTimeout(()=>document.querySelector('[data-sort=\\'status\\']')?.click(),100)">Gerar Etiqueta</button>
          <button class="ghost-button" data-view="expenses" onclick="setTimeout(()=>document.getElementById('newExpenseBtn')?.click(),100)">Adicionar Despesa</button>
          <button class="ghost-button" data-view="products" onclick="setTimeout(()=>document.getElementById('newProductBtn')?.click(),100)">Cadastrar Produto</button>
        </div>
      </div>
    </section>

    <div class="grid metric-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
      ${O("Novos Pedidos",s,"Aguardando início")}
      ${O("Em Produção",r,"No ateliê")}
      ${O("Prontos para Envio",o,"Aguardando coleta")}
      ${O("Enviados Hoje",i,"Despachados")}
    </div>

    <div class="grid content-grid" style="grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 24px; align-items: start;">
      
      <div style="display:flex; flex-direction: column; gap: 24px;">
        <div class="panel">
          <div class="section-head">
             <h3>Fila de Produção</h3>
             <button class="mini-button" data-view="production">Ir para o Kanban</button>
          </div>
          <div class="status-strip" style="flex-wrap: wrap;">${c}</div>
        </div>

        <div class="panel">
          <h3>Pedidos Recentes</h3>
          <div class="list" id="dashboardRecentOrdersList">
            ${ht(l)}
          </div>
        </div>
      </div>

      <div style="display:flex; flex-direction: column; gap: 24px;">
        
        ${d.length>0||o>0?`
        <div class="panel" style="border: 2px solid #ef4444; background: rgba(239,68,68,0.05);">
          <h3 style="color:#ef4444; display:flex; align-items:center; gap:8px;">⚠️ Alertas Importantes</h3>
          <ul style="margin-top:12px; padding-left:20px; color:#b91c1c;">
            ${d.length>0?`<li><strong>${d.length}</strong> pedidos atrasados!</li>`:""}
            ${o>0?`<li><strong>${o}</strong> pedidos prontos para envio.</li>`:""}
          </ul>
        </div>
        `:""}

        ${o>0?`
        <div class="panel">
          <h3>Prontos para Envio</h3>
          <div class="list" style="max-height: 400px; overflow-y: auto;">
            ${ht(e.filter(p=>z(p)==="Postagem"))}
          </div>
        </div>
        `:""}

      </div>

    </div>
  `;const m=document.getElementById("dashboardSearch");m&&m.addEventListener("input",p=>{const f=p.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");if(!f){document.getElementById("dashboardRecentOrdersList").innerHTML=ht(e.slice(0,6));return}const k=e.filter(w=>w.id.toLowerCase().includes(f)||w.client.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(f)||w.whatsapp&&w.whatsapp.replace(/\D/g,"").includes(f.replace(/\D/g,""))).slice(0,10);document.getElementById("dashboardRecentOrdersList").innerHTML=ht(k)})}function ht(t){return t.length?t.map(e=>{let n=`<div style="width:48px;height:48px;border-radius:12px;background:var(--surface);border:1px solid var(--line);display:grid;place-items:center;font-weight:900;font-size:16px;flex-shrink:0;">${Kt(e.client)}</div>`;return e.petPhoto&&(n=`<div style="width:48px;height:48px;border-radius:12px;background-image:url('${e.petPhoto}');background-size:cover;background-position:center;border:1px solid var(--line);flex-shrink:0;"></div>`),`
    <div class="soft-row" style="align-items:center; padding: 12px 14px; gap: 14px; flex-wrap: wrap;">
      <div style="display:flex; align-items:center; gap: 14px; flex: 1 1 200px;">
        ${n}
        <div style="display:flex; flex-direction:column; overflow:hidden;">
          <strong style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${v(e.client)} <span class="eyebrow" style="margin-left:6px">${e.id}</span></strong>
          <small style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:0.8; margin-top:2px;">${v(e.product)}</small>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap: 8px;">
        <span class="status-pill ${mt(e.status)}">${e.status}</span>
        ${e.whatsapp?`<a href="https://wa.me/55${e.whatsapp.replace(/\D/g,"")}" target="_blank" class="mini-button" title="WhatsApp">💬</a>`:""}
        <button class="mini-button" data-detail="${e.id}">Abrir</button>
      </div>
    </div>`}).join(""):'<p class="muted" style="padding:12px 0">Nenhum pedido encontrado.</p>'}function O(t,e,n){return`<article class="metric-card"><span>${t}</span><strong>${e}</strong><small>${n}</small></article>`}function _(t,e){const n=a.sortKey===t?a.sortDirection==="asc"?"up":"down":"";return`<th><button class="sort-button" data-sort="${t}">${e}<span>${n}</span></button></th>`}function tt(){const t=pe();try{console.debug("renderOrders: state.orders.length=",a.orders&&a.orders.length,"filtered.length=",t.length,a.viewMode)}catch(s){console.debug("renderOrders debug error",s)}const e=Math.max(Math.ceil(t.length/Et),1);a.page=Math.min(a.page,e);const n=t.slice((a.page-1)*Et,a.page*Et);document.getElementById("ordersView").innerHTML=`
    <div class="panel table-shell">
      <div class="table-toolbar">
        <input class="search-input" id="orderSearch" value="${v(a.query)}" placeholder="Buscar cliente, produto, rastreio ou status" />
        <select id="statusFilter">
          <option>Todos</option>
          ${ut.map(s=>`<option ${a.statusFilter===s?"selected":""}>${s}</option>`).join("")}
        </select>
        <button class="ghost-button" type="button" data-toggle-view title="${a.viewMode==="list"?"Exibir em cartões pequenos":"Exibir em lista"}">
          ${a.viewMode==="list"?'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/></svg>':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>'}
        </button>
        <button class="primary-button" type="button" data-open-order>Novo pedido</button>
      </div>
      ${a.viewMode==="list"?`
      <div class="panel table-shell">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                ${_("client","Cliente")}
                ${_("product","Produto")}
                ${_("quantity","Quantidade")}
                ${_("unitValue","Valor por Unidade")}
                ${_("totalSale","Total Venda")}
                ${_("shipping","Frete SP")}
                ${_("totalWithShipping","Total com Frete")}
                ${_("payment","Forma de Pagamento")}
                ${_("date","Data do Pedido")}
                ${_("actualDelivery","Entregue Em")}
                ${_("tracking","Codigo de Rastreio")}
                ${_("status","Status")}
                ${_("productionTime","Tempo de Producao")}
                ${_("material","Quantidade de Material Utilizado")}
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              ${n.map(be).join("")}
            </tbody>
          </table>
        </div>
      </div>
      `:`
      <div class="orders-grid${a.compactCards?" compact":""}">
        ${n.length?n.map(ve).join(""):'<div class="empty-state">Nenhum pedido encontrado.</div>'}
      </div>
      `}
      <div class="pagination">
        <span>${t.length} pedidos encontrados</span>
        <div>
          <button class="mini-button" data-page="${a.page-1}" ${a.page===1?"disabled":""}>Anterior</button>
          <strong>${a.page} / ${e}</strong>
          <button class="mini-button" data-page="${a.page+1}" ${a.page===e?"disabled":""}>Proxima</button>
        </div>
      </div>
    </div>
  `}function ve(t){const e=a.compactCards,n=ot(t),s=n[0]||t.petName||(t.client||"").split(" ")[0]||"Pet",r=t.quantity>1?`${t.quantity} chaveiros`:"1 chaveiro";return`
    <article class="order-card${e?" compact":""}">
      <div class="order-card-head">
        <div>
          <strong>${v(t.client)}</strong>
          <small>${v(t.id)}</small>
        </div>
        <span class="status-pill ${mt(z(t))}">${v(z(t))}</span>
      </div>
      <div class="order-card-body">
        <div class="order-card-row">
          <div>
            <span>Pet</span>
            <strong>${v(s)}</strong>
          </div>
          <div>
            <span>Itens do pedido</span>
            <strong>${r}</strong>
          </div>
        </div>
        ${n.length>1?`
          <div class="order-card-pet-list">
            ${n.map((o,i)=>`<span>${i+1}. ${v(o)}</span>`).join("")}
          </div>
        `:""}
        <div class="order-card-row">
          <div>
            <span>Produto</span>
            <strong>${v(t.product)}</strong>
          </div>
          <div>
            <span>Quantidade</span>
            <strong>${t.quantity} unidade${t.quantity===1?"":"s"}</strong>
          </div>
        </div>
        <div class="order-card-row">
          <div>
            <span>Pagamento</span>
            <strong>${v(t.payment)}</strong>
          </div>
          <div>
            <span>Frete</span>
            <strong>${x(t.shipping)}</strong>
          </div>
        </div>
        <div class="order-card-summary">
          <div>${M("Venda",x(t.totalSale))}</div>
          <div>${M("Total c/ frete",x(t.totalWithShipping))}</div>
        </div>
        <div class="order-card-grid">
          <div>${M("Data",t.date?nt(t.date):"Sem data")}</div>
          ${z(t)==="Entregue"?`<div>${M("Entregue Em",t.actualDelivery?nt(t.actualDelivery):"Pendente")}</div>`:""}
          <div>${M("Rastreio",t.tracking?v(t.tracking):"Pendente")}</div>
          <div>${M("Producao",`${t.productionTime} h`)}</div>
        </div>
        ${e?"":`
        <div class="order-card-notes">
          <span>Observacoes</span>
          <p>${v(t.notes||"Sem observacoes")}</p>
        </div>
        `}
      </div>
      <div class="order-card-actions">
        <button class="mini-button" type="button" data-detail="${t.id}">Abrir</button>
        <button class="mini-button" type="button" data-print="${t.id}">Imprimir</button>
        <button class="mini-button danger-button" type="button" data-delete-order="${t.id}">Excluir</button>
      </div>
    </article>
  `}function be(t){return`
    <tr>
      <td>
        <input class="cell-input name-cell" data-edit="${t.id}" data-field="client" value="${v(t.client)}">
        <button class="link-button compact-link" data-detail="${t.id}"><small>${t.id}</small></button>
      </td>
      <td>
        <select class="cell-input product-cell" data-edit="${t.id}" data-field="product">
          ${a.products.map(e=>`<option value="${e.name}" ${e.name===t.product?"selected":""}>${e.name}</option>`).join("")}
        </select>
      </td>
      <td><input class="cell-input" data-edit="${t.id}" data-field="quantity" type="number" min="1" value="${t.quantity}"></td>
      <td><input class="cell-input money-cell" data-edit="${t.id}" data-field="unitValue" type="number" min="0" step="0.01" value="${t.unitValue}"></td>
      <td><span class="readonly-cell">${x(t.totalSale)}</span></td>
      <td><input class="cell-input money-cell" data-edit="${t.id}" data-field="shipping" type="number" min="0" step="0.01" value="${t.shipping}"></td>
      <td><span class="readonly-cell">${x(t.totalWithShipping)}</span></td>
      <td>
        <select class="cell-input payment-cell" data-edit="${t.id}" data-field="payment">
          ${["Pix","Cartao","Boleto","Dinheiro"].map(e=>`<option ${e===t.payment?"selected":""}>${e}</option>`).join("")}
        </select>
      </td>
      <td><input class="cell-input date-cell" data-edit="${t.id}" data-field="date" type="date" value="${t.date||""}"></td>
      <td>
        ${z(t)==="Entregue"?`<input class="cell-input date-cell" data-edit="${t.id}" data-field="actualDelivery" type="date" value="${t.actualDelivery||""}">`:'<span class="readonly-cell muted" style="font-size:0.8rem">-</span>'}
      </td>
      <td><input class="cell-input wide-cell" data-edit="${t.id}" data-field="tracking" value="${t.tracking}"></td>
      <td><select class="status-select ${mt(z(t))}" data-status="${t.id}">${ut.map(e=>`<option ${e===z(t)?"selected":""}>${e}</option>`).join("")}</select></td>
      <td><input class="cell-input" data-edit="${t.id}" data-field="productionTime" type="number" step="0.1" value="${t.productionTime}"> h</td>
      <td><input class="cell-input" data-edit="${t.id}" data-field="material" type="number" step="0.1" value="${t.material}"> g</td>
      <td class="row-actions">
        <button class="mini-button" data-detail="${t.id}">Abrir</button>
        <button class="mini-button" data-print="${t.id}">Imprimir</button>
        <button class="mini-button danger-button" data-delete-order="${t.id}">Excluir</button>
      </td>
    </tr>
  `}function zt(){const t=U.toISOString().slice(0,7),e=a.expenses.filter(n=>n.date&&n.date.startsWith(t));return Dt.map(n=>({category:n,total:e.filter(s=>s.category===n).reduce((s,r)=>s+Number(r.amount||0),0)})).filter(n=>n.total>0)}function _t(){localStorage.setItem("mpa:production_statuses_v1",JSON.stringify(a.productionStatuses))}function ye(t){if(a.productionStatuses.includes(t))return t;const e=String(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return e.includes("recebi")||e.includes("novo")?a.productionStatuses.includes("Recebido")?"Recebido":a.productionStatuses[0]:e.includes("arte")||e.includes("impress")||e.includes("criac")||e.includes("produ")?a.productionStatuses.includes("Em Produção")?"Em Produção":a.productionStatuses[1]||a.productionStatuses[0]:e.includes("pint")||e.includes("ornam")?a.productionStatuses.includes("Pintura")?"Pintura":a.productionStatuses[2]||a.productionStatuses[0]:e.includes("mont")||e.includes("final")||e.includes("foto")||e.includes("embal")?a.productionStatuses.includes("Finalização")?"Finalização":a.productionStatuses[3]||a.productionStatuses[0]:e.includes("pront")||e.includes("envi")?a.productionStatuses.includes("Pronto")?"Pronto":a.productionStatuses[4]||a.productionStatuses[0]:a.productionStatuses[0]||"Recebido"}function $e(t){const e=U.toISOString().slice(0,10);return t.delivery&&t.delivery<e&&!["Pronto","Enviado","Cancelado"].includes(t.status)}function Gt(t){const e=String(t.notes||"").toLowerCase(),n=["shih tzu","poodle","maltes","pinscher","yorkshire","schnauzer","bulldog","spitz","boxer","beagle","labrador","golden","pug","chiahuahua","dachshund","vira-lata","srd","gato"];for(const s of n)if(e.includes(s))return s.split(" ").map(r=>r.charAt(0).toUpperCase()+r.slice(1)).join(" ");return t.product?t.product.replace("Chaveiro","").replace("Combo 2","").replace("premium","").replace("cartoon","").trim()||"Chaveiro":"Personalizado"}function pt(t){return String(t||"").trim().split(" ")[0]||"Pet"}function Mt(t,e=1,n=""){const r=String(t||"").split(/[\n,;]+/).map(o=>o.trim()).filter(Boolean);return r.length?r:e>1?Array.from({length:Math.max(1,Number(e)||1)},(o,i)=>`${n||"Pet"} ${i+1}`):[n||"Pet"]}function ot(t){return Array.isArray(t.petNames)&&t.petNames.length?t.petNames:Mt(t.petName,t.quantity,t.petName||pt(t.client))}function bt(t){return String(t||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}function xe(t){const e=new Map;return t.forEach(n=>{const s=bt(n.client)||n.id;e.has(s)||e.set(s,{key:s,client:n.client||"Sem cliente",orders:[]}),e.get(s).orders.push(n)}),Array.from(e.values()).sort((n,s)=>n.client.localeCompare(s.client,"pt-BR"))}function kt(t){return{"Em Produção":{key:"productionDone",label:"Produzido"},Pintura:{key:"paintDone",label:"Pintado"}}[t]||null}function we(t){const e=a.productionStatuses.indexOf(t);return e>=0&&e<a.productionStatuses.length-1?a.productionStatuses[e+1]:null}function Se(t,e){const n=kt(e);if(!n)return 0;const s=t.reduce((o,i)=>o+ot(i).length,0);if(!s)return 0;const r=t.reduce((o,i)=>{const d=ot(i),l=Array.isArray(i[n.key])?i[n.key]:[];return o+d.filter((c,m)=>!!l[m]).length},0);return Math.min(100,Math.round(r/s*100))}function ke(t,e){const n=kt(e);if(!n)return;const s=we(e);!t.every(o=>{const i=ot(o),d=Array.isArray(o[n.key])?o[n.key]:[];return i.length&&i.every((l,c)=>!!d[c])})||!s||(t.forEach(o=>{o.status=s,delete o.orderStatus,o[n.key]=[],o.history.unshift({at:q(new Date),text:`Grupo avançou para ${s}`})}),R())}function Q(){a.productionSearch=a.productionSearch||"",a.productionFilter=a.productionFilter||"Todos",a.productionPriorityFilter=a.productionPriorityFilter||"Todos",a.productionDateSort=a.productionDateSort||"prox-entrega",a.orders.forEach(s=>{const r=a.shippingStatuses||["Pronto","Postagem","Enviado","Entregue"];s.status&&!a.productionStatuses.includes(s.status)&&!r.includes(s.status)&&s.status!=="Cancelado"&&(s.status=ye(s.status))});const t=String(a.productionSearch||"").trim().toLowerCase();let e=a.orders.filter(s=>a.productionStatuses.includes(s.status));a.productionFilter&&a.productionFilter!=="Todos"&&(e=e.filter(s=>s.status===a.productionFilter)),a.productionPriorityFilter&&a.productionPriorityFilter!=="Todos"&&(e=e.filter(s=>s.priority===a.productionPriorityFilter)),t&&(e=e.filter(s=>{const r=s.petName||(s.client||"").split(" ")[0]||"";return`${s.id} ${s.client} ${s.product} ${r} ${s.priority}`.toLowerCase().includes(t)})),e.sort((s,r)=>a.productionDateSort==="prox-entrega"?(s.delivery||"").localeCompare(r.delivery||""):a.productionDateSort==="longe-entrega"?(r.delivery||"").localeCompare(s.delivery||""):a.productionDateSort==="mais-recente"?(r.date||"").localeCompare(s.date||""):a.productionDateSort==="mais-antigo"?(s.date||"").localeCompare(r.date||""):0);const n=a.productionStatuses.reduce((s,r)=>({...s,[r]:[]}),{});e.forEach(s=>{n[s.status]||(n[s.status]=[]),n[s.status].push(s)}),document.getElementById("productionView").innerHTML=`
    <div class="panel production-panel">
      <div class="production-header-section">
        <div class="title-area">
          <h2>Controle de Produção</h2>
          <p class="muted">Acompanhe cada pedido em todas as etapas da produção. ❤️</p>
        </div>
        
        <div class="production-toolbar-new">
          <div class="search-wrap">
            <span class="search-icon-new">🔍</span>
            <input id="productionSearch" class="search-input-new" placeholder="Buscar pedido..." value="${v(a.productionSearch)}" />
          </div>
          
          <div class="filter-dropdown-wrap">
            <span class="dropdown-icon">📅</span>
            <select id="productionDateSort" class="filter-select-new">
              <option value="prox-entrega" ${a.productionDateSort==="prox-entrega"?"selected":""}>Prazo (Mais próximo)</option>
              <option value="longe-entrega" ${a.productionDateSort==="longe-entrega"?"selected":""}>Prazo (Mais distante)</option>
              <option value="mais-recente" ${a.productionDateSort==="mais-recente"?"selected":""}>Data (Mais recente)</option>
              <option value="mais-antigo" ${a.productionDateSort==="mais-antigo"?"selected":""}>Data (Mais antigo)</option>
            </select>
          </div>

          <div class="filter-dropdown-wrap">
            <span class="dropdown-icon">🚩</span>
            <select id="productionPriorityFilter" class="filter-select-new">
              <option value="Todos" ${a.productionPriorityFilter==="Todos"?"selected":""}>Prioridade (Todas)</option>
              <option value="Alta" ${a.productionPriorityFilter==="Alta"?"selected":""}>Alta</option>
              <option value="Média" ${a.productionPriorityFilter==="Média"?"selected":""}>Média</option>
              <option value="Baixa" ${a.productionPriorityFilter==="Baixa"?"selected":""}>Baixa</option>
            </select>
          </div>

          <div class="filter-dropdown-wrap">
            <span class="dropdown-icon">⚙️</span>
            <select id="productionStatusFilter" class="filter-select-new">
              <option value="Todos" ${a.productionFilter==="Todos"?"selected":""}>Colunas (Todas)</option>
              ${a.productionStatuses.map(s=>`<option value="${s}" ${a.productionFilter===s?"selected":""}>${s}</option>`).join("")}
            </select>
          </div>

          <button class="add-col-button" type="button" id="addColBtn" title="Adicionar nova etapa de produção">+ Nova Coluna</button>
          <button class="primary-button-new" type="button" data-open-order>+ Novo Pedido</button>
        </div>
      </div>

      <div class="kanban-board-new">
        ${a.productionStatuses.map((s,r)=>{const o=n[s]||[],i=xe(o),d=kt(s),l=[{bg:"#fef3c7",text:"#b45309",border:"#fcd34d"},{bg:"#ffedd5",text:"#c2410c",border:"#fed7aa"},{bg:"#fee2e2",text:"#b91c1c",border:"#fca5a5"},{bg:"#fce7f3",text:"#be185d",border:"#fbcfe8"},{bg:"#dcfce7",text:"#15803d",border:"#bbf7d0"}],c=l[r%l.length];return`
            <section class="kanban-column-new">
              <div class="kanban-column-head-new" style="background-color: ${c.bg}; color: ${c.text}; border-bottom: 2px solid ${c.border}">
                <div class="column-title-wrap">
                  <span class="column-index">${r+1}.</span>
                  <h3 class="column-name">${s.toUpperCase()}</h3>
                  <button class="delete-column-btn-new" data-delete-status="${s}" title="Excluir Coluna">✕</button>
                </div>
                <span class="column-count-badge">${o.length}</span>
              </div>
                <div class="kanban-column-body-new" data-status="${s}">
                ${i.length?i.map(m=>{var C;const p=m.orders[0],f=`${s}-${m.key}`,k=(C=a.expandedProductionGroups)==null?void 0:C[f],w=m.orders.reduce(($,g)=>$+Number(g.quantity||1),0),N=p.petName||(p.client||"").split(" ")[0]||"-",h=p.petPhoto?`style="background-image:url('${p.petPhoto}')"`:"",S=Gt(p),y=d?Se(m.orders,s):0;let P="";if(p.date){const $=p.date.split("-");$.length===3&&(P=`${$[2]}/${$[1]}/${$[0].slice(2)}`)}return`
                    <article class="kanban-group-card ${k?"expanded":""}" draggable="true" data-order="${p.id}" data-group-key="${m.key}" data-status="${s}">
                      <button class="kanban-group-header" type="button" data-toggle-production-group="${f}">
                        <div class="kanban-group-summary">
                          <strong>${v(m.client)}</strong>
                          <span>${w} pet${w===1?"":"s"}${m.orders.length>1?`, ${m.orders.length} pedidos`:""}</span>
                        </div>
                        <span class="kanban-group-toggle">${k?"Recolher":"Expandir"}</span>
                      </button>
                      <div class="kanban-group-primary">
                        <div class="kanban-card-keychain-container">
                          <div class="keychain-link-ring"></div>
                          <div class="keychain-link-chain"></div>
                          <div class="kanban-card-photo" ${h}></div>
                        </div>
                        <div class="kanban-card-info-wrap">
                          <div class="kanban-card-top-row">
                            <span class="kanban-card-id">#${p.id.split("-").pop()||p.id}</span>
                            <button class="kanban-card-menu-btn" data-detail="${p.id}" type="button">⋮</button>
                          </div>
                          <h4 class="kanban-card-pet-name">${v(N)}</h4>
                          <p class="kanban-card-breed">${v(S)}</p>
                          <div class="kanban-card-meta-new">
                            <div class="kanban-card-delivery-row">
                              <span class="calendar-icon-card">📅</span>
                              <span class="date-card">${P||"Sem data"}</span>
                            </div>
                            <div class="kanban-card-priority-wrap">
                              <span class="priority-dot-new priority-${String(p.priority).toLowerCase().normalize("NFD").replace(/[ - ]/g,"").replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"")}"></span>
                              <span class="priority-text-new">${v(p.priority)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      ${d?`
                        <div class="kanban-progress-row">
                          <div class="kanban-progress">
                            <span style="width:${y}%"></span>
                          </div>
                          <div class="kanban-progress-meta">
                            <b>${y}%</b>
                            <small>${y<100?`${d.label} pendente`:"Pronto para avançar"}</small>
                          </div>
                        </div>
                      `:""}
                      ${k?`
                        <div class="kanban-group-expanded">
                          ${m.orders.map($=>`
                            ${(()=>{const g=ot($),I=d&&Array.isArray($[d.key])?$[d.key]:Array.from({length:g.length},()=>!1);return`
                            <div class="kanban-mini-order">
                              <button type="button" class="kanban-mini-order-main" data-detail="${$.id}">
                                <span>
                                  <strong>${v($.client||"Sem cliente")}</strong>
                                  <small>${v($.product)}</small>
                                </span>
                                <b>${$.quantity}x</b>
                              </button>
                              <div class="kanban-mini-order-pets" style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
                                ${g.map((B,E)=>{const D=$.petPhotos?$.petPhotos[E]:E===0?$.petPhoto:"",H=D?`background-image:url('${D}'); background-size:cover; background-position:center; width:28px; height:28px; border-radius:50%; margin-right:8px; display:inline-block; flex-shrink:0; border:1px solid var(--line);`:"width:28px; height:28px; border-radius:50%; margin-right:8px; display:inline-block; background-color:var(--surface-solid); flex-shrink:0; border:1px solid var(--line);";return`
                                  <label class="kanban-mini-order-check" style="display:flex; align-items:center; padding: 4px; border-radius: 6px; cursor: ${d?"pointer":"default"};">
                                    ${d?`<input type="checkbox" data-production-step="${s}" data-production-order="${$.id}" data-production-index="${E}" ${I[E]?"checked":""} style="margin-right:12px; width:16px; height:16px;" />`:""}
                                    <div style="${H}"></div>
                                    <span style="flex:1; font-size: 0.9rem; font-weight: 500;">${v(B)}${d?` <span style="font-weight:normal; font-size:0.8rem; color:var(--text-muted); opacity: 0.8;">- ${d.label}</span>`:""}</span>
                                  </label>
                                  `}).join("")}
                              </div>
                            </div>
                              `})()}
                          `).join("")}
                        </div>
                      `:""}
                    </article>
                  `}).join(""):""}
                
                <!-- Custom dashed placeholder at the bottom -->
                <div class="kanban-add-placeholder" data-open-order data-target-status="${s}">
                  <span class="plus-icon">+</span> Adicionar pedido
                </div>
              </div>
            </section>
          `}).join("")}
      </div>
    </div>
  `}function Pe(){const t=Nt(),e=U.toISOString().slice(0,7),n=a.expenses.filter(o=>o.date&&o.date.startsWith(e)),s=t.expenses,r=n.slice().sort((o,i)=>Number(i.amount)-Number(o.amount))[0];document.getElementById("expensesView").innerHTML=`
    <div class="grid metric-grid">
      ${O("Despesas do mes",x(s),"Total operacional")}
      ${O("Maior despesa",x(r?r.amount:0),r?r.name:"Sem despesas")}
      ${O("Categorias",zt().length,"Tipos com lancamentos")}
      ${O("Lucro pos despesas",x(Nt().profitAfterExpenses),"Estimativa liquida")}
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
          <select name="category">${Dt.map(o=>`<option>${o}</option>`).join("")}</select>
        </label>
        <label>Valor
          <input name="amount" required type="number" min="0" step="0.01" placeholder="0,00">
        </label>
        <label>Data
          <input name="date" required type="date" value="${G(0)}">
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
          ${zt().map(o=>`
            <div class="soft-row">
              <span><strong>${o.category}</strong><small>${Math.round(o.total/Math.max(s,1)*100)}% do total</small></span>
              <b>${x(o.total)}</b>
            </div>
          `).join("")||'<p class="muted">Nenhuma despesa cadastrada.</p>'}
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
          ${Object.entries(a.shippingRates||{}).length?Object.entries(a.shippingRates).map(([o,i])=>`
            <div class="soft-row">
              <span><strong>${o}</strong></span>
              <b>${x(i)}</b>
              <button class="mini-button danger-button" type="button" data-delete-shipping="${o}">Excluir</button>
            </div>
          `).join(""):'<p class="muted">Nenhuma tarifa cadastrada.</p>'}
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
            ${a.expenses.map(o=>`
              <tr>
                <td><input class="cell-input name-cell" data-expense-edit="${o.id}" data-field="name" value="${v(o.name)}"></td>
                <td>
                  <select class="cell-input product-cell" data-expense-edit="${o.id}" data-field="category">
                    ${Dt.map(i=>`<option ${i===o.category?"selected":""}>${i}</option>`).join("")}
                  </select>
                </td>
                <td><input class="cell-input money-cell" data-expense-edit="${o.id}" data-field="amount" type="number" min="0" step="0.01" value="${o.amount}"></td>
                <td><input class="cell-input date-cell" data-expense-edit="${o.id}" data-field="date" type="date" value="${o.date}"></td>
                <td><input class="cell-input note-cell" data-expense-edit="${o.id}" data-field="notes" value="${v(o.notes||"")}"></td>
                <td class="row-actions"><button class="mini-button danger-button" type="button" data-delete-expense="${o.id}">Excluir</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function Xt(t){const e=new Date(U),n=new Date(U);return t==="7d"?n.setDate(U.getDate()-7):t==="30d"?n.setDate(U.getDate()-30):t==="90d"?n.setDate(U.getDate()-90):t==="mes-atual"?(n.setDate(1),e.setMonth(e.getMonth()+1,0)):t==="ano-atual"?(n.setMonth(0,1),e.setMonth(11,31)):n.setDate(U.getDate()-30),{start:n,end:e}}function Ee(t,e){const n=Math.abs(e-t),s=Math.ceil(n/(1e3*60*60*24)),r=new Date(t);r.setDate(t.getDate()-1);const o=new Date(r);return o.setDate(r.getDate()-s),{start:o,end:r}}function Ft(t,e,n="Todos"){const s=t.toISOString().slice(0,10),r=e.toISOString().slice(0,10);return a.orders.filter(o=>!(o.status==="Cancelado"||o.date<s||o.date>r||n!=="Todos"&&o.product!==n))}function Ut(t){const e=t.reduce((o,i)=>o+i.totalWithShipping,0),n=t.length,s=n>0?e/n:0,r=t.reduce((o,i)=>o+i.quantity,0);return{faturamento:e,totalPedidos:n,ticketMedio:s,produtosVendidos:r}}function ft(t,e){return e===0?t>0?100:0:(t-e)/e*100}function Ce(t,e,n){const r=Math.max(...t,...e,100)*1.15,o=600,i=220,d=45,l=[],c=[],m=(y,P)=>d+y/(P-1||1)*(o-2*d),p=y=>i-d-y/r*(i-2*d);t.forEach((y,P)=>{l.push(`${m(P,t.length)},${p(y)}`)}),e.forEach((y,P)=>{c.push(`${m(P,e.length)},${p(y)}`)});const f=l.length>1?`M ${l.join(" L ")}`:"",k=c.length>1?`M ${c.join(" L ")}`:"";let w="";l.length>1&&(w=`${f} L ${m(t.length-1,t.length)},${i-d} L ${m(0,t.length)},${i-d} Z`);let N="";for(let y=0;y<=4;y++){const P=r*(y/4),C=p(P);N+=`
      <line x1="${d}" y1="${C}" x2="${o-d}" y2="${C}" stroke="var(--line)" stroke-dasharray="2,2" stroke-width="1" stroke-opacity="0.6" />
      <text x="${d-8}" y="${C+3}" font-size="8.5" fill="var(--muted)" text-anchor="end">${x(P).replace(",00","")}</text>
    `}let h="";const S=Math.max(Math.ceil(t.length/5),1);for(let y=0;y<t.length;y+=S){const P=m(y,t.length);h+=`
      <text x="${P}" y="${i-15}" font-size="9" fill="var(--muted)" text-anchor="middle">${n[y]||""}</text>
    `}if((t.length-1)%S!==0){const y=m(t.length-1,t.length);h+=`
      <text x="${y}" y="${i-15}" font-size="9" fill="var(--muted)" text-anchor="middle">${n[t.length-1]||""}</text>
    `}return`
    <svg viewBox="0 0 ${o} ${i}" class="line-chart-svg" style="width: 100%; height: auto; display: block;">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--red)" stop-opacity="0.18" />
          <stop offset="100%" stop-color="var(--red)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${N}
      ${k?`<path d="${k}" fill="none" stroke="#fca5a5" stroke-width="1.8" stroke-dasharray="3,3" />`:""}
      ${w?`<path d="${w}" fill="url(#chartGradient)" />`:""}
      ${f?`<path d="${f}" fill="none" stroke="var(--red)" stroke-width="2.5" />`:""}
      ${h}
    </svg>
  `}function Ie(t){const e=t.reduce((i,d)=>i+d.value,0);if(e===0)return`
      <svg viewBox="0 0 100 100" class="donut-chart-svg" style="max-width: 160px; margin: 0 auto; display: block;">
        <circle cx="50" cy="50" r="35" fill="none" stroke="var(--line)" stroke-width="14" />
        <text x="50" y="54" font-size="8" fill="var(--muted)" text-anchor="middle">Sem dados</text>
      </svg>
    `;let n=0,s="";const r=35,o=2*Math.PI*r;return t.forEach(i=>{const l=i.value/e*o,c=`${l} ${o-l}`,m=n/o*360-90;s+=`
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="${i.color}" stroke-width="14"
              stroke-dasharray="${c}" transform="rotate(${m} 50 50)" />
    `,n+=l}),`
    <svg viewBox="0 0 100 100" class="donut-chart-svg" style="max-width: 160px; margin: 0 auto; display: block;">
      <circle cx="50" cy="50" r="35" fill="none" stroke="var(--surface-solid)" stroke-width="14" />
      ${s}
      <circle cx="50" cy="50" r="23" fill="var(--surface-solid)" />
    </svg>
  `}function De(){const t=Nt(),e=new Date().getFullYear(),{start:n,end:s}=Xt(a.reportPeriod),{start:r,end:o}=Ee(n,s),i=Ft(n,s,a.reportProduct),d=Ft(r,o,a.reportProduct),l=Ut(i),c=Ut(d),m=a.expenses.filter(u=>u.date&&u.date>=n.toISOString().slice(0,10)&&u.date<=s.toISOString().slice(0,10)).reduce((u,b)=>u+Number(b.amount||0),0),p=a.expenses.filter(u=>u.date&&u.date>=n.toISOString().slice(0,10)&&u.date<=s.toISOString().slice(0,10)&&String(u.category||"").toLowerCase()==="frete").reduce((u,b)=>u+Number(b.amount||0),0),f=i.reduce((u,b)=>u+Number(b.shipping||0),0),k=l.faturamento-m,w=ft(l.faturamento,c.faturamento),N=ft(l.totalPedidos,c.totalPedidos),h=ft(l.ticketMedio,c.ticketMedio),S=ft(l.produtosVendidos,c.produtosVendidos),y=Math.abs(s-n),P=Math.ceil(y/(1e3*60*60*24))+1,C=Array(P).fill(0),$=Array(P).fill(0),g=[],I=u=>`${u.getDate().toString().padStart(2,"0")}/${(u.getMonth()+1).toString().padStart(2,"0")}`;for(let u=0;u<P;u++){const b=new Date(n);b.setDate(n.getDate()+u);const W=b.toISOString().slice(0,10);g.push(I(b)),i.forEach(lt=>{lt.date===W&&(C[u]+=lt.totalWithShipping)});const dt=new Date(r);dt.setDate(r.getDate()+u);const ae=dt.toISOString().slice(0,10);d.forEach(lt=>{lt.date===ae&&($[u]+=lt.totalWithShipping)})}const B=u=>`${u.getDate().toString().padStart(2,"0")}/${(u.getMonth()+1).toString().padStart(2,"0")}/${u.getFullYear()}`,E=`${B(n)} – ${B(s)}`,D=`${B(r)} – ${B(o)}`,H={};Lt.forEach(u=>{H[u]=0}),i.forEach(u=>{H[u.status]=(H[u.status]||0)+1});const V=[{label:"Em produção",keys:["Em Produção","Em Producao","Pintura","Finalização","Ornamentos","Criação do 3D","Fila Impressão","Imprimindo 3D"],color:"#f97316"},{label:"Pronto para envio",keys:["Pronto para Envio","Pronto","Pronto para Foto","Embalagem"],color:"#f43f5e"},{label:"Entregue",keys:["Entregue","Enviado"],color:"#2f8f5b"},{label:"Pendente",keys:["Recebido","Novo Pedido"],color:"#ffd66b"},{label:"Cancelado",keys:["Cancelado"],color:"#7a6259"}],L=V.map(u=>{let b=0;return u.keys.forEach(W=>{b+=H[W]||0}),{label:u.label,value:b,color:u.color}}).filter(u=>u.value>0),T=L.reduce((u,b)=>u+b.value,0),K={};i.forEach(u=>{const W=`Chaveiro Pet - ${Gt(u)}`;K[W]=(K[W]||0)+u.quantity});const et=Object.entries(K).map(([u,b])=>({name:u,total:b})).sort((u,b)=>b.total-u.total),rt=et.slice(0,4),Tt=et.slice(4).reduce((u,b)=>u+b.total,0);Tt>0&&rt.push({name:"Outros",total:Tt});const Zt=Math.max(...rt.map(u=>u.total),1),Z=[0,0,0,0,0,0,0];i.forEach(u=>{const W=new Date(u.date+"T12:00:00").getDay();Z[W]+=u.totalWithShipping});const At=[{label:"Seg",value:Z[1]},{label:"Ter",value:Z[2]},{label:"Qua",value:Z[3]},{label:"Qui",value:Z[4]},{label:"Sex",value:Z[5]},{label:"Sáb",value:Z[6]},{label:"Dom",value:Z[0]}],Yt=Math.max(...At.map(u=>u.value),100),Pt={};i.forEach(u=>{Pt[u.client]=(Pt[u.client]||0)+u.totalWithShipping});const te=Object.entries(Pt).map(([u,b])=>({name:u,total:b})).sort((u,b)=>b.total-u.total).slice(0,5),gt=u=>{const b=u>=0;return`
      <span class="growth-text" style="color: ${b?"#2f8f5b":"#d83f31"}; font-weight: 700; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 3px;">
        ${b?"↑":"↓"} ${Math.abs(u).toFixed(1)}% <span style="color: var(--muted); font-weight: 400; font-size: 0.75rem;">vs periodo anterior</span>
      </span>
    `},ee=u=>String(u||"").trim().charAt(0).toUpperCase()||"C",qt=["#fee2e2","#ffedd5","#fef3c7","#dcfce7","#e0f2fe","#f3e8ff"];document.getElementById("financeView").innerHTML=`
    <div class="grid metric-grid" style="margin-bottom: 24px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
      ${O("Faturamento do mês",x(t.revenue),"Vendas ativas")}
      ${O("Faturamento do Ano",x(t.yearlyRevenue),`Total em ${e}`)}
      ${O("Despesas do mês",x(t.expenses),"Operação e marketing")}
      ${O("Lucro estimado",x(t.profitAfterExpenses),"Líquido aproximado")}
      ${O("Ticket Médio",x(t.ticketMedio),"Bruto por pedido")}
      ${O("Tempo de Máquina",`${t.totalMachineTime.toFixed(1)}h`,"Uso total ativo")}
    </div>

    <div class="panel reports-panel">
      <!-- Toolbar Filters -->
      <div class="reports-toolbar-section">
        <div class="filter-dropdown-wrap">
          <span class="dropdown-icon">📅</span>
          <select id="reportPeriodSelect" class="filter-select-new">
            <option value="30d" ${a.reportPeriod==="30d"?"selected":""}>Período: Últimos 30 dias</option>
            <option value="7d" ${a.reportPeriod==="7d"?"selected":""}>Período: Últimos 7 dias</option>
            <option value="90d" ${a.reportPeriod==="90d"?"selected":""}>Período: Últimos 90 dias</option>
            <option value="mes-atual" ${a.reportPeriod==="mes-atual"?"selected":""}>Período: Mês Atual</option>
            <option value="ano-atual" ${a.reportPeriod==="ano-atual"?"selected":""}>Período: Ano Atual</option>
          </select>
        </div>

        <div class="filter-dropdown-wrap">
          <span>Comparar com</span>
          <select id="reportCompareSelect" class="filter-select-new">
            <option value="anterior" ${a.reportCompare==="anterior"?"selected":""}>Período anterior</option>
          </select>
        </div>

        <div class="filter-dropdown-wrap">
          <span class="dropdown-icon">📦</span>
          <select id="reportProductSelect" class="filter-select-new">
            <option value="Todos">Todos os produtos</option>
            ${a.products.map(u=>`<option value="${u.name}" ${a.reportProduct===u.name?"selected":""}>${u.name}</option>`).join("")}
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
            <strong class="kpi-value">${x(l.faturamento)}</strong>
            ${gt(w)}
          </div>
          <div class="kpi-icon-wrap kpi-icon-red">
            <span>$</span>
          </div>
        </div>

        <!-- Card 2: Frete Recebido -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Frete Recebido</span>
            <strong class="kpi-value">${x(f)}</strong>
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
            <strong class="kpi-value">${x(p)}</strong>
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
            <strong class="kpi-value">${l.totalPedidos}</strong>
            ${gt(N)}
          </div>
          <div class="kpi-icon-wrap kpi-icon-orange">
            <span>🛍️</span>
          </div>
        </div>

        <!-- Card 5: Ticket Médio -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Ticket Médio</span>
            <strong class="kpi-value">${x(l.ticketMedio)}</strong>
            ${gt(h)}
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <span>📈</span>
          </div>
        </div>

        <!-- Card 6: Produtos Vendidos -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Produtos Vendidos</span>
            <strong class="kpi-value">${l.produtosVendidos}</strong>
            ${gt(S)}
          </div>
          <div class="kpi-icon-wrap kpi-icon-pink">
            <span>📦</span>
          </div>
        </div>

        <!-- Card 7: Lucro Real -->
        <div class="kpi-card-new">
          <div class="kpi-card-content">
            <span class="kpi-label">Lucro Real</span>
            <strong class="kpi-value">${x(k)}</strong>
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
              <span class="legend-indicator legend-curr"><i class="legend-line"></i> ${E}</span>
              <span class="legend-indicator legend-prev"><i class="legend-line-dashed"></i> ${D}</span>
            </div>
          </div>
          <div class="line-chart-container">
            ${Ce(C,$,g)}
          </div>
        </div>

        <!-- Donut Status Panel -->
        <div class="panel chart-panel-new">
          <div class="chart-panel-head">
            <h3>Pedidos por Status</h3>
          </div>
          <div class="donut-chart-layout">
            <div class="donut-svg-wrap">
              ${Ie(L)}
            </div>
            <div class="donut-legend-wrap">
              ${V.map(u=>{let b=0;u.keys.forEach(dt=>{b+=H[dt]||0});const W=T>0?Math.round(b/T*100):0;return`
                  <div class="donut-legend-row">
                    <span class="donut-legend-color" style="background-color: ${u.color}"></span>
                    <div class="donut-legend-info">
                      <span class="donut-legend-label">${u.label}</span>
                      <small class="donut-legend-count">${b} pedido${b!==1?"s":""}</small>
                    </div>
                    <span class="donut-legend-pct">${W}%</span>
                  </div>
                `}).join("")}
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
            ${rt.map(u=>{const b=Math.round(u.total/Zt*100);return`
                <div class="product-sale-row">
                  <span class="product-sale-icon">${u.name==="Outros"?"🎨":"🔑"}</span>
                  <div class="product-sale-details">
                    <span class="product-sale-name">${u.name}</span>
                    <div class="product-sale-bar-wrap">
                      <div class="product-sale-bar-fill" style="width: ${b}%"></div>
                    </div>
                  </div>
                  <span class="product-sale-total">${u.total}</span>
                </div>
              `}).join("")||'<p class="muted text-center" style="padding: 24px;">Sem vendas no período.</p>'}
          </div>
        </div>

        <!-- Faturamento por Dia da Semana -->
        <div class="panel chart-panel-new">
          <div class="chart-panel-head">
            <h3>Faturamento por Dia da Semana</h3>
          </div>
          <div class="week-days-bars-layout">
            ${At.map(u=>{const b=Math.round(u.value/Yt*100);return`
                <div class="week-bar-col">
                  <div class="week-bar-tooltip">${x(u.value).replace(",00","")}</div>
                  <div class="week-bar-container">
                    <div class="week-bar-fill" style="height: ${Math.max(b,4)}%"></div>
                  </div>
                  <span class="week-bar-label">${u.label}</span>
                </div>
              `}).join("")}
          </div>
        </div>

        <!-- Top Clientes -->
        <div class="panel chart-panel-new">
          <div class="chart-panel-head">
            <h3>Top Clientes</h3>
            <span class="muted font-small">Total</span>
          </div>
          <div class="top-clients-list">
            ${te.map((u,b)=>`
                <div class="top-client-row">
                  <span class="top-client-avatar" style="background-color: ${qt[b%qt.length]}">${ee(u.name)}</span>
                  <span class="top-client-name">${u.name}</span>
                  <span class="top-client-amount">${x(u.total)}</span>
                </div>
              `).join("")||'<p class="muted text-center" style="padding: 24px;">Sem clientes no período.</p>'}
          </div>
        </div>
      </div>

      <!-- Center Status Line -->
      <div class="reports-footer-line">
        <span>❤️ Relatórios atualizados em tempo real.</span>
      </div>
    </div>
  `}function Rt(){const t=J("import_batches",[]);document.getElementById("importView").innerHTML=`
    <div class="grid content-grid">
      <div class="panel">
        <h2>Importar pedidos do Excel</h2>
        <p class="muted">Selecione uma planilha .xlsx, .xls ou .csv. O sistema reconhece as colunas automaticamente e importa todas as linhas da planilha.</p>
        <div class="upload-zone" id="uploadZone">
          <input id="spreadsheetInput" type="file" accept=".xlsx,.xls,.csv">
          <strong>${a.importFileName||"Escolha ou arraste a planilha de pedidos"}</strong>
          <span>CSV funciona offline; Excel carrega SheetJS automaticamente quando necessario</span>
        </div>
        ${a.importSummary?`<div class="import-summary">${a.importSummary}</div>`:""}
        <div class="quick-actions wrap" style="margin-top:14px">
          <button class="primary-button" type="button" id="confirmImport" ${a.importRows.length?"":"disabled"}>Importar ${a.importRows.length} pedidos</button>
          <button class="ghost-button" type="button" id="clearImport" ${a.importRows.length?"":"disabled"}>Limpar previa</button>
          <button class="ghost-button" type="button" id="downloadTemplate">Baixar modelo CSV</button>
        </div>
        ${Ne()}
      </div>
      <div class="panel">
        <h3>Colunas esperadas</h3>
        <div class="column-map">${xt.map(e=>`<span>${e}</span>`).join("")}</div>
        <h3 style="margin-top:18px">Ultimas importacoes</h3>
        <div class="list">
          ${t.length?t.map(e=>`
            <div class="soft-row">
              <span><strong>${e.fileName}</strong><small>${e.createdAt}</small></span>
              <b>${e.importedCount} pedidos</b>
            </div>
          `).join(""):'<p class="muted">Nenhuma planilha importada ainda.</p>'}
        </div>
      </div>
    </div>
  `}function Ne(){return a.importRows.length?`
    <div class="import-preview">
      <div class="section-head">
        <h3>Previa da importacao</h3>
        <span class="status-pill status-novo-pedido">${a.importRows.length} linhas lidas</span>
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
            ${a.importRows.slice(0,8).map(t=>`
              <tr>
                <td>${v(t.client)}</td>
                <td>${v(t.product)}</td>
                <td>${t.quantity}</td>
                <td>${x(t.totalWithShipping)}</td>
                <td>${v(t.payment)}</td>
                <td>${nt(t.delivery)}</td>
                <td>${v(t.tracking||"Pendente")}</td>
                <td><span class="status-pill ${mt(t.status)}">${t.status}</span></td>
                <td>${t.material}g</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      ${a.importRows.length>8?`<p class="muted">Mostrando 8 de ${a.importRows.length} linhas. Todas as linhas serao importadas.</p>`:""}
    </div>
  `:""}function Me(){const t=localStorage.getItem("mpa:auto_backup_time")||"Nenhum realizado ainda";document.getElementById("adminView").innerHTML=`
    <div class="grid content-grid">
      <div class="panel">
        <span class="eyebrow" style="color: var(--red-dark); font-weight:800;">Banco de Dados</span>
        <h2 style="margin-top:4px;">Seguranca &amp; Backups</h2>
        <p class="muted">Gerencie a integridade dos seus dados e realize backups de seguranca.</p>
        
        <div class="soft-row" style="margin-bottom:14px; background: color-mix(in srgb, var(--yellow) 12%, var(--surface-solid)); display:flex; flex-direction:column; align-items:flex-start; gap:6px;">
          <span style="font-weight:900; color:var(--ink);">Backup Automatico de Seguranca</span>
          <small>Status: <span class="status-pill status-finalizado" style="padding:2px 8px; font-size:0.7rem; font-weight:800;">ATIVO</span></small>
          <small>Ultima salvaguarda automatica: <strong>${t}</strong></small>
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
  `}function Y(t){const e=a.orders.find(c=>c.id===t);if(!e)return;a.selectedOrder=e.id;const n=document.getElementById("detailModal"),s=z(e);a.products.find(c=>c.name===e.product);const r=ot(e),o=r[0]||e.petName||pt(e.client),i=Array.from({length:Math.max(Number(e.quantity||1),1)},(c,m)=>r[m]||`${o} ${m+1}`),d=e.productionDone?"Sim":"Nao",l=e.paintDone?"Sim":"Nao";n.innerHTML=`
    <article class="modal-card detail-card">
      <div class="modal-head">
        <div>
          <span class="eyebrow">${e.id}</span>
          <h2>${e.client}</h2>
        </div>
        <button class="ghost-button" type="button" data-close-detail>Fechar</button>
      </div>
      <div class="grid detail-grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
        ${r.map((c,m)=>{const p=e.petPhotos?e.petPhotos[m]:m===0?e.petPhoto:"";return`
          <div class="asset-card">
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Foto: ${v(c)}</span>
            ${Ct(p,Kt(e.client))}
            <input type="file" accept="image/*" data-asset-multi="${e.id}" data-asset-index="${m}">
          </div>
          `}).join("")}
        <div class="asset-card">
          <span>Arte gerada</span>
          ${Ct(e.generatedArt,"ART")}
          <input type="file" accept="image/*" data-asset="${e.id}" data-field="generatedArt">
        </div>
        <div class="asset-card">
          <span>Mockup do chaveiro</span>
          ${Ct(e.keychainMockup,"3D",e.keychainMockupName)}
          <input type="file" accept=".3mf,image/*" data-asset="${e.id}" data-field="keychainMockup">
          <small class="muted">Aceita imagens ou arquivo 3MF do modelo 3D.</small>
        </div>
      </div>
      <div class="grid content-grid">
        <div class="panel inset">
          <h3>Detalhes completos</h3>
          ${a.detailEditMode?`
            <div class="detail-edit-form">
              <label>
                Nome do pet
                <input id="detailPetName" value="${v(e.petName||"")}" placeholder="Nome do pet" />
              </label>
              <label class="wide">
                Nomes dos pets
                <textarea id="detailPetNames" rows="3" placeholder="Um nome por linha ou separado por vírgula">${v((e.petNames||[]).join(", ")||e.petName||"")}</textarea>
              </label>
              <label>
                Cliente
                <input id="detailClient" value="${v(e.client)}" />
              </label>
              <label>
                WhatsApp
                <input id="detailWhatsapp" value="${v(e.whatsapp||"")}" placeholder="(11) 99999-9999" />
              </label>
              <label>
                Produto
                <select id="detailProduct">
                  ${a.products.map(c=>`<option value="${v(c.name)}" ${c.name===e.product?"selected":""}>${v(c.name)}</option>`).join("")}
                </select>
              </label>
              <label>
                Quantidade
                <input id="detailQuantity" type="number" min="1" value="${e.quantity}" />
              </label>
              <label>
                Frete
                <input id="detailShipping" type="number" min="0" step="0.01" value="${e.shipping}" />
              </label>
              <label>
                Pagamento
                <select id="detailPayment">
                  ${["Pix","Cartao","Boleto","Dinheiro"].map(c=>`<option ${c===e.payment?"selected":""}>${c}</option>`).join("")}
                </select>
              </label>
              <label>
                Data do Pedido
                <input id="detailDate" type="date" value="${e.date}" />
              </label>
              <label>
                Entregue Em
                <input id="detailActualDelivery" type="date" value="${e.actualDelivery||""}" />
              </label>
              <label>
                Rastreio
                <input id="detailTracking" value="${v(e.tracking||"")}" placeholder="BR000000000BR" />
              </label>
              <label>
                Status do pedido
                <select id="detailWorkflowStatus">
                  ${ut.map(c=>`<option value="${c}" ${c===s?"selected":""}>${c}</option>`).join("")}
                </select>
              </label>
              <label>
                Prioridade
                <select id="detailPriority">
                  ${["Alta","Média","Baixa"].map(c=>`<option ${c===e.priority?"selected":""}>${c}</option>`).join("")}
                </select>
              </label>
              <div class="quick-actions wrap">
                <button class="primary-button" type="button" data-save-detail-info="${e.id}">Salvar informações</button>
                <button class="ghost-button" type="button" data-cancel-detail-edit>Cancelar</button>
              </div>
            </div>
          `:`
            <div class="detail-list">
              ${M("Nome do pet",o)}
              ${r.length>1?M("Nomes dos pets",r.join(", ")):""}
              ${M("Status do pedido",s)}
              ${M("WhatsApp",e.whatsapp||"Nao cadastrado")}
              ${M("Produto",e.product)}
              ${M("Quantidade",e.quantity)}
              ${e.quantity>1?M("Itens do pedido",i.join(", ")):""}
              ${M("Produção",d)}
              ${M("Pintura",l)}
              ${M("Total com frete",x(e.totalWithShipping))}
              ${M("Pagamento",e.payment)}
              ${M("Data do Pedido",e.date?nt(e.date):"Sem data")}
              ${e.actualDelivery?M("Entregue Em",nt(e.actualDelivery)):""}
              ${M("Material",`${e.material}g`)}
              ${M("Tempo de producao",`${e.productionTime}h`)}
            </div>
            <div class="quick-actions">
              <button class="primary-button" type="button" data-toggle-detail-edit>Editar informações</button>
              <button class="ghost-button" type="button" data-copy="${e.tracking}">Copiar rastreio</button>
              <button class="ghost-button" type="button" data-print="${e.id}">Imprimir pedido</button>
              <button class="mini-button danger-button" type="button" data-delete-order="${e.id}">Excluir pedido</button>
            </div>
          `}
        </div>
        <div class="panel inset">
          <h3>Observacoes</h3>
          <textarea id="detailNotes" rows="5">${v(e.notes||"")}</textarea>
          <button class="primary-button" type="button" data-save-notes="${e.id}">Salvar observacoes</button>
          <h3>Historico</h3>
          <div class="history-list">${e.history.map(c=>`<div><b>${c.at}</b><span>${c.text}</span></div>`).join("")}</div>
        </div>
      </div>
    </article>
  `,n.open||n.showModal()}function Ct(t,e,n=""){return t?String(n||"").toLowerCase().endsWith(".3mf")?`
      <div class="asset-preview file-preview">
        <strong>${e}</strong>
        <span>${v(n||"arquivo.3mf")}</span>
      </div>
    `:`<div class="asset-preview" style="background-image:url('${t}')"></div>`:`<div class="asset-preview empty">${e}</div>`}function M(t,e){return`<div><span>${t}</span><strong>${e}</strong></div>`}function Kt(t){return t.split(" ").map(e=>e[0]).slice(0,2).join("").toUpperCase()}function mt(t){return`status-${t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replaceAll(" ","-")}`}function z(t){const e=String((t==null?void 0:t.orderStatus)||"").trim();if(ut.includes(e))return e;const n=String((t==null?void 0:t.status)||"").trim();if(!n)return"Novo Pedido";const s=n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");return s.includes("entreg")?"Entregue":s.includes("enviad")?"Enviado":s.includes("postag")||s.includes("pronto para envio")||s.includes("pronto")&&!s.includes("foto")||s.includes("embal")||s.includes("expedi")||s.includes("saida")?"Postagem":s.includes("novo")||s.includes("receb")||s.includes("pend")?"Novo Pedido":"Produção"}function v(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function it(t){return String(t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9]/g,"").toLowerCase()}function A(t,...e){for(const n of e){const s=it(n),r=Object.keys(t).find(o=>it(o)===s);if(r&&t[r]!==void 0&&t[r]!=="")return t[r]}return""}function at(t){if(typeof t=="number")return t;const e=String(t||"").replace(/[R$\s]/g,"").replace(/\./g,"").replace(",",".");return Number(e)||0}function Wt(t){if(!t)return G(0);if(t instanceof Date)return t.toISOString().slice(0,10);if(typeof t=="number"){const r=new Date(Date.UTC(1899,11,30));return r.setUTCDate(r.getUTCDate()+t),r.toISOString().slice(0,10)}const e=String(t).trim();if(/^\d{4}-\d{2}-\d{2}/.test(e))return e.slice(0,10);const n=e.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);if(n){const r=n[1].padStart(2,"0"),o=n[2].padStart(2,"0");return`${n[3].length===2?`20${n[3]}`:n[3]}-${o}-${r}`}const s=new Date(e);return Number.isNaN(s.getTime())?G(0):s.toISOString().slice(0,10)}function Fe(t){const e=it(t);return Lt.find(n=>it(n)===e)||"Novo Pedido"}function Be(t){const e=String(A(t,"Clientes","Cliente","Nome")||"").trim(),n=String(A(t,"Produto","Produtos")||"").trim(),s=it(e),r=it(n);return!(!e||!n||s==="clientes"||r==="produto"||["total","totais","subtotal","resumo"].includes(s))}function Le(t,e){const n=String(A(t,"Clientes","Cliente","Nome")||"").trim(),s=String(A(t,"Produto","Produtos")||"").trim(),r=at(A(t,"Quantidade","Qtd"))||1,o=at(A(t,"Valor por Unidade","Valor Unitario","Valor")),i=at(A(t,"Total Venda","Total"))||r*o,d=at(A(t,"Frete SP","Frete")),l=at(A(t,"Total com Frete","Total Final"))||i+d,c=Wt(A(t,"Data","Data Pedido")),m=Wt(A(t,"Entrega","Data Entrega")),p=String(A(t,"Codigo de Rastreio","Rastreio")||"").trim(),f=Fe(A(t,"Status")),k=at(A(t,"Tempo de Producao","Tempo")),w=at(A(t,"Quantidade de Material Utilizado","Material")),N=String(A(t,"Forma de Pagamento","Pagamento")||"Pix").trim(),h={id:`MPA-${c.replaceAll("-","").slice(2)}-${String(e+1).padStart(3,"0")}`,client:n,product:s,quantity:r,unitValue:o||i/Math.max(r,1),totalSale:i,shipping:d,totalWithShipping:l,payment:N,date:c,delivery:m,tracking:p,status:f,productionTime:k,material:w,notes:"Importado de planilha",petPhoto:"",generatedArt:"",keychainMockup:"",history:[{at:q(new Date),text:"Pedido importado de planilha"}]};return Bt(h),i&&(h.totalSale=i),l&&(h.totalWithShipping=l),h}function Oe(t){const e=t.split(/\r?\n/).find(l=>l.trim())||"",n=(e.match(/;/g)||[]).length>=(e.match(/,/g)||[]).length?";":",",s=[];let r=[],o="",i=!1;for(let l=0;l<t.length;l+=1){const c=t[l],m=t[l+1];c==='"'&&i&&m==='"'?(o+='"',l+=1):c==='"'?i=!i:c===n&&!i?(r.push(o),o=""):(c===`
`||c==="\r")&&!i?(c==="\r"&&m===`
`&&(l+=1),r.push(o),r.some(p=>String(p).trim())&&s.push(r),r=[],o=""):o+=c}r.push(o),r.some(l=>String(l).trim())&&s.push(r);const d=s.shift()||[];return s.map(l=>Object.fromEntries(d.map((c,m)=>[c,l[m]||""])))}async function Re(t){if(t.name.split(".").pop().toLowerCase()==="csv")return Oe(await t.text());if(window.XLSX||await Te(),!window.XLSX)throw new Error("Para importar Excel .xlsx/.xls, conecte a internet para carregar a biblioteca SheetJS ou exporte a planilha como CSV.");const n=await t.arrayBuffer(),s=window.XLSX.read(n,{type:"array",cellDates:!0}),r=s.Sheets[s.SheetNames[0]];return window.XLSX.utils.sheet_to_json(r,{defval:""})}function Te(){const t=["vendor/xlsx.full.min.js","https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"];return new Promise(e=>{if(window.XLSX){e();return}const n=s=>{if(!t[s]){e();return}const r=document.createElement("script");r.src=t[s],r.onload=()=>e(),r.onerror=()=>n(s+1),document.head.appendChild(r)};n(0)})}async function Jt(t){try{const e=await Re(t),n=e.filter(Be),s=n.map(Le);a.importRows=s,a.importFileName=t.name,a.importSummary=s.length?`Planilha lida com sucesso: ${s.length} pedidos validos encontrados. ${e.length-n.length} linhas vazias ou incompletas foram ignoradas.`:"Nenhum pedido valido foi encontrado. Verifique se as colunas Clientes e Produto estao preenchidas."}catch(e){a.importRows=[],a.importFileName=t.name,a.importSummary=e.message}Rt()}function Ae(){a.importRows.forEach(t=>{t.history.unshift({at:q(new Date),text:`Importado pela planilha ${a.importFileName}`}),a.orders.unshift(t)}),R(),de({fileName:a.importFileName,importedCount:a.importRows.length,createdAt:q(new Date)}),a.importSummary=`Importacao concluida: ${a.importRows.length} pedidos importados.`,a.importRows=[],F(),j("orders")}function Bt(t){t.quantity=Number(t.quantity||1),t.unitValue=Number(t.unitValue||0),t.shipping=Number(t.shipping||0),t.productionTime=Number(t.productionTime||0),t.material=Number(t.material||0),t.totalSale=t.quantity*t.unitValue,t.totalWithShipping=t.totalSale+t.shipping}function qe(t,e){const n=a.orders.find(s=>s.id===t);!n||z(n)===e||(n.orderStatus=e,n.history.unshift({at:q(new Date),text:`Status alterado para ${e}`}),R(),F())}async function It(t){return new Promise(e=>{if(!t.type.startsWith("image/")){const s=new FileReader;s.onload=()=>e(s.result),s.readAsDataURL(t);return}const n=new FileReader;n.onload=s=>{const r=new Image;r.onload=()=>{const o=document.createElement("canvas");let i=r.width,d=r.height;const l=600;(i>l||d>l)&&(i>d?(d=Math.round(d*l/i),i=l):(i=Math.round(i*l/d),d=l)),o.width=i,o.height=d,o.getContext("2d").drawImage(r,0,0,i,d),e(o.toDataURL("image/jpeg",.6))},r.src=s.target.result},n.readAsDataURL(t)})}function je(t){const e=a.orders.find(r=>r.id===t);if(!e)return;const n=`Pedido ${e.id}
Cliente: ${e.client}
Produto: ${e.product}
Quantidade: ${e.quantity}
Total: ${x(e.totalWithShipping)}
Entrega: ${nt(e.delivery)}
Rastreio: ${e.tracking||"Pendente"}
Observacoes: ${e.notes||""}`,s=window.open("","_blank","noopener");s.document.write(`<pre style="font:16px system-ui;white-space:pre-wrap">${v(n)}</pre>`),s.print()}function Ve(){const t=new Blob([JSON.stringify({orders:a.orders,expenses:a.expenses,columns:xt},null,2)],{type:"application/json"}),e=URL.createObjectURL(t),n=document.createElement("a");n.href=e,n.download="meu-pet-em-arte-pedidos.json",n.click(),URL.revokeObjectURL(e)}function ze(){const t={app:"Meu Pet em Arte",version:1,createdAt:new Date().toISOString(),orders:a.orders,expenses:a.expenses,importBatches:J("import_batches",[]),theme:localStorage.getItem("mpa:theme_v2")||"light",columns:xt},e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=`backup-meu-pet-em-arte-${new Date().toISOString().slice(0,10)}.json`,s.click(),URL.revokeObjectURL(n)}async function _e(t){try{const e=JSON.parse(await t.text());if(!Array.isArray(e.orders))throw new Error("Arquivo de backup invalido: pedidos nao encontrados.");const n=Array.isArray(e.expenses)?e.expenses.length:0;if(!window.confirm(`Restaurar backup com ${e.orders.length} pedidos e ${n} despesas? Os dados atuais serao substituidos.`))return;a.orders=e.orders,a.expenses=Array.isArray(e.expenses)?e.expenses:[],a.importRows=[],a.importFileName="",a.importSummary="",a.query="",a.statusFilter="Todos",a.page=1,localStorage.setItem("mpa:orders_v2",JSON.stringify(a.orders)),localStorage.setItem("mpa:expenses_v1",JSON.stringify(a.expenses)),localStorage.setItem("mpa:import_batches",JSON.stringify(Array.isArray(e.importBatches)?e.importBatches:[])),e.theme&&localStorage.setItem("mpa:theme_v2",e.theme),document.body.classList.toggle("dark",e.theme==="dark"),F(),j("dashboard")}catch(e){window.alert(e.message||"Nao foi possivel restaurar o backup.")}}function Ue(){window.confirm("Zerar todos os pedidos e historicos de importacao? Use isso apenas antes de uma importacao limpa.")&&(a.orders=[],a.expenses=[],a.importRows=[],a.importFileName="",a.importSummary="Sistema zerado. Agora voce pode importar uma planilha limpa.",a.query="",a.statusFilter="Todos",a.page=1,localStorage.setItem("mpa:orders_v2",JSON.stringify([])),localStorage.setItem("mpa:expenses_v1",JSON.stringify([])),localStorage.removeItem("mpa:import_batches"),F(),j("import"))}function We(t){const e=a.orders.find(r=>r.id===t);if(!e||!window.confirm(`Excluir o pedido ${e.id} de ${e.client}? Essa acao nao pode ser desfeita.`))return;a.orders=a.orders.filter(r=>r.id!==t),a.selectedOrder=null,R(),F();const s=document.getElementById("detailModal");s.open&&s.close(),j("orders")}function Je(t){a.expenses=a.expenses.filter(e=>e.id!==t),yt(),F(),j("expenses")}function He(){a.orders=ct(),a.expenses=wt(),a.importRows=[],a.importFileName="",a.importSummary="",a.query="",a.statusFilter="Todos",a.page=1,localStorage.setItem("mpa:orders_v2",JSON.stringify(a.orders)),localStorage.setItem("mpa:expenses_v1",JSON.stringify(a.expenses)),localStorage.removeItem("mpa:import_batches"),F(),j("dashboard")}function Qe(){a.expenses=wt(),yt(),F(),j("expenses")}function Ge(){const t=[xt.join(";"),["Cliente Exemplo","Chaveiro pet premium","1","89,90","89,90","14,90","104,80","Pix","26/05/2026","30/05/2026","BR000000000BR","Novo Pedido","3,5","24"].join(";")].join(`
`),e=new Blob([t],{type:"text/csv;charset=utf-8"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download="modelo-importacao-meu-pet-em-arte.csv",s.click(),URL.revokeObjectURL(n)}function Xe(){var n,s,r;document.body.addEventListener("click",o=>{var l,c,m,p,f,k,w,N,h,S,y,P,C,$;const i=o.target.closest(".kanban-card")||o.target.closest(".kanban-card-new")||o.target.closest(".kanban-group-card");if(i&&!o.target.closest("button")&&!o.target.closest("select")&&!o.target.closest("input")){Y(i.dataset.order);return}const d=o.target.closest("button");if(d){if(d.id==="exportReportBtn"){const{start:g,end:I}=Xt(a.reportPeriod),B=Ft(g,I,a.reportProduct),E=["ID","Cliente","Produto","Quantidade","Faturamento","Frete","Data","Status"],D=B.map(T=>[T.id,T.client,T.product,T.quantity,T.totalSale.toFixed(2),T.shipping.toFixed(2),T.date,T.status]),H="data:text/csv;charset=utf-8,\uFEFF"+[E.join(";"),...D.map(T=>T.join(";"))].join(`
`),V=encodeURI(H),L=document.createElement("a");L.setAttribute("href",V),L.setAttribute("download",`relatorio-${a.reportPeriod}-${a.reportProduct}.csv`),document.body.appendChild(L),L.click(),document.body.removeChild(L);return}if(d.dataset.deleteStatus){const g=d.dataset.deleteStatus,I=a.orders.filter(E=>E.status===g).length;let B=`Excluir a coluna "${g}"?`;if(I>0){const E=a.productionStatuses.find(D=>D!==g)||"Recebido";B+=` Os ${I} pedidos nesta coluna serão movidos para a coluna ativa "${E}".`}if(window.confirm(B)){if(I>0){const E=a.productionStatuses.find(D=>D!==g)||"Recebido";a.orders.forEach(D=>{D.status===g&&(D.status=E,D.history.unshift({at:q(new Date),text:`Status movido para ${E} devido à exclusão da coluna ${g}`}))}),R()}a.productionStatuses=a.productionStatuses.filter(E=>E!==g),_t(),F()}return}if(d.id==="addColBtn"){const g=window.prompt("Digite o nome da nova coluna de produção:");if(g&&g.trim()){const I=g.trim();a.productionStatuses.includes(I)?window.alert("Esta coluna já existe!"):(a.productionStatuses.push(I),_t(),F())}return}if(d.dataset.view&&(j(d.dataset.view),F()),d.dataset.openOrder!==void 0&&document.getElementById("orderModal").showModal(),d.dataset.detail&&Y(d.dataset.detail),d.dataset.toggleDetailEdit!==void 0&&(a.detailEditMode=!0,a.selectedOrder&&Y(a.selectedOrder)),d.dataset.cancelDetailEdit!==void 0&&(a.detailEditMode=!1,a.selectedOrder&&Y(a.selectedOrder)),d.dataset.saveDetailInfo){const g=a.orders.find(E=>E.id===d.dataset.saveDetailInfo);if(!g)return;const I=String(((l=document.getElementById("detailProduct"))==null?void 0:l.value)||g.product),B=a.products.find(E=>E.name===I);g.petName=String(((c=document.getElementById("detailPetName"))==null?void 0:c.value)||"").trim(),g.petNames=Mt(((m=document.getElementById("detailPetNames"))==null?void 0:m.value)||"",g.quantity,g.petName||pt(g.client)),g.client=String(((p=document.getElementById("detailClient"))==null?void 0:p.value)||"").trim()||g.client,g.whatsapp=String(((f=document.getElementById("detailWhatsapp"))==null?void 0:f.value)||"").trim(),g.product=I,g.quantity=Number(((k=document.getElementById("detailQuantity"))==null?void 0:k.value)||g.quantity||1),g.shipping=Number(((w=document.getElementById("detailShipping"))==null?void 0:w.value)||g.shipping||0),g.payment=String(((N=document.getElementById("detailPayment"))==null?void 0:N.value)||g.payment),g.date=String(((h=document.getElementById("detailDate"))==null?void 0:h.value)||g.date),g.delivery=String(((S=document.getElementById("detailDelivery"))==null?void 0:S.value)||g.delivery),g.tracking=String(((y=document.getElementById("detailTracking"))==null?void 0:y.value)||"").trim(),g.orderStatus=String(((P=document.getElementById("detailWorkflowStatus"))==null?void 0:P.value)||z(g)),g.priority=String(((C=document.getElementById("detailPriority"))==null?void 0:C.value)||g.priority||"Média"),B&&(g.unitValue=B.unitValue),Bt(g),g.history.unshift({at:q(new Date),text:"Informações do pedido atualizadas"}),R(),a.detailEditMode=!1,Y(g.id)}if(d.dataset.page&&(a.page=Number(d.dataset.page),tt()),d.dataset.sort&&(a.sortDirection=a.sortKey===d.dataset.sort&&a.sortDirection==="asc"?"desc":"asc",a.sortKey=d.dataset.sort,tt()),d.dataset.print&&je(d.dataset.print),d.dataset.toggleView!==void 0&&(a.viewMode=a.viewMode==="list"?"cards":"list",a.compactCards=a.viewMode==="cards",localStorage.setItem("mpa:orders_view_mode",a.viewMode),localStorage.setItem("mpa:orders_compact_layout",JSON.stringify(a.compactCards)),tt()),d.dataset.toggleProductionGroup){const g=d.dataset.toggleProductionGroup;a.expandedProductionGroups[g]=!a.expandedProductionGroups[g],Q()}if(d.dataset.deleteOrder&&We(d.dataset.deleteOrder),d.dataset.deleteExpense&&Je(d.dataset.deleteExpense),d.dataset.deleteProductIndex!==void 0){const g=Number(d.dataset.deleteProductIndex);window.confirm(`Excluir o produto "${a.products[g].name}"?`)&&(a.productEditorIndex===g?a.productEditorIndex=null:a.productEditorIndex!==null&&a.productEditorIndex>g&&(a.productEditorIndex-=1),a.products.splice(g,1),jt(),F(),$t())}if(d.dataset.startProductEdit!==void 0&&ge(Number(d.dataset.startProductEdit)),d.dataset.cancelProductEdit!==void 0&&he(),d.dataset.copy!==void 0&&(($=navigator.clipboard)==null||$.writeText(d.dataset.copy||"Rastreio pendente")),d.dataset.closeDetail!==void 0&&document.getElementById("detailModal").close(),d.dataset.closeDetail!==void 0&&(a.detailEditMode=!1),d.dataset.saveNotes){const g=a.orders.find(I=>I.id===d.dataset.saveNotes);g.notes=document.getElementById("detailNotes").value,g.history.unshift({at:q(new Date),text:"Observacoes atualizadas"}),R(),Y(g.id)}}}),document.body.addEventListener("input",o=>{if(o.target.id==="shippingSearch"&&(a.shippingSearch=o.target.value,st()),o.target.dataset.shippingTracking){const i=a.orders.find(d=>d.id===o.target.dataset.shippingTracking);i&&(i.tracking=o.target.value,R())}o.target.id==="orderSearch"&&(a.query=o.target.value,a.page=1,tt()),o.target.id==="productionSearch"&&(a.productionSearch=o.target.value,Q())}),document.body.addEventListener("change",async o=>{if(o.target.id==="statusFilter"&&(a.statusFilter=o.target.value,a.page=1,tt()),o.target.id==="productionStatusFilter"&&(a.productionFilter=o.target.value,Q()),o.target.id==="productionDateSort"&&(a.productionDateSort=o.target.value,Q()),o.target.id==="productionPriorityFilter"&&(a.productionPriorityFilter=o.target.value,Q()),o.target.id==="reportPeriodSelect"&&(a.reportPeriod=o.target.value,renderReports()),o.target.id==="reportCompareSelect"&&(a.reportCompare=o.target.value,renderReports()),o.target.id==="reportProductSelect"&&(a.reportProduct=o.target.value,renderReports()),o.target.dataset.status&&qe(o.target.dataset.status,o.target.value),o.target.dataset.assignResp){const i=a.orders.find(d=>d.id===o.target.dataset.assignResp);if(!i)return;i.responsible=o.target.value,i.history.unshift({at:q(new Date),text:`Responsável atribuído: ${o.target.value}`}),R(),Q()}if(o.target.dataset.productionStep&&o.target.dataset.productionOrder){const i=a.orders.find(w=>w.id===o.target.dataset.productionOrder);if(!i)return;const d=o.target.dataset.productionStep,l=kt(d);if(!l)return;const c=Number(o.target.dataset.productionIndex),m=ot(i),p=Array.isArray(i[l.key])?i[l.key]:Array.from({length:m.length},()=>!1);p[c]=!!o.target.checked,i[l.key]=p;const f=m[c]||`Pet ${c+1}`;i.history.unshift({at:q(new Date),text:`${l.label} marcado para ${f} na etapa ${d}`}),R();const k=a.orders.filter(w=>bt(w.client)===bt(i.client)&&w.status===d);ke(k,d),Q()}if(o.target.dataset.edit){const i=a.orders.find(c=>c.id===o.target.dataset.edit);if(!i)return;const d=o.target.dataset.field,l=i.product;if(i[d]=o.target.type==="number"?Number(o.target.value):o.target.value,d==="product"&&l!==i.product){const c=a.products.find(m=>m.name===i.product);c&&(i.unitValue=c.unitValue)}Bt(i),i.history=i.history||[],i.history.unshift({at:q(new Date),text:`Campo ${d} atualizado`}),R(),F()}if(o.target.dataset.expenseEdit){const i=a.expenses.find(l=>l.id===o.target.dataset.expenseEdit);if(!i)return;const d=o.target.dataset.field;i[d]=o.target.type==="number"?Number(o.target.value):o.target.value,yt(),F(),j("expenses")}if(o.target.dataset.asset){const i=a.orders.find(l=>l.id===o.target.dataset.asset),d=o.target.files[0];if(!d)return;i[o.target.dataset.field]=await It(d),i[`${o.target.dataset.field}Name`]=d.name,i.history.unshift({at:q(new Date),text:"Imagem adicionada ao pedido"}),R(),Y(i.id)}if(o.target.dataset.assetMulti!==void 0){const i=a.orders.find(m=>m.id===o.target.dataset.assetMulti),d=Number(o.target.dataset.assetIndex),l=o.target.files[0];if(!l)return;i.petPhotos||(i.petPhotos=[i.petPhoto||""]);const c=await It(l);i.petPhotos[d]=c,d===0&&(i.petPhoto=c),i.history.unshift({at:q(new Date),text:"Foto do pet atualizada"}),R(),Y(i.id)}if(o.target.id==="spreadsheetInput"){const i=o.target.files[0];i&&await Jt(i)}if(o.target.id==="restoreBackupInput"){const i=o.target.files[0];i&&await _e(i),o.target.value=""}}),document.body.addEventListener("dragstart",o=>{const i=o.target.closest(".kanban-card")||o.target.closest(".kanban-card-new")||o.target.closest(".kanban-group-card");if(!i)return;const d={type:i.dataset.groupKey?"group":"order",orderId:i.dataset.order,groupKey:i.dataset.groupKey||"",status:i.dataset.status||""};o.dataTransfer.setData("text/plain",JSON.stringify(d)),o.dataTransfer.effectAllowed="move"}),document.body.addEventListener("dragover",o=>{const i=o.target.closest(".kanban-column-body")||o.target.closest(".kanban-column-body-new");if(i){o.preventDefault(),i.classList.add("drag-over");return}o.target.closest("#uploadZone")&&(o.preventDefault(),o.target.closest("#uploadZone").classList.add("dragging"))}),document.body.addEventListener("dragleave",o=>{const i=o.target.closest(".kanban-column-body")||o.target.closest(".kanban-column-body-new");if(i){i.classList.remove("drag-over");return}o.target.closest("#uploadZone")&&(o.preventDefault(),o.target.closest("#uploadZone").classList.remove("dragging"))}),document.body.addEventListener("drop",async o=>{const i=o.target.closest(".kanban-column-body")||o.target.closest(".kanban-column-body-new");if(i){o.preventDefault(),i.classList.remove("drag-over");const c=i.dataset.status;let m=null;try{m=JSON.parse(o.dataTransfer.getData("text/plain")||"{}")}catch{}if(!m||!c)return;if(m.type==="group"){const p=a.orders.filter(f=>bt(f.client)===m.groupKey&&f.status===m.status);if(!p.length||m.status===c)return;p.forEach(f=>{f.status=c,delete f.orderStatus,c==="Entregue"&&!f.actualDelivery&&(f.actualDelivery=new Date().toISOString().slice(0,10)),f.history=f.history||[],f.history.unshift({at:q(new Date),text:`Grupo movido para ${c} via quadro`})}),R(),Q(),typeof st=="function"&&st(),tt()}else if(m.orderId){const p=a.orders.find(f=>f.id===m.orderId);p&&c&&p.status!==c&&(p.status=c,delete p.orderStatus,c==="Entregue"&&!p.actualDelivery&&(p.actualDelivery=new Date().toISOString().slice(0,10)),p.history=p.history||[],p.history.unshift({at:q(new Date),text:`Status movido para ${c} via quadro`}),R(),Q(),typeof st=="function"&&st(),tt())}return}const d=o.target.closest("#uploadZone");if(!d)return;o.preventDefault(),d.classList.remove("dragging");const l=o.dataTransfer.files[0];l&&await Jt(l)});function t(){var h,S,y;const o=document.getElementById("orderForm");if(!o)return;const i=((h=o.petName)==null?void 0:h.value)||"",d=((S=o.petNames)==null?void 0:S.value)||"",l=((y=o.client)==null?void 0:y.value)||"",c=Mt(d||i,1,i||pt(l)),m=document.getElementById("petPhotosContainer");if(!m)return;const f=Array.from(m.querySelectorAll(".dynamic-pet-photo")).map(P=>P.dataset.url),w=Array.from(m.querySelectorAll(".dynamic-pet-qty")).map(P=>P.value);m.innerHTML="";let N=0;c.forEach((P,C)=>{const $=document.createElement("div");$.className="pet-photo-group",$.style="display:flex; flex-direction:column; gap:4px; padding: 12px; border: 1px dashed var(--line); border-radius: 8px;",$.dataset.name=P;const g=document.createElement("div");g.style="display:flex; justify-content:space-between; align-items:center; gap:8px;";const I=document.createElement("strong");I.textContent=`Pet: ${P}`,I.style.fontSize="0.95rem";const B=document.createElement("div");B.style="display:flex; align-items:center; gap:6px;";const E=document.createElement("label");E.textContent="Qtd:",E.style.fontSize="0.85rem",E.style.margin="0";const D=document.createElement("input");D.type="number",D.min="1",D.className="dynamic-pet-qty",D.style="width: 60px; padding: 4px; font-size: 0.9rem;";const H=Number(w[C])||1;D.value=H,N+=H,B.appendChild(E),B.appendChild(D),g.appendChild(I),g.appendChild(B);const V=document.createElement("input");V.type="file",V.accept="image/*",V.className="dynamic-pet-photo",V.dataset.index=C,V.style.marginTop="6px",f[C]&&(V.dataset.url=f[C]);const L=document.createElement("div");L.className="asset-preview empty",L.style="display:none; min-height:120px; max-height:120px; margin-top:8px;",f[C]&&(L.style.backgroundImage=`url('${f[C]}')`,L.style.display="block",L.classList.remove("empty")),V.addEventListener("change",async T=>{const K=T.target.files[0];if(K){const et=await It(K);L.style.backgroundImage=`url('${et}')`,L.style.display="block",L.classList.remove("empty"),V.dataset.url=et}else L.style.display="none",delete V.dataset.url}),D.addEventListener("input",()=>{const K=Array.from(m.querySelectorAll(".dynamic-pet-qty")).reduce((et,rt)=>et+(Number(rt.value)||1),0);o.quantity&&(o.quantity.value=K)}),$.appendChild(g),$.appendChild(V),$.appendChild(L),m.appendChild($)}),o.quantity&&(o.quantity.value=N||1)}const e=document.getElementById("orderForm");e&&((n=e.petName)==null||n.addEventListener("input",t),(s=e.petNames)==null||s.addEventListener("input",t),(r=e.client)==null||r.addEventListener("input",t)),document.getElementById("newOrderButton").addEventListener("click",()=>{document.getElementById("orderForm").reset(),t(),document.getElementById("orderModal").showModal()}),document.getElementById("closeOrderModal").addEventListener("click",()=>document.getElementById("orderModal").close()),document.getElementById("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark"),localStorage.setItem("mpa:theme_v2",document.body.classList.contains("dark")?"dark":"light")}),document.body.addEventListener("click",o=>{if(o.target.id==="confirmImport"&&Ae(),o.target.id==="downloadTemplate"&&Ge(),o.target.id==="wipeSystemData"&&Ue(),o.target.id==="restoreAutoBackupBtn"&&re(),o.target.id==="exportJson"&&Ve(),o.target.id==="downloadBackup"&&ze(),o.target.id==="resetDemo"&&He(),o.target.id==="resetExpenseExamples"&&Qe(),o.target.id==="clearImport"&&(a.importRows=[],a.importFileName="",a.importSummary="",Rt()),o.target.dataset.deleteShipping){const i=o.target.dataset.deleteShipping;i&&a.shippingRates&&a.shippingRates[i]!==void 0&&(delete a.shippingRates[i],Vt(),F())}o.target.dataset.productionSort&&(a.productionSortKey=o.target.dataset.productionSort,a.productionSortDirection=a.productionSortDirection==="asc"?"desc":"asc",Q())}),document.getElementById("orderForm").addEventListener("submit",async o=>{o.preventDefault();const i=o.currentTarget,d=Object.fromEntries(new FormData(i)),l=a.products.find(h=>h.name===d.product)||a.products[0];let c=0;d.shippingUF&&a.shippingRates&&a.shippingRates[d.shippingUF]!==void 0&&(c=Number(a.shippingRates[d.shippingUF]));const m=a.productionStatuses[0]||"Recebido",p=X(d.client,d.whatsapp,d.product,1,l.unitValue,c,d.payment,0,5,m,d.tracking,l.name.includes("Combo")?4.8:3.2,l.name.includes("Combo")?38:22,d.notes);p.date=d.date||"",p.actualDelivery="",p.shippingExpenseId="",p.shippingExpenseName="",p.shippingUF=d.shippingUF||"",p.shippingExcludedFromReport=!0,p.petName=String(d.petName||"").trim(),p.orderStatus="Novo Pedido";let f=0;const k=[],w=[],N=Array.from(document.querySelectorAll(".pet-photo-group"));if(N.length)for(const h of N){const S=h.querySelector(".dynamic-pet-photo"),y=h.querySelector(".dynamic-pet-qty"),P=h.dataset.name||"Pet",C=Number(y.value)||1,$=S.dataset.url||"";f+=C;for(let g=0;g<C;g++)k.push(P),w.push($)}else f=1,k.push(p.petName||pt(p.client)),w.push("");p.petNames=k,p.petPhotos=w,p.petPhoto=p.petPhotos[0]||"",p.quantity=f,p.totalSale=p.quantity*p.unitValue,p.totalWithShipping=p.totalSale+p.shipping,a.orders.unshift(p),R(),i.reset(),document.getElementById("orderModal").close(),j("orders"),F()}),document.body.addEventListener("submit",o=>{if(o.target.id==="expenseForm"){o.preventDefault();const i=Object.fromEntries(new FormData(o.target));a.expenses.unshift({id:ie(),name:i.name,category:i.category,amount:Number(i.amount||0),date:i.date,notes:i.notes||""}),yt(),o.target.reset(),F(),j("expenses")}if(o.target.id==="shippingRatesForm"){o.preventDefault();const i=Object.fromEntries(new FormData(o.target)),d=String(i.uf||"").trim().toUpperCase(),l=Number(i.rate||0);if(!d)return window.alert("Informe o estado (UF).");a.shippingRates=a.shippingRates||{},a.shippingRates[d]=l,Vt(),o.target.reset(),F(),j("expenses")}if(o.target.id==="productForm"){o.preventDefault();const i=Object.fromEntries(new FormData(o.target)),d=String(i.name||"").trim(),l=i.productIndex!==""?Number(i.productIndex):null;if(!d){window.alert("Informe o nome do produto.");return}if(a.products.some((m,p)=>p!==l&&m.name.trim().toLowerCase()===d.toLowerCase())){window.alert("Já existe um produto com esse nome.");return}const c={name:d,unitValue:Number(i.unitValue||0),cost:Number(i.cost||0)};if(Number.isInteger(l)&&a.products[l]){const m=a.products[l].name;a.products[l]=c,m!==c.name&&(a.orders.forEach(p=>{p.product===m&&(p.product=c.name)}),a.reportProduct===m&&(a.reportProduct=c.name),R())}else a.products.push(c);jt(),a.productEditorIndex=null,o.target.reset(),F(),$t(),j("products")}})}function $t(){const t=document.querySelector("[name='product']");t&&(t.innerHTML=a.products.map(n=>`<option value="${n.name}">${n.name} - ${x(n.unitValue)}</option>`).join(""));const e=document.querySelector("[name='shippingUF']");e&&(e.innerHTML='<option value="">Selecione um Estado</option>'+Object.entries(a.shippingRates||{}).map(([n,s])=>`<option value="${n}">${n} - ${x(s)}</option>`).join(""))}async function Ke(){try{await vt.init();let t=await vt.get("orders_v2");t||(t=J("orders_v2",null),t?await vt.set("orders_v2",t):t=typeof ct=="function"?ct():[]),a.orders=t}catch(t){console.error("IndexedDB error, falling back to localStorage",t),a.orders=J("orders_v2",typeof ct=="function"?ct():[])}localStorage.getItem("mpa:theme_v2")==="dark"&&document.body.classList.add("dark"),$t(),Xe(),F(),j("dashboard"),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch(()=>{})}Ke();function st(){a.shippingSearch=a.shippingSearch||"",a.shippingStatuses=a.shippingStatuses||["Pronto","Postagem","Enviado","Entregue"];const t=String(a.shippingSearch||"").trim().toLowerCase();let e=a.orders.filter(r=>a.shippingStatuses.includes(r.status));t&&(e=e.filter(r=>{const o=r.petName||(r.client||"").split(" ")[0]||"";return`${r.id} ${r.client} ${r.product} ${o} ${r.tracking}`.toLowerCase().includes(t)})),e.sort((r,o)=>(r.date||"9999").localeCompare(o.date||"9999"));const n=a.shippingStatuses.reduce((r,o)=>({...r,[o]:[]}),{});e.forEach(r=>{n[r.status]||(n[r.status]=[]),n[r.status].push(r)});const s=[{bg:"#dcfce7",text:"#15803d",border:"#bbf7d0"},{bg:"#fef3c7",text:"#b45309",border:"#fcd34d"},{bg:"#e0e7ff",text:"#4338ca",border:"#c7d2fe"},{bg:"#dbeafe",text:"#1d4ed8",border:"#bfdbfe"}];document.getElementById("shippingView").innerHTML=`
    <div class="panel production-panel">
      <div class="production-header-section">
        <div class="title-area">
          <h2>Controle de Envio</h2>
          <p class="muted">Acompanhe a logística e os despachos dos pedidos concluídos. 📦</p>
        </div>
        <div class="production-toolbar-new">
          <div class="search-wrap">
            <span class="search-icon-new">🔍</span>
            <input id="shippingSearch" class="search-input-new" placeholder="Buscar envio..." value="${v(a.shippingSearch)}" />
          </div>
        </div>
      </div>

      <div class="kanban-board-new">
        ${a.shippingStatuses.map((r,o)=>{const i=n[r]||[],d=s[o%s.length];return`
            <section class="kanban-column-new">
              <div class="kanban-column-head-new" style="background-color: ${d.bg}; color: ${d.text}; border-bottom: 2px solid ${d.border}">
                <div class="column-title-wrap">
                  <span class="column-index">${o+1}.</span>
                  <h3 class="column-name">${r.toUpperCase()}</h3>
                </div>
                <span class="column-count-badge">${i.length}</span>
              </div>
              <div class="kanban-column-body-new" data-status="${r}">
                ${i.map(l=>{const c=l.petName||(l.client||"").split(" ")[0]||"-",m=l.petPhoto?`style="background-image:url('${l.petPhoto}')"`:"";return`
                    <article class="kanban-group-card" draggable="true" data-order="${l.id}" data-status="${r}">
                      <div class="kanban-group-primary" style="padding-top:12px;">
                        <div class="kanban-card-keychain-container">
                          <div class="keychain-link-ring"></div>
                          <div class="keychain-link-chain"></div>
                          <div class="kanban-card-photo" ${m}></div>
                        </div>
                        <div class="kanban-card-info-wrap" style="width: 100%;">
                          <div class="kanban-card-top-row">
                            <span class="kanban-card-id">#${l.id.split("-").pop()||l.id}</span>
                            <button class="kanban-card-menu-btn" data-detail="${l.id}" type="button">⋮</button>
                          </div>
                          <h4 class="kanban-card-pet-name">${v(c)}</h4>
                          <p class="kanban-card-breed">${v(l.client)}</p>
                          <div class="kanban-card-meta-new" style="margin-top:8px;">
                            <input class="cell-input tracking-input" style="width:100%;font-size:0.8rem;padding:4px;" placeholder="Código de rastreio" data-shipping-tracking="${l.id}" value="${v(l.tracking||"")}" />
                          </div>
                        </div>
                      </div>
                    </article>
                  `}).join("")}
              </div>
            </section>
          `}).join("")}
      </div>
    </div>
  `}
