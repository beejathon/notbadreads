import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, db } from "../config/firebase";
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
    <div className="flex flex-col justify-evenly items-center h-screen w-full bg-cover bg-no-repeat bg-[url('/src/assets/books.jpg')]">
      <header className="flex flex-row pl-6 bg-[#F4F1EA] items-center w-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] h-20">
        <span className="logo-left">notbad</span>
        <span className="logo-right">reads</span>
      </header>
      <div className="flex flex-col p-8 gap-12 bg-[#FFFFFF] rounded-lg border-[#D8D8D8] border-[0.8px] items-center">
        <p className="text-[24px] font-semibold">Discover & read more</p>
        <button
          className="
            w-full h-[40px] text-transparent 
            bg-no-repeat bg-center bg-contain 
            bg-[url('/src/assets/google_signin.png')]
            hover:bg-[url('/src/assets/google_signin_focus.png')]"
          onClick={signInWithGoogle}>
          Sign In With Google
        </button>
      </div>
      <div className="flex flex-row gap-1 bg-[#F4F1EA] items-center w-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] h-fit text-sky-700 hover:text-sky-500">
          Photo by <a href="https://unsplash.com/@ugur?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ugur Akdemir</a> on <a href="https://unsplash.com/s/photos/library?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
      </div>
    </div>
  )
}