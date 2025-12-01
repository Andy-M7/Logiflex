// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBGuMiZypFnoDZAIVOSPnWOnEUQYTV7fmI",
  authDomain: "proyecto-typescript-73558.firebaseapp.com",
  projectId: "proyecto-typescript-73558",
  storageBucket: "proyecto-typescript-73558.firebasestorage.app",
  messagingSenderId: "435460698091",
  appId: "1:435460698091:web:457b04e6637794fc90f3ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);