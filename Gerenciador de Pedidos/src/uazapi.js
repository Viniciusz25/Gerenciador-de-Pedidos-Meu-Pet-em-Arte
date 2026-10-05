/**
 * Módulo de Integração com UAZAPI (WhatsApp Gateway)
 * Loja: Meu Pet em Arte
 * 
 * Documentação UAZAPI: https://docs.uazapi.com
 */

// Chave do localStorage
export const STORAGE_KEY = 'mpa:uazapi_config';

/**
 * Obtém a configuração atual da UAZAPI salva no LocalStorage
 * @returns {Object}
 */
export function getUazapiConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      baseUrl: (parsed.baseUrl || '').replace(/\/+$/, ''), // remove barra final
      token: parsed.token || '',
      enabled: parsed.enabled ?? false,
      delayMs: Number(parsed.delayMs || 1200)
    };
  } catch (err) {
    console.error('[UAZAPI] Erro ao carregar configurações:', err);
    return { baseUrl: '', token: '', enabled: false, delayMs: 1200 };
  }
}

/**
 * Salva as configurações da UAZAPI no LocalStorage
 * @param {Object} config
 */
export function saveUazapiConfig(config) {
  const current = getUazapiConfig();
  const updated = {
    ...current,
    ...config,
    baseUrl: (config.baseUrl !== undefined ? config.baseUrl : current.baseUrl).trim().replace(/\/+$/, ''),
    token: (config.token !== undefined ? config.token : current.token).trim(),
    enabled: config.enabled !== undefined ? !!config.enabled : current.enabled,
    delayMs: Number(config.delayMs || current.delayMs || 1200)
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Formata e higieniza qualquer número de telefone brasileiro para o formato internacional aceito pelo WhatsApp
 * Exemplos:
 *  - "(11) 98765-4321" -> "5511987654321"
 *  - "11987654321" -> "5511987654321"
 *  - "5511987654321" -> "5511987654321"
 * 
 * @param {string|number} phone
 * @returns {string} Telefone normalizado com DDI 55
 */
export function formatWhatsAppNumber(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');

  if (!digits) return '';

  // Se já tem DDI (55) e tamanho compatível (12 ou 13 dígitos)
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }

  // DDD (2 dígitos) + Telefone (8 ou 9 dígitos) = 10 ou 11 dígitos
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  // Fallback se faltar DDI
  return digits.length >= 8 ? `55${digits}` : digits;
}

/**
 * Monta os cabeçalhos HTTP necessários para autenticação na UAZAPI
 * @param {string} token
 * @returns {Object}
 */
function getHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'token': token,
    'apikey': token,
    'admintoken': token,
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Testa a conexão com a instância da UAZAPI
 * @param {Object} [overrideConfig] Permite testar credenciais antes de salvar
 * @returns {Promise<{ success: boolean, message: string, details?: any }>}
 */
export async function testUazapiConnection(overrideConfig = null) {
  const cfg = overrideConfig || getUazapiConfig();

  if (!cfg.baseUrl) {
    throw new Error('A URL da instância UAZAPI não foi informada.');
  }
  if (!cfg.token) {
    throw new Error('O Token da instância UAZAPI não foi informado.');
  }

  // Tenta endpoints comuns de status da UAZAPI
  const endpointsToTry = ['/instance/status', '/status', '/instance/connect'];
  let lastError = null;

  for (const endpoint of endpointsToTry) {
    try {
      const url = `${cfg.baseUrl}${endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(cfg.token),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          success: true,
          message: 'Conectado à UAZAPI com sucesso!',
          details: data
        };
      } else if (res.status === 401 || res.status === 403) {
        throw new Error('Token ou chave de API inválida/não autorizada.');
      }
    } catch (err) {
      lastError = err;
      if (err.name === 'AbortError') {
        throw new Error('Tempo limite excedido (timeout) ao conectar na UAZAPI.');
      }
    }
  }

  throw new Error(lastError?.message || 'Não foi possível conectar à instância da UAZAPI. Verifique a URL e o Token.');
}

/**
 * Envia uma mensagem de texto simples pelo WhatsApp usando a UAZAPI
 * 
 * @param {Object} params
 * @param {string} params.number - Número do cliente (aceita formatos com máscara ou sem DDI)
 * @param {string} params.text - Mensagem a ser enviada
 * @param {number} [params.delay] - Tempo de simulação de digitação em milissegundos
 * @param {string} [params.replyid] - ID opcional de mensagem para responder
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function sendWhatsAppText({ number, text, delay, replyid }) {
  const cfg = getUazapiConfig();

  if (!cfg.enabled) {
    throw new Error('A integração com a UAZAPI está desativada nas configurações.');
  }
  if (!cfg.baseUrl || !cfg.token) {
    throw new Error('Configure a URL e o Token da UAZAPI antes de enviar mensagens.');
  }

  const formattedNumber = formatWhatsAppNumber(number);
  if (!formattedNumber || formattedNumber.length < 10) {
    throw new Error(`Número de WhatsApp inválido: "${number}".`);
  }

  if (!text || !text.trim()) {
    throw new Error('A mensagem não pode estar vazia.');
  }

  const endpoint = `${cfg.baseUrl}/send/text`;
  const payload = {
    number: formattedNumber,
    text: text.trim(),
    delay: delay !== undefined ? Number(delay) : cfg.delayMs
  };

  if (replyid) {
    payload.replyid = replyid;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getHeaders(cfg.token),
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg = data?.message || data?.error || `Erro HTTP ${res.status}: ${res.statusText}`;
      throw new Error(`Falha no envio UAZAPI: ${errMsg}`);
    }

    return {
      success: true,
      data
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Tempo limite excedido ao enviar mensagem via UAZAPI.');
    }
    console.error('[UAZAPI] Erro ao enviar mensagem de texto:', err);
    throw err;
  }
}

/**
 * Envia uma mensagem com mídia (imagem, vídeo, áudio ou documento) via UAZAPI
 * 
 * @param {Object} params
 * @param {string} params.number - Número do cliente
 * @param {string} params.mediaUrl - URL pública ou base64 da mídia
 * @param {string} [params.caption] - Legenda da mídia
 * @param {string} [params.type] - Tipo: 'image' | 'video' | 'audio' | 'document'
 * @param {string} [params.filename] - Nome do arquivo (especialmente para documentos)
 * @returns {Promise<{ success: boolean, data?: any }>}
 */
export async function sendWhatsAppMedia({ number, mediaUrl, caption = '', type = 'image', filename = '' }) {
  const cfg = getUazapiConfig();

  if (!cfg.enabled) {
    throw new Error('A integração com a UAZAPI está desativada nas configurações.');
  }
  if (!cfg.baseUrl || !cfg.token) {
    throw new Error('Configure a URL e o Token da UAZAPI antes de enviar.');
  }

  const formattedNumber = formatWhatsAppNumber(number);
  if (!formattedNumber) {
    throw new Error(`Número de WhatsApp inválido: "${number}".`);
  }
  if (!mediaUrl) {
    throw new Error('URL da mídia é obrigatória.');
  }

  const endpoint = `${cfg.baseUrl}/send/media`;
  const payload = {
    number: formattedNumber,
    media: mediaUrl,
    type: type,
    caption: caption || '',
    delay: cfg.delayMs
  };

  if (filename) {
    payload.filename = filename;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getHeaders(cfg.token),
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg = data?.message || data?.error || `Erro HTTP ${res.status}`;
      throw new Error(`Falha no envio de mídia UAZAPI: ${errMsg}`);
    }

    return {
      success: true,
      data
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('[UAZAPI] Erro ao enviar mídia:', err);
    throw err;
  }
}

// ─── Templates de Mensagens Prontas para "Meu Pet em Arte" ──────────────────────

export const UAZAPI_TEMPLATES = {
  boas_vindas: {
    id: 'boas_vindas',
    label: '🐾 Pedido Confirmado / Boas-Vindas',
    template: `Olá, {{primeiro_nome}}! Tudo bem? 🐶✨\n\nRecebemos seu pedido (#{{id}}) da arte do(a) *{{pet}}* na *Meu Pet em Arte*!\n\nJá estamos revisando as fotos e seu pedido logo entrará para a fila de produção.\n\nQualquer dúvida, estamos por aqui!`
  },
  em_producao: {
    id: 'em_producao',
    label: '🎨 Início da Produção',
    template: `Oi, {{primeiro_nome}}! Passando com novidades! 🐾\n\nA peça do(a) *{{pet}}* acabou de entrar na nossa etapa de produção e pintura artesanal! 🎨✨\n\nEstamos cuidando de cada detalhe com muito amor para ficar idêntico ao seu pet.`
  },
  previa_arte: {
    id: 'previa_arte',
    label: '📸 Envio de Prévia para Aprovação',
    template: `Oi, {{primeiro_nome}}! Olha só como está ficando o(a) *{{pet}}*! 🐾❤️\n\nDê uma olhadinha e nos diga o que achou! Está aprovado para finalizarmos e embalarmos?`
  },
  rastreio: {
    id: 'rastreio',
    label: '🚚 Pedido Enviado / Rastreio (SuperFrete / Loggi)',
    template: `Oba, {{primeiro_nome}}! {{texto_chaveiro}} a caminho da sua casa! 🚚📦✨\n\n*Transportadora:* {{transportadora}}\n*Código de rastreamento:* {{rastreio}}\n*Acompanhe por aqui:* {{link_rastreio}}\n\nAssim que receber, não esqueça de nos marcar no Instagram 🥰`
  },
  rastreio_loggi: {
    id: 'rastreio_loggi',
    label: '📦 Pedido Enviado / Loggi',
    template: `Oba, {{primeiro_nome}}! {{texto_chaveiro_despachado}} via Loggi! 🚚📦✨\n\n*Código de rastreamento:* {{rastreio}}\n*Acompanhe por aqui:* https://www.loggi.com/rastreador/{{rastreio}}\n\nQualquer dúvida sobre a entrega estamos por aqui! ❤️`
  },
  cobranca_pix: {
    id: 'cobranca_pix',
    label: '💳 Chave PIX / Pagamento Pendente',
    template: `Olá, {{primeiro_nome}}! Tudo bem?\n\nPassando para compartilhar os dados de pagamento do seu pedido (#{{id}}) do(a) *{{pet}}*:\n\n*Valor Total:* R$ {{valor_total}}\n*Chave PIX:* contato@meupetemarte.com.br\n\nAssim que efetuar o pagamento, basta nos enviar o comprovante por aqui. Muito obrigado! ❤️`
  },
  pedir_foto: {
    id: 'pedir_foto',
    label: '📷 Solicitar Novas Fotos do Pet',
    template: `Olá, {{primeiro_nome}}! Tudo bem?\n\nEstamos preparando a produção do(a) *{{pet}}*, mas precisamos de mais uma foto com boa iluminação mostrando bem o rostinho/manchas dele(a).\n\nVocê conseguiria nos enviar por aqui? Assim garantimos que cada detalhe fique perfeito! 🐾✨`
  },
  pos_venda: {
    id: 'pos_venda',
    label: '⭐ Pós-Venda / Avaliação',
    template: `Oi, {{primeiro_nome}}! Vimos que o seu pedido do(a) *{{pet}}* foi entregue! 🐶🎉\n\nConta pra gente: o que achou da peça? Ficou do jeitinho que você imaginava?\n\nSe puder tirar uma fotinho do seu pet com a peça e nos marcar no Instagram *@meupetemarte*, vamos amar compartilhar nos nossos stories! ❤️`
  }
};

/**
 * Determina o link de rastreio e transportadora (SuperFrete / Loggi) com base no código e método
 * @param {Object} order
 * @returns {{ link: string, carrier: string }}
 */
export function getTrackingLinkAndCarrier(order) {
  const tracking = String(order?.tracking || '').trim();
  if (!tracking) return { link: '', carrier: 'SuperFrete' };

  const methodUpper = String(order?.shippingMethod || '').toUpperCase();
  const isLoggi = /^SLG/i.test(tracking) || methodUpper.includes('LOGGI');

  if (isLoggi) {
    return {
      link: `https://www.loggi.com/rastreador/${encodeURIComponent(tracking)}`,
      carrier: 'Loggi'
    };
  }

  // Códigos no padrão nacional emitidos via SuperFrete (Mini Envios, PAC, SEDEX)
  const isCorreiosPattern = /^[A-Za-z]{2}\d{9}[A-Za-z]{2}$/.test(tracking);
  if (isCorreiosPattern) {
    return {
      link: `https://rastreamento.correios.com.br/app/index.php?codigo=${encodeURIComponent(tracking)}`,
      carrier: 'SuperFrete'
    };
  }

  // Caso geral: se for código numérico ou de transportadora privada, tentar Loggi
  return {
    link: `https://www.loggi.com/rastreador/${encodeURIComponent(tracking)}`,
    carrier: 'Loggi'
  };
}

/**
 * Preenche um template de mensagem com os dados de um pedido
 * @param {string} templateStr
 * @param {Object} order
 * @param {Object} [customData]
 * @returns {string} Mensagem final preenchida
 */
export function renderTemplate(templateStr, order, customData = {}) {
  if (!templateStr || !order) return templateStr || '';

  const clientName = String(order.client || 'Cliente').trim();
  const firstName = clientName.split(' ')[0] || 'Cliente';
  const petName = String(order.petName || 'seu Pet').trim();
  const orderId = String(order.id || '').replace(/^#/, '');
  const tracking = String(order.tracking || '').trim();
  const { link: trackingLink, carrier: carrierName } = getTrackingLinkAndCarrier(order);

  const quantity = Math.max(Number(order.quantity) || 1, 1);
  const isPlural = quantity > 1;

  const textoChaveiro = isPlural
    ? 'Os Chaveiros personalizados estão'
    : 'O Chaveiro personalizado está';

  const textoChaveiroDespachado = isPlural
    ? 'Os Chaveiros personalizados foram despachados'
    : 'O Chaveiro personalizado foi despachado';

  const totalValue = Number(order.totalWithShipping || (order.totalSale || 0) + (order.shipping || 0)).toFixed(2).replace('.', ',');

  const replacements = {
    '{{cliente}}': clientName,
    '{{primeiro_nome}}': firstName,
    '{{pet}}': petName,
    '{{id}}': orderId,
    '{{produto}}': order.product || (isPlural ? 'Chaveiros Personalizados' : 'Chaveiro Personalizado'),
    '{{quantidade}}': String(quantity),
    '{{texto_chaveiro}}': textoChaveiro,
    '{{texto_chaveiro_despachado}}': textoChaveiroDespachado,
    '{{rastreio}}': tracking || 'Em breve',
    '{{link_rastreio}}': trackingLink,
    '{{transportadora}}': carrierName,
    '{{valor_total}}': totalValue,
    '{{status}}': order.status || '',
    ...customData
  };

  let rendered = templateStr;
  for (const [key, value] of Object.entries(replacements)) {
    rendered = rendered.split(key).join(String(value));
  }

  // Ajuste de plural automático caso o texto original contenha a forma singular
  if (isPlural) {
    rendered = rendered
      .replace(/O Chaveiro personalizado está/g, 'Os Chaveiros personalizados estão')
      .replace(/o Chaveiro personalizado está/g, 'os Chaveiros personalizados estão');
  }

  return rendered;
}

export const CUSTOM_TEMPLATES_KEY = 'mpa:uazapi_custom_templates';

/**
 * Obtém modelos customizados criados pelo usuário
 * @returns {Array<{ id: string, label: string, template: string }>}
 */
export function getCustomTemplates() {
  try {
    const raw = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Salva modelos customizados criados pelo usuário
 * @param {Array<{ id: string, label: string, template: string }>} templates
 */
export function saveCustomTemplates(templates) {
  const clean = Array.isArray(templates) ? templates : [];
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(clean));
  return clean;
}

