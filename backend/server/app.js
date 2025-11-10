import { Hono } from '@hono/hono';
// import { cors } from 'hono/cors';
import postgres from "postgres";

const app = new Hono();
// const sql = postgres();

// Use the Docker Postgres connection
const sql = postgres(
  Deno.env.get("DATABASE_URL")
);

app.use('/*', async (c, next) => {
  await next();
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

app.get("/api/practices", async (c) => {
    const practices = await sql`SELECT * FROM practices`;
    return c.json(practices); 
});

app.get("api/practices/difficulty/:category", async (c) => {   
    const category = c.req.param('category');
    const categorized_practices = await sql`SELECT * FROM practices WHERE difficulty=${category}`;
    return c.json(categorized_practices);
})

app.get("/api/practices/:id", async (c) => {
  const id = Number(c.req.param('id'));
  const rows = await sql`SELECT * FROM practices WHERE id=${id}`;
  return rows.length ? c.json(rows[0]) : c.json({ error: "not found" }, 404);
});

/* ------------------- Class Practice Tuner ------------------- */
function FindNextPractice(practice, emotion) {
  const levels = ['easy', 'medium', 'hard'];
  const i = levels.indexOf(String(practice.difficulty));

  if (i < 0) return 'easy';
  if (emotion === 'POSITIVE' && i < 2) return levels[i + 1];
  if (emotion === 'NEGATIVE' && i > 0) return levels[i - 1];
  return levels[i];
}


// POST /api/practices/FindNextPractice
app.post("/api/practices/FindNextPractice", async (c) => {
  const { practice, emotion } = await c.req.json();

  let current = practice;
  if (!current?.difficulty && current?.id) {
    const rows = await sql`SELECT * FROM practices WHERE id=${current.id}`;
    if (!rows.length) return c.json({ error: "current practice not found" }, 400);
    current = rows[0];
  }

  if (!current?.difficulty) {
    return c.json({ error: "invalid practice payload" }, 400);
  }

  const nextDiff = FindNextPractice(current, String(emotion));
  const next = await sql`
    SELECT * FROM practices
    WHERE difficulty=${nextDiff}
    ORDER BY random() LIMIT 1
  `;
  if (!next.length) return c.json({ error: "no next practice" }, 404);

  return c.json(next[0]);
});

export default app;
