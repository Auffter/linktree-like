import type { PageLoad } from "./$types";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "$lib/firebase";
import { error } from "@sveltejs/kit";

export const load = (async ({ params }) => {

    const collectionRef = collection(db, "users");

    const userDataQuery = query(
        collectionRef,
        where("username", "==", params.username),
        limit(1)
    );

    const snapshot = await getDocs(userDataQuery);
    const exist = snapshot.docs[0].exists();
    const data = snapshot.docs[0].data();

    if (!exist) {
        throw error(404, "User not found");
    }

    if(!data.published) {
        throw error(403, "{data.username} profile is private");
    }

    return {
        username: data.username,
        photoURL: data.photoURL,
        bio: data.bio,
        links: data.links ?? [],
    };

}) satisfies PageLoad;