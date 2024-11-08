import type { APIRoute } from 'astro'
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body = await request.json()
  const { email, password } = body

  const result = await db.execute({
    sql: 'SELECT * FROM author WHERE email = ? ',
    args: [email],
  })

  const user = result.rows[0]

  if (!user) return redirect('/subir')

  if (!(await bcrypt.compare(password, user.password as string))) return redirect('/subir')

  cookies.set('userbloginary', user, {
    path: '/',
    httpOnly: true,
  })

  return redirect('/subir')
}
