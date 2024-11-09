import type { APIRoute } from 'astro'
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json()
  const { email, password } = body

  const result = await db.execute({
    sql: 'SELECT * FROM author WHERE email = ? ',
    args: [email],
  })

  const user = result.rows[0]

  if (!user) return Response.json({ success: false, message: 'User not found' })

  if (!(await bcrypt.compare(password, user.password as string)))
    return Response.json({ success: false, message: 'Wrong password' })

  cookies.set('userbloginary', user, {
    path: '/',
    httpOnly: true,
  })

  return Response.json({ success: true })
}
