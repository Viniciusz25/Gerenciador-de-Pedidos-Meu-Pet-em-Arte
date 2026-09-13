export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetPath = url.pathname.replace(/^\/superfrete-sandbox/, '') + url.search;
  const targetUrl = `https://sandbox.superfrete.com${targetPath}`;

  const forwardHeaders = new Headers(context.request.headers);
  forwardHeaders.delete('host');

  const reqInit = {
    method: context.request.method,
    headers: forwardHeaders,
  };

  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    reqInit.body = await context.request.arrayBuffer();
  }

  try {
    const res = await fetch(targetUrl, reqInit);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
