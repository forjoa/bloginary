import { db } from './db'
import type { User } from './types'

export async function getUser(id: number) {
  const { rows } = await db.execute({
    sql: 'SELECT * FROM author WHERE id = ?',
    args: [id],
  })

  delete rows[0].password
  const user: User = rows[0] as unknown as User

  return user
}
