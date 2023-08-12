// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth"
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDpjf5U7yOYS_AqJdVkXbiVx_Hjg6y5muE",
  authDomain: "video-site-58cdb.firebaseapp.com",
  projectId: "video-site-58cdb",
  appId: "1:923901081237:web:8a65e1c7481ed4a546cd9c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const functions = getFunctions();

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}