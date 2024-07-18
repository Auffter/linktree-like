<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { user, userData, storage, db } from "$lib/firebase";
    import { doc, updateDoc } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

    let previewURL: string;
    let uploading = false;
    //$: href = `/${$userData?.username}/edit`;

    async function upload(img: any) {
        uploading = true;
        const file = img.target.files[0];
        previewURL = URL.createObjectURL(file);
        const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);

        await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
        uploading = false;
    }
</script>

<AuthCheck>
    {#if $userData?.photoURL}
        <h2 class="card-title">Change your profile picture</h2>
    {:else}
        <h2 class="card-title">Upload your profile picture</h2>
    {/if}

    <form class="max-w-screen-md w-full">
        <div class="form-control w-full max-w-xs mx-auto text-center">
            <!-- TODO Bug fix: This section loads wrong img from database if user prev uploaded custom one -->
            <img 
                src={previewURL ?? $user?.photoURL ?? '/userDefaultIcon.webp'}
                alt="photoURL"
                width="256"
                height="256"
                class="mx-auto mb-3"
            />
            <input
                on:change={upload}
                name="photoURL"
                type="file"
                class="file-input file-input-bordered w-full max-w-xs mb-3"
                accept="image/png, image/jepg, image/jpg, image/webp"
            />
            
            {#if uploading}
                <p>Uploading...</p>
                <progress class="progress progress-info w-full my-3" />
            {/if}
        </div>
    </form>

    <!--
    <a {href} class="btn btn-primary">Finish</a>
    -->
</AuthCheck>