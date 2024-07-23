import { adminAuth } from '$lib/server/admin';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Sign in with google and set a session cookie
export const POST: RequestHandler = async ({request, cookies}) => {
    
    const { idToken } = await request.json();   // Get the idToken from the request body after google sign in
    const expiresIn = 60 * 60 * 24 * 5 * 1000;  // Token expires in 5 days
    const decodedIdToken = await adminAuth.verifyIdToken(idToken);  // Decode the idToken on firebase server 

    // Check if user authenticated within the last 5 minutes, if so set cookie 
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {  
        const cookie = await adminAuth.createSessionCookie(idToken, {expiresIn});
        const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' };

        cookies.set('__session', cookie, options);

        return json({status: 'signedIn'});
    } else {
        throw error(401, 'Unauthorized');
    }
};

// Sign out and delete the session cookie
export const DELETE: RequestHandler = async ({cookies}) => {
    cookies.delete('__session', {path: '/'});
    return json({status: 'signedOut'});
};