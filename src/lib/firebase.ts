// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDogLu-KunczG1LpDUIR-8Rrk7nywb3ykc",
  authDomain: "g4-dermassist.firebaseapp.com",
  projectId: "g4-dermassist",
  storageBucket: "g4-dermassist.firebasestorage.app",
  messagingSenderId: "522953437830",
  appId: "1:522953437830:web:54b33e253de5aca2021707",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
