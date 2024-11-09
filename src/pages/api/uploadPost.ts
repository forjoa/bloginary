import { db } from '@/lib/db'
import type { User } from '@/lib/types'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  const encodedUser = request.headers.get('cookie')?.split('userbloginary=')[1]
  const user = JSON.parse(decodeURIComponent(encodedUser as string)) as User

  const body = await request.json()

  const { category, title, content } = body

  const result = await db.execute({
    sql: 'INSERT INTO posts (title, content, categoryid, authorid) VALUES (?,?,?,?)',
    args: [title, content, category, user.id],
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
