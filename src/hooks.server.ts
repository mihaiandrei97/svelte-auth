import { db } from '$lib/db'
import { fromDate } from '$lib/utils'
import type { Handle } from '@sveltejs/kit'
import { SESSION_MAX_AGE, SESSION_NAME, SESSION_UPDATE_AGE } from './contants'

export const handle: Handle = async ({event, resolve}) => {
    const sessionToken = event.cookies.get(SESSION_NAME)

    if(!sessionToken){
        return await resolve(event)
    }
    let session = await db.session.findUnique({
        where: {
            sessionToken: sessionToken
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: true
                }
            }
        }
    })

    // If session has expired, clean up the database
    if(session && session.expires.valueOf() < Date.now()) {
        await db.session.delete({
            where: {
                sessionToken
            }
        })
        // event.cookies.set('session', '', {
        //     path: '/',
        //     expires: new Date(0),
        // })
        event.cookies.delete(SESSION_NAME)
        session = null
    }

    // TODO: Log user out if session is expired.
    if(session){
        
        // Calculate last updated date to throttle write updates to database
        // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
        //     e.g. ({expiry date} - 30 days) + 1 hour
        const sessionIsDueToBeUpdatedDate =
          session.expires.valueOf() -
          SESSION_MAX_AGE * 1000 +
          SESSION_UPDATE_AGE * 1000

        if(sessionIsDueToBeUpdatedDate <= Date.now()){
            const newExpires = fromDate(SESSION_MAX_AGE)
            await db.session.update({
                where: {
                    sessionToken
                },
                data: {
                    expires: newExpires
                }
            })

            event.cookies.set(SESSION_NAME, session.sessionToken, {
                // send cookie for every page
                path: '/',
                // server side only cookie so you can't use `document.cookie`
                httpOnly: true,
                // only requests from same site can send cookies
                // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
                sameSite: 'strict',
                // only sent over HTTPS in production
                secure: process.env.NODE_ENV === 'production',
                // set cookie to expire after a month
                maxAge: SESSION_MAX_AGE
            });

        }

        event.locals.user = {
            id: session.user.id,
            username: session.user.username,
            role: session.user.role.name
        }
    } 

    return await resolve(event)
}