import { db } from '@/lib/db'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const result = await db.execute('SELECT * FROM posts')

  return new Response(JSON.stringify({ result: result.rows }), {
    headers: { 'content-type': 'application/json' },
  })
}
