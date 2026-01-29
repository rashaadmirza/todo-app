// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGuFf8T7cSSDEEBB7N6KMOWL43yjhp3lI",
  authDomain: "todo-app-b001d.firebaseapp.com",
  projectId: "todo-app-b001d",
  storageBucket: "todo-app-b001d.firebasestorage.app",
  messagingSenderId: "683206655335",
  appId: "1:683206655335:web:060baffcd566d0068a03c2",
  measurementId: "G-38D516SPL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
