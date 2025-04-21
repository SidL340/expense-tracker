// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5oADGb1vrCkrGXq25C3P2gszzYm1gVQM",
  authDomain: "expense-tracker-b781f.firebaseapp.com",
  projectId: "expense-tracker-b781f",
  storageBucket: "expense-tracker-b781f.firebasestorage.app",
  messagingSenderId: "457471284526",
  appId: "1:457471284526:web:6d5dec2f089f301265d6bf",
  measurementId: "G-6G1TYCHB9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, sendPasswordResetEmail };