import { createClient } from '@libsql/client'

export const db = createClient({
  url: 'libsql://bloginary-forjoa.turso.io',
  authToken: import.meta.env.PUBLIC_TURSO_AUTH_TOKEN as string,
})
