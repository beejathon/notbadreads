import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import placeholder from "../assets/profile_icon.png"
import { addSizeToGoogleProfilePic } from "../helpers/helpers";

export const ProfileMenu = () => {
  const [clicked, setClicked] = useState(false);
  const [userName, setUserName] = useState(null)
  const [userIcon, setUserIcon] = useState(null)

  const toggleMenu = () => {
    clicked ? setClicked(false) : setClicked(true);
  }

  const signOutUser = () => {
    signOut(auth)
  }

  const syncUser = async () => {
    const user = await getDoc(doc(db, 'users', auth.currentUser.uid))
    if (user.exists) {
      const icon = addSizeToGoogleProfilePic(user.data().icon)
      setUserName(user.data().name)
      setUserIcon(icon)
    }
  }

  useEffect(() => {
    syncUser()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center pl-4 pr-4 h-full">
      <div 
        onClick={toggleMenu}>
        <img 
          src={userIcon || placeholder }
          alt="profile pic"
          className="rounded-full p-1"
        />    
      </div>
      <div className="relative w-full bg-white">
        <div 
          className=
          { clicked 
            ? 'absolute right-[-20px] top-[10px] flex flex-col w-[250px] gap-2 p-2 rounded-sm border-[0.8px] items-left bg-[#FFFFFF] opacity-100'
            : 'hidden'
          } 
          onMouseLeave={toggleMenu}
        >
          <div className="uppercase">
            {userName || auth.currentUser.displayName}
          </div>
          <Link to={`users/${auth.currentUser.uid}`}>
            <div className="text-[15px] hover:underline cursor-pointer">Profile</div>
          </Link>
          <div className="text-[15px] hover:underline cursor-pointer">Friends</div>
          <div className="text-[15px] hover:underline cursor-pointer border-t-[0.8px] w-100">Account settings</div>
          <div className="text-[15px] hover:underline cursor-pointer" onClick={signOutUser}>Sign Out</div>
        </div>
      </div>
     </div>
  )
}