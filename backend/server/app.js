import { Hono } from '@hono/hono';
import postgres from "postgres";

const app = new Hono();
const sql = postgres();


app.get("/api/practices", async (c) => {
    const practices = await sql`SELECT * FROM practices`;
    return c.json(practices); 
});

app.get("api/pratices/difficulty/:category", async (c) => {   
    const category = c.req.param('category');
    const categorized_practices = await sql`SELECT * FROM practices WHERE difficulty=${category}`;
    return c.json(categorized_practices);
})

export default app;
