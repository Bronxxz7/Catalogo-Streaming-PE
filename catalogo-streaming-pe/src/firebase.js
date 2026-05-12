import { initializeApp } from "firebase/app";

import {
  getFirestore
} from "firebase/firestore";

import {
  getAuth
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdcNZsInSwgk-z-Ica7R_b89KgXef7mqc",
  authDomain: "streaming-pe.firebaseapp.com",
  projectId: "streaming-pe",
  storageBucket: "streaming-pe.firebasestorage.app",
  messagingSenderId: "106021969684",
  appId: "1:106021969684:web:e63ff2b4e2d1adb732ec01",
  measurementId: "G-9GSX96VMFR"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);