import type { APIRoute } from 'astro'
import { db } from '@/lib/db'

// todo: login endpoint
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  return redirect('/dashboard')
}
