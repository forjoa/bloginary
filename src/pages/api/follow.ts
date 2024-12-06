import type { APIRoute } from 'astro'
import { db } from '@/lib/db'

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const followerid = formData.get('followerid')
  const followedid = formData.get('followedid')

  if (!followerid || !followedid) {
    const error = encodeURIComponent('Invalid follower or followed id')
    return Response.redirect(
      new URL(`/a/${followedid}?error=${error}`, request.url)
    )
  }

  if (followedid === followerid) {
    const error = encodeURIComponent('You cannot follow yourself')
    return Response.redirect(
      new URL(`/a/${followedid}?error=${error}`, request.url)
    )
  }

  const result = await db.execute({
    sql: 'INSERT INTO subscription (follower, authorid) VALUES (?,?)',
    args: [followerid as string, followedid as string],
  })

  return Response.redirect(new URL(`/a/${followedid}`, request.url))
}
