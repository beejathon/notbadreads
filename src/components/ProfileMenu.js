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
          src={auth.currentUser.photoURL || '../assets/profile_placeholder.png'}
          alt="profile pic"
          className="rounded-full w-12"
        />    
      </div>
      <div className="relative w-40">
        <div 
          className=
          { clicked 
            ? 'absolute right-[-50] flex flex-col w-[250px] gap-2 p-2 rounded-sm border-[0.8px] items-left bg-[#FFFFFF]'
            : 'hidden'
          } 
        >
          <div className="uppercase">
            {auth.currentUser.displayName}
          </div>
          <div className="text-[15px] hover:underline cursor-pointer">Profile</div>
          <div className="text-[15px] hover:underline cursor-pointer">Friends</div>
          <div className="text-[15px] hover:underline cursor-pointer border-t-[0.8px] w-100">Account settings</div>
          <div className="text-[15px] hover:underline cursor-pointer" onClick={signOutUser}>Sign Out</div>
        </div>
      </div>
     </div>
  )
}