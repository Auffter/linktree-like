<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { db, user } from "$lib/firebase";
    import { doc, getDoc, writeBatch } from "firebase/firestore";

    let username = "";
    let loading = false;
    let isAvailable = false;

    let debounceTimer: NodeJS.Timeout;

    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  
    $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
    $: isTouched = username.length > 0;
    $: isTaken = isValid && !isAvailable && !loading

    async function checkAvailability() {
        isAvailable = false;
        clearTimeout(debounceTimer);

        loading = true;
        
        debounceTimer = setTimeout(async () => {
            const ref = doc(db, "usernames", username);
            const exists = await getDoc(ref).then((doc) => doc.exists());
    
            isAvailable = !exists;
            loading = false;
        }, 500)
    }

    async function confirmUsername() {
        const batch = writeBatch(db);
        batch.set(doc(db, "usernames", username), { uid: $user?.uid });
        batch.set(doc(db, "users", $user!.uid), {
            username,
            photoURL: $user?.photoURL ?? null,
            published: true,
            bio: "Some default bio",
            links: [
                {
                    title: 'Test link',
                    url: 'something.something',
                    icon: 'custom_icon'
                }
            ]
        });
        
        await batch.commit();
        
        username = '';
        isAvailable = false;
    }

</script>

<AuthCheck>
    <form class="w2/5" on:submit|preventDefault={confirmUsername}> 
        <input 
            type="text"
            placeholder="Username"
            class="input w-full text-center"
            bind:value={username}
            on:input={checkAvailability}    
            class:input-error={(!isValid && isTouched)}
            class:input-warning={isTaken}
            class:input-success={isAvailable && isValid && !loading}
        />
        <div class="mt-4 min-h-16 px-8 w-full">
            {#if username.length == 0}
                <p class="text-primary">Enter user name</p>
            {/if}
            
            {#if loading && isTouched}
                <p class="text-secondary">Checking availability of {username}...</p>
            {/if}
        
            {#if !isValid && isTouched}
                <p class="text-error text-sm">
                    Must be 3-16 characters long, alphanumeric only
                </p>
            {/if}
        
            {#if isTaken}
                <p class="text-warning text-sm">
                    {username} is not available
                 </p>
            {/if}
        
            {#if isAvailable && isValid}
                <button class="btn btn-success">Confirm username {username} </button>
            {/if}
          </div>
    </form>
</AuthCheck>