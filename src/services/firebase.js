// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGAd0Bzz050pTmgaIrOGe5UONBTWlxplI",
  authDomain: "b18tesis.firebaseapp.com",
  projectId: "b18tesis",
  storageBucket: "b18tesis.firebasestorage.app",
  messagingSenderId: "735045857968",
  appId: "1:735045857968:web:385d8eddaa1390276e0175",
  measurementId: "G-4RC6SR5V6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;