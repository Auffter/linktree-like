// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { derived, writable } from "svelte/store";
import type { Readable } from "svelte/motion";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTm43scF0leSikRuhQzrd60FIK_jNNgQQ",
  authDomain: "linktree-like-ca8aa.firebaseapp.com",
  projectId: "linktree-like-ca8aa",
  storageBucket: "linktree-like-ca8aa.appspot.com",
  messagingSenderId: "20918310218",
  appId: "1:20918310218:web:bfb800af6ccd7664fcddb3",
  measurementId: "G-D5P32FN84B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
//export const analytics = getAnalytics(app);



//Returns a store that contains the current user information or null if not logged in
function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }

  const { subscribe } = writable(auth?.currentUser ?? null, set => {
    unsubscribe = onAuthStateChanged(auth, user => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();


/*
Universal store that will listen to changes in a document in Firestore and update the store with the new data
After data is no longer needed, the store will unsubscribe from the document
*/
export function docStore<T>(path: string) {
  
  let unsubscribe: () => void;

  const docRef = doc(db, path); 

  const { subscribe } = writable<T | null>(null, (set) => {

    onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };
}

/*
Derived function that takes two or more stores and combine them into a single store
In this case it takes user store as starting value which provides the user information
If user is logged in userData returns subscripton to docStore with userid 
which allows to access user information all across the app
*/

interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  links: any[];
}

export const userData: Readable<UserData | null> = derived(user, ($user, set: any) => {
  if ($user) {
    return docStore(`users/${$user.uid}`).subscribe(set);
  } else {
    set(null);
    }
});