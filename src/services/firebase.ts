// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBqsp4CWDQ4geOdhIreYuaBG0qN0hpXEI",
  authDomain: "mi-piel-mi-identidad.firebaseapp.com",
  projectId: "mi-piel-mi-identidad",
  storageBucket: "mi-piel-mi-identidad.firebasestorage.app",
  messagingSenderId: "942605289033",
  appId: "1:942605289033:web:7e87423af6e6924bdd6198"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);