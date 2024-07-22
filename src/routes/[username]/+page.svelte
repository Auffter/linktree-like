<script lang="ts">
    import UserLink from '$lib/components/UserLink.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<svelte:head>
    <title>{data.username} profile</title>
    <meta name="description" content="{data.bio}" />
</svelte:head>

<main class="prose text-center mx-auto">
    <h1 class="text-7xl text-purple-500 mt-4">
        {data.username}
    </h1>

    <img
        src={data.photoURL ?? '/userDefaultIcon.webp'}
        alt="photoURL"
        class="mx-auto mt-4"
        width="256"
        height="256"
    />

    <p class="text-xl mt-4">{data.bio ?? "No bio yet..."}</p>
    <ul class="list-none">
        {#each data.links as item}
            <li>
                <UserLink {...item} />
            </li>
        {/each}
    </ul>
</main>