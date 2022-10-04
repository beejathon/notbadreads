import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../config/firebase";
import google from "../assets/google_signin.png"

export const SignIn = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    await signInWithPopup(auth, provider);
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <button onClick={signInWithGoogle}>
        <img src={google} alt="Sign In With Google "/>
      </button>
    </div>
  )
}