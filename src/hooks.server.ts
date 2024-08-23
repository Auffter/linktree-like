import { adminAuth } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";

export const handleCookiesAuth = (async ({event , resolve}) => {
    
    const sessionCookie = event.cookies.get('__session');

    try {
        const verifySession = await adminAuth.verifySessionCookie(sessionCookie!);
        // Setting id on local event object to be used in any other server.ts file
        event.locals.userID = verifySession.uid;
    } catch (e) {
        event.locals.userID = null;
        return resolve(event);
    }

    return resolve(event);

}) satisfies Handle;