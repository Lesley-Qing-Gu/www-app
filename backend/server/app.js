import { Hono } from '@hono/hono';
import postgres from "postgres";

const app = new Hono();

// Use the Docker Postgres connection
const sql = postgres(
  Deno.env.get("DATABASE_URL")
);

// CORS
app.use('/*', async (c, next) => {
  await next();
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

/* 简单 ping，看 Hono 本身有没有问题 */
app.get("/ping", (c) => c.text("pong"));

/* =========================
 *   HELPERS
 * ========================= */

async function getPractices(table, difficulty) {
  console.log("getPractices called", { table, difficulty });
  if (difficulty) {
    return await sql`
      SELECT * FROM ${sql(table)}
      WHERE difficulty = ${difficulty}
    `;
  }
  return await sql`SELECT * FROM ${sql(table)}`;
}

/* =========================
 *   A MODE (Version A)
 * ========================= */

app.get("/api/practices_a", async (c) => {
  try {
    const difficulty = c.req.query("difficulty"); // /api/practices_a?difficulty=easy
    console.log("GET /api/practices_a", { difficulty });

    const practices = await getPractices("practices_a", difficulty);
    console.log("Loaded practices_a:", practices.length);

    return c.json(practices);
  } catch (err) {
    console.error("Error in /api/practices_a:", err);
    return c.json(
      { error: "failed to load practices_a", detail: String(err) },
      500
    );
  }
});

/* =========================
 *   B MODE (Version B)
 * ========================= */

app.get("/api/practices_b", async (c) => {
  try {
    const difficulty = c.req.query("difficulty");
    console.log("GET /api/practices_b", { difficulty });

    const practices = await getPractices("practices_b", difficulty);
    console.log("Loaded practices_b:", practices.length);

    return c.json(practices);
  } catch (err) {
    console.error("Error in /api/practices_b:", err);
    return c.json(
      { error: "failed to load practices_b", detail: String(err) },
      500
    );
  }
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

app.post("/api/practices/FindNextPractice", async (c) => {
  try {
    const { practice, emotion } = await c.req.json();

    let current = practice;
    if (!current?.difficulty && current?.id) {
      const rows = await sql`SELECT * FROM practices_b WHERE id = ${current.id}`;
      if (!rows.length) return c.json({ error: "current practice not found" }, 400);
      current = rows[0];
    }

    if (!current?.difficulty) {
      return c.json({ error: "invalid practice payload" }, 400);
    }

    const nextDiff = FindNextPractice(current, String(emotion));
    const next = await sql`
      SELECT * FROM practices_b
      WHERE difficulty = ${nextDiff}
      ORDER BY random() LIMIT 1
    `;
    if (!next.length) return c.json({ error: "no next practice" }, 404);

    return c.json(next[0]);
  } catch (err) {
    console.error("Error in FindNextPractice:", err);
    return c.json(
      { error: "failed in FindNextPractice", detail: String(err) },
      500
    );
  }
});

export default app;
