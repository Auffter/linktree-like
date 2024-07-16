<script lang="ts">
    import { user } from "$lib/firebase";
</script>

{#if $user}
    <slot />
{:else}
    <p class="text-error">
        You are not logged in. Please sign in to continue.
        <a href="/login" class="btn btn-primary">Sign in</a>
    </p>
{/if}