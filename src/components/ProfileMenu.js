import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../config/firebase";

export const ProfileMenu = () => {
  const [clicked, setClicked] = useState(false)

  const toggleMenu = () => {
    clicked ? setClicked(false) : setClicked(true)
  }

  const signOutUser = () => {
    signOut(auth)
  }

  return (
    <div className="flex flex-col items-center absolute right-0">
      <div 
        onClick={toggleMenu}>
        <img 
          src={auth.currentUser.photoURL || '../assets/profile_placeholder.png' }
          alt={auth.currentUser.displayName}
          className="rounded-full w-12"
        />    
      </div>
      <div className="relative w-40">
        <div 
          className=
          { clicked 
            ? 'absolute flex flex-col w-40 gap-1 items-center'
            : 'hidden'
          } >
          <div>
            {auth.currentUser.displayName}
          </div>
          <div>Profile</div>
          <button onClick={signOutUser}>Sign Out</button>
        </div>
      </div>
     </div>
  )
}