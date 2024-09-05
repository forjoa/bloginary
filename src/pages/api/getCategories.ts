import { db } from '@/lib/db'

export async function GET() {
  const result = await db.execute('SELECT * FROM categories')

  return new Response(JSON.stringify({ result: result.rows }), {
    headers: { 'content-type': 'application/json' },
  })
}
