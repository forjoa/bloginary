import { db } from '@/lib/db'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const result = await db.execute('SELECT p.*, a.name, a.lastname FROM posts AS p JOIN author AS a ON p.authorid = a.id')

  return new Response(JSON.stringify({ result: result.rows }), {
    headers: { 'content-type': 'application/json' },
  })
}
