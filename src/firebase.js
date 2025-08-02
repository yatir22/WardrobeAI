// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSDT1aWQ49AqmIRrE09gYhFlodlyeSQlc",
  authDomain: "wardrobe-ai-ee2aa.firebaseapp.com",
  projectId: "wardrobe-ai-ee2aa",
  storageBucket: "wardrobe-ai-ee2aa.appspot.com", // <-- fixed here
  messagingSenderId: "407165953657",
  appId: "1:407165953657:web:e033f5829f06bdc5fc16a8",
  measurementId: "G-K9P11MJS3K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);