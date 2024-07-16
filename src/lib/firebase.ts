// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { writable } from "svelte/store";
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