import { db } from '@/lib/db'
import type { APIRoute } from 'astro'
import bcrypt from 'bcrypt'

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const { name, lastname, email, password } = body

  const result = await db.execute({
    sql: 'SELECT * FROM author WHERE email = ?',
    args: [email],
  })

  const user = result.rows[0]

  if (user) {
    return Response.json({
      success: false,
      message: 'User already exists',
    })
  }

  const hash = await bcrypt.hash(password, 10)

  await db.execute({
    sql: 'INSERT INTO author (name, lastname, email, password) VALUES (?,?,?,?)',
    args: [name, lastname, email, hash],
  })

  return Response.json({
    success: true,
  })
}
