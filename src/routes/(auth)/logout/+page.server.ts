import { db } from '$lib/db'
import { redirect } from '@sveltejs/kit'
import { SESSION_NAME } from '../../../contants'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  // we only use this endpoint for the api
  // and don't need to see the page
  throw redirect(302, '/')
}

export const actions: Actions = {
  async default({ cookies }) {
    // delete the cookie
    // cookies.set(SESSION_NAME, '', {
    //   path: '/',
    //   expires: new Date(0),
    // })
    await db.session.delete({
      where: {
          sessionToken: cookies.get(SESSION_NAME)
      }
  })
    cookies.delete(SESSION_NAME)

    // redirect the user
    throw redirect(302, '/login')
  },
}
