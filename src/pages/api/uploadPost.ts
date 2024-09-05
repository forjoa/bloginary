import { db } from '@/lib/db'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()

  const { category, title, content } = body

  const result = await db.execute({
    sql: 'INSERT INTO posts (title, content, categoryid) VALUES (?,?,?)',
    args: [title, content, category],
  })

  return new Response(
    JSON.stringify({
      result,
    }),
    {
      status: 200,
    }
  )
}
