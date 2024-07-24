import type { PageServerLoad } from "./$types";
import { adminAuth, adminDB } from "$lib/server/admin";
import { error } from "@sveltejs/kit";

export const load = (async ({ cookies }) => {

    const sessionCookie = cookies.get('__session');

    try {
        const verifySession = await adminAuth.verifySessionCookie(sessionCookie!);
        const userDoc = await adminDB.collection('users').doc(verifySession.uid).get();
        const userData = userDoc.data();

        return {
            bio: userData?.bio,
        }
    } catch (e) {
        throw error(401, 'Unauthorized request!')
    }
}) satisfies PageServerLoad;