<script lang="ts">
    import { auth, user } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const loginData = await signInWithPopup(auth, provider);
        
        const idToken = await loginData.user.getIdToken();

        const res = await fetch("/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
    });
}

    async function signOutSSR() {
        const res = await fetch("/api/signin", {
            method: "DELETE",
        });
        await signOut(auth);
    };

</script>

{#if $user}
    <h2>Hi, {$user.displayName}</h2>
    <p class="text-center text-success">You are logged in</p>
    <button class="btn btn-error" on:click={signOutSSR}>Sign out</button>
{:else}
    <button class="btn btn-accent" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}