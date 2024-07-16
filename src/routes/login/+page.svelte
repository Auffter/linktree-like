<script lang="ts">
    import { auth, user } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

    async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const user = await signInWithPopup(auth, provider);
    console.log(user);
}
</script>

{#if $user}
    <h2>Hi, {$user.displayName}</h2>
    <p class="text-center text-success">You are logged in</p>
    <button class="btn btn-error" on:click={() => signOut(auth)}>Sign out</button>
{:else}
<button class="btn btn-accent" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}