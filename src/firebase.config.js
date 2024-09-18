import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArKGzh7jLICjCNSowZlMCZzknpHfwaOKU",
  authDomain: "house-marketplace-app-3cbf5.firebaseapp.com",
  projectId: "house-marketplace-app-3cbf5",
  storageBucket: "house-marketplace-app-3cbf5.appspot.com",
  messagingSenderId: "159617227624",
  appId: "1:159617227624:web:fe75eba026ef0911f394dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()