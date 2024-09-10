<script>
    import { userData } from "$lib/firebase";
</script>

<a href="/login" class="btn btn-blue">Login</a>

{#if $userData}
    <ul class="list-none mt-4">
        <li>
            <a href= "/{$userData?.username}/edit" class="btn btn-blue flex">Edit Profile</a>
            <a href="/{$userData?.username}/bio" class="btn btn-blue flex">Edit Bio</a>
        </li>
    </ul>
{/if}