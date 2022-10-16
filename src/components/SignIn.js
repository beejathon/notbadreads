import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, db } from "../config/firebase";
import google from "../assets/google_signin.png"
import { doc, setDoc } from "firebase/firestore";

export const SignIn = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    await signInWithPopup(auth, provider);
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      icon: auth.currentUser.photoURL,
      email: auth.currentUser.email,
      location: null,
      about: null,
    })
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <button onClick={signInWithGoogle}>
        <img src={google} alt="Sign In With Google "/>
      </button>
    </div>
  )
}