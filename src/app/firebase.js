// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhhuKS_JYQ4xI347-Ku9NNyECyN8U2HXQ",
  authDomain: "schedular-bcf76.firebaseapp.com",
  databaseURL: "https://schedular-bcf76-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "schedular-bcf76",
  storageBucket: "schedular-bcf76.appspot.com",
  messagingSenderId: "958974351798",
  appId: "1:958974351798:web:85d8cf488bd6902a5b8917",
  measurementId: "G-SJSG450933"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const rdb = getDatabase(app);
