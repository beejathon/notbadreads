import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCCR3kcDEtKZO_rpIDBwJaLgrIfsRAMdlA",
  authDomain: "notbadreads.firebaseapp.com",
  projectId: "notbadreads",
  storageBucket: "notbadreads.appspot.com",
  messagingSenderId: "715831450876",
  appId: "1:715831450876:web:30792b6dd051be1b59cb79"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }