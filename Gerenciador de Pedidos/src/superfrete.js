/**
 * SuperFrete API Integration Module
 * 
 * API Reference: https://superfrete.readme.io/reference/primeiros-passos
 * 
 * Environments:
 *   Production: https://api.superfrete.com
 *   Sandbox:    https://sandbox.superfrete.com
 * 
 * All requests go through the Vite proxy to avoid CORS:
 *   /superfrete-api   → https://api.superfrete.com
 *   /superfrete-sandbox → https://sandbox.superfrete.com
 */

// ─── Configuration ────────────────────────────────────────────────────────────

const PROXY_PRODUCTION = '/superfrete-api';
const PROXY_SANDBOX = '/superfrete-sandbox';

function getConfig() {
  try {
    const raw = localStorage.getItem('mpa:superfrete_config');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveConfig(config) {
  localStorage.setItem('mpa:superfrete_config', JSON.stringify(config));
}

function getBaseUrl() {
  const config = getConfig();
  return config.sandbox ? PROXY_SANDBOX : PROXY_PRODUCTION;
}

function getToken() {
  const config = getConfig();
  return config.token || '';
}

function getHeaders() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'accept': 'application/json',
    'content-type': 'application/json',
    'User-Agent': 'MeuPetEmArte/1.0 (gerenciador@meupet.com)'
  };
}

// ─── Quote (Cotação de Frete) ─────────────────────────────────────────────────

/**
 * Calculate shipping quotes.
 * POST /api/v0/calculator
 * 
 * @param {Object} params
 * @param {string} params.cepOrigem - Origin ZIP (8 digits, no dash)
 * @param {string} params.cepDestino - Destination ZIP (8 digits, no dash)
 * @param {number} params.peso - Weight in kg (e.g. 0.03 for 30g)
 * @param {number} params.altura - Height in cm
 * @param {number} params.largura - Width in cm
 * @param {number} params.comprimento - Length in cm
 * @returns {Promise<Array>} Array of shipping options
 */
export async function calcularFrete({ cepOrigem, cepDestino, peso, altura, largura, comprimento }) {
  const base = getBaseUrl();
  const url = `${base}/api/v0/calculator`;

  const body = {
    from: { postal_code: String(cepOrigem).replace(/\D/g, '') },
    to: { postal_code: String(cepDestino).replace(/\D/g, '') },
    package: {
      height: altura,
      width: largura,
      length: comprimento,
      weight: peso
    },
    services: "1,2,17,31,33" // 1=PAC, 2=SEDEX, 17=Mini Envios, 31/33=LOGGI
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Erro ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    // The API returns an array of options. Filter only valid ones (no errors).
    if (!Array.isArray(data)) return [];

    return data
      .filter(item => !item.error && item.has_error !== true)
      .map(item => ({
        id: item.id,
        name: item.name || item.company?.name || 'Desconhecido',
        company: item.company?.name || '',
        companyPicture: item.company?.picture || '',
        price: Number(item.price) || 0,
        discount: Number(item.discount) || 0,
        deliveryMin: item.delivery_range?.min || item.delivery_min || item.delivery_time || 0,
        deliveryMax: item.delivery_range?.max || item.delivery_max || item.delivery_time || 0,
        currency: item.currency || 'R$',
        serviceId: item.id,
        raw: item
      }));
  } catch (err) {
    console.error('[SuperFrete] Erro na cotação:', err);
    throw err;
  }
}

function formatSuperfreteError(errData, status, statusText) {
  if (!errData) return `Erro ${status}: ${statusText}`;
  
  const parts = [];
  if (errData.errors && typeof errData.errors === 'object') {
    for (const [key, val] of Object.entries(errData.errors)) {
      const msg = Array.isArray(val) ? val.join(', ') : String(val);
      const friendlyKey = key
        .replace(/^to\./, 'Destinatário > ')
        .replace(/^from\./, 'Remetente > ')
        .replace('state_abbr', 'UF/Estado')
        .replace('postal_code', 'CEP')
        .replace('document', 'CPF/CNPJ')
        .replace('volumes', 'Dimensões/Volumes')
        .replace('address', 'Endereço')
        .replace('number', 'Número');
      parts.push(`${friendlyKey}: ${msg}`);
    }
  }

  if (parts.length > 0) {
    return parts.join(' | ');
  }

  return errData.message || errData.error || `Erro ${status}: ${statusText}`;
}

// ─── Cart (Criar Frete / Adicionar ao Carrinho) ──────────────────────────────

/**
 * Create a shipping order (add to cart).
 * POST /api/v0/cart
 * 
 * @param {Object} params
 * @param {Object} params.from - Sender data
 * @param {Object} params.to - Recipient data
 * @param {Object} params.service - Shipping service details
 * @param {Object} params.package - Package dimensions
 * @param {Object} [params.options] - Additional options
 * @returns {Promise<Object>} Cart item with order ID
 */
export async function criarFrete({
  from = {}, to = {}, service, package: pkg, products, options, tag
}) {
  const base = getBaseUrl();
  const url = `${base}/api/v0/cart`;

  const volumeItem = {
    height: Number(pkg?.height || 2),
    width: Number(pkg?.width || 12),
    length: Number(pkg?.length || 18),
    weight: Number(pkg?.weight || 0.03)
  };

  const body = {
    from: {
      name: from.name || 'Karoline Gonçalves Garcia',
      phone: String(from.phone || '11940878269').replace(/\D/g, ''),
      email: from.email || 'contato@meupetemarte.com.br',
      document: String(from.document || '').replace(/\D/g, ''),
      company_document: String(from.companyDocument || '').replace(/\D/g, ''),
      state_register: from.stateRegister || '',
      address: from.address || 'Rua Antônio João de Medeiros',
      complement: from.complement || 'Casa 83',
      number: from.number || '700A',
      district: from.district || 'Itaim Paulista',
      city: from.city || 'São Paulo',
      state_abbr: (from.stateAbbr || from.state_abbr || 'SP').toUpperCase().trim(),
      country_id: from.countryId || 'BR',
      postal_code: String(from.postalCode || from.postal_code || '08140060').replace(/\D/g, ''),
      note: from.note || ''
    },
    to: {
      name: to.name || '',
      phone: String(to.phone || '11999999999').replace(/\D/g, ''),
      email: to.email || 'contato@meupetemarte.com.br',
      document: String(to.document || '').replace(/\D/g, ''),
      company_document: String(to.companyDocument || '').replace(/\D/g, ''),
      state_register: to.stateRegister || '',
      address: to.address || '',
      complement: to.complement || '',
      number: to.number || 'S/N',
      district: to.district || 'Centro',
      city: to.city || '',
      state_abbr: (to.stateAbbr || to.state_abbr || 'SP').toUpperCase().trim(),
      country_id: to.countryId || 'BR',
      postal_code: String(to.postalCode || to.postal_code || '').replace(/\D/g, ''),
      note: to.note || ''
    },
    service: service || 1,
    package: volumeItem,
    volumes: [volumeItem],
    options: options || {
      insurance_value: 0,
      receipt: false,
      own_hand: false,
      reverse: false,
      non_commercial: true,
      platform: 'MeuPetEmArte'
    },
    products: (products && products.length ? products : [
      {
        name: 'Chaveiro Pet Personalizado',
        quantity: 1,
        unitary_value: 69.90
      }
    ]).map(p => ({
      name: p.name || 'Chaveiro Pet Personalizado',
      quantity: Number(p.quantity) || 1,
      unitary_value: Number(p.unitary_value || p.unitaryValue || p.price || 69.90)
    })),
    tag: String(tag || '')
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(formatSuperfreteError(errData, res.status, res.statusText));
    }

    return await res.json();
  } catch (err) {
    console.error('[SuperFrete] Erro ao criar frete:', err);
    throw err;
  }
}

// ─── Checkout (Finalizar Pedido e Gerar Etiqueta) ─────────────────────────────

/**
 * Checkout and generate label.
 * POST /api/v0/checkout
 * 
 * @param {Object} params
 * @param {Array<string>} params.orders - Array of order IDs from cart
 * @returns {Promise<Object>} Checkout result with label info
 */
export async function finalizarPedido({ orders }) {
  const base = getBaseUrl();
  const url = `${base}/api/v0/checkout`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orders })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(formatSuperfreteError(errData, res.status, res.statusText));
    }

    return await res.json();
  } catch (err) {
    console.error('[SuperFrete] Erro no checkout:', err);
    throw err;
  }
}

// ─── Print Label (Link para Impressão) ────────────────────────────────────────

/**
 * Get print link for label.
 * POST /api/v0/tag/print
 * 
 * @param {Object} params
 * @param {Array<string>} params.orders - Array of order IDs
 * @returns {Promise<Object>} Print URL
 */
export async function imprimirEtiqueta({ orders }) {
  const base = getBaseUrl();
  const url = `${base}/api/v0/tag/print`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orders })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(formatSuperfreteError(errData, res.status, res.statusText));
    }

    return await res.json();
  } catch (err) {
    console.error('[SuperFrete] Erro ao gerar link de impressão:', err);
    throw err;
  }
}

// ─── Order Info (Informações do Pedido) ───────────────────────────────────────

/**
 * Get order/shipping info.
 * GET /api/v0/order/info/{orderId}
 * 
 * @param {string} orderId - The SuperFrete order ID
 * @returns {Promise<Object>} Order details including tracking and status
 */
export async function infosPedido(orderId) {
  const base = getBaseUrl();
  const cleanId = encodeURIComponent(String(orderId).trim());
  
  // Tenta o endpoint oficial /api/v0/order/info/{id}
  let url = `${base}/api/v0/order/info/${cleanId}`;

  try {
    let res = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    if (res.status === 404) {
      // Fallback para /api/v0/order/{id}
      url = `${base}/api/v0/order/${cleanId}`;
      res = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Erro ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error('[SuperFrete] Erro ao buscar info do pedido:', err);
    throw err;
  }
}

// ─── List Orders / Tags (Listar Etiquetas da Conta) ──────────────────────────

/**
 * List orders/labels from SuperFrete.
 * GET /api/v0/me/orders
 * 
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {string} [params.status] - pending, released, posted, delivered, canceled
 * @returns {Promise<Object>} Paginated labels list
 */
export async function listarEtiquetas({ page = 1, status = '' } = {}) {
  const base = getBaseUrl();
  const query = new URLSearchParams();
  if (page) query.append('page', String(page));
  if (status) query.append('status', status);

  const url = `${base}/api/v0/me/orders${query.toString() ? `?${query.toString()}` : ''}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Erro ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error('[SuperFrete] Erro ao listar etiquetas:', err);
    throw err;
  }
}

// ─── Direct Tracking Link Helper ─────────────────────────────────────────────

/**
 * Retorna o link oficial direto para acompanhamento do rastreio.
 * Detecta automaticamente se é Loggi ou Correios.
 * 
 * @param {string} trackingCode 
 * @returns {{ url: string, carrier: string }}
 */
export function obterLinkRastreio(trackingCode) {
  const code = String(trackingCode || '').trim();
  if (!code) return { url: '', carrier: '' };

  const isCorreios = /^[A-Za-z]{2}\d{9}[A-Za-z]{2}$/.test(code);
  if (isCorreios) {
    return {
      url: `https://rastreamento.correios.com.br/app/index.php?codigo=${encodeURIComponent(code)}`,
      carrier: 'Correios'
    };
  }

  // Se começar com SLG ou tiver formato alfanumérico padrão de transportadora (Loggi)
  const isLoggi = /^SLG/i.test(code) || /^[A-Z0-9]{8,20}$/i.test(code);
  if (isLoggi) {
    return {
      url: `https://www.loggi.com/rastreador/${encodeURIComponent(code)}`,
      carrier: 'Loggi'
    };
  }

  return {
    url: `https://linketrack.com/rastreio/${encodeURIComponent(code)}`,
    carrier: 'Transportadora'
  };
}

// ─── Cancel Order ─────────────────────────────────────────────────────────────

/**
 * Cancel a SuperFrete order.
 * POST /api/v0/order/cancel
 * 
 * @param {Object} params
 * @param {string} params.orderId - The SuperFrete order ID
 * @param {string} params.description - Reason for cancellation
 * @returns {Promise<Object>}
 */
export async function cancelarPedido({ orderId, description }) {
  const base = getBaseUrl();
  const url = `${base}/api/v0/order/cancel`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ order_id: orderId, description })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(formatSuperfreteError(errData, res.status, res.statusText));
    }

    return await res.json();
  } catch (err) {
    console.error('[SuperFrete] Erro ao cancelar pedido:', err);
    throw err;
  }
}

// ─── Utility Exports ──────────────────────────────────────────────────────────

export { getConfig, saveConfig };

