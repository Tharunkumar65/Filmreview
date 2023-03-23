import { initializeApp } from "firebase/app";
import {getFirestore,collection} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBWolo8Lfe-psTbuRqCJVcRffc6AQ3Jmfc",
  authDomain: "filmreview-41081.firebaseapp.com",
  projectId: "filmreview-41081",
  storageBucket: "filmreview-41081.appspot.com",
  messagingSenderId: "923964988494",
  appId: "1:923964988494:web:cd77318775088e4837771f"
};


const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);
export const movieRef=collection(db,'movies');
export const reviewRef=collection(db,'reviews');
export const userRef = collection(db,'users')
export default app;