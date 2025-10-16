const port = Number(Deno.env.get("PORT") ?? "5000");

function withCORS(handler) {
  return async (req) => {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      });
    }
    const resp = await handler(req);
    const h = new Headers(resp.headers);
    h.set("Access-Control-Allow-Origin", "*");
    return new Response(resp.body, { status: resp.status, headers: h });
  };
}

const handler = async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }
  return new Response("OK");
};

Deno.serve({ port, hostname: "0.0.0.0" }, withCORS(handler));