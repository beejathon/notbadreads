import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase";

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
      setUserName(user.data().name)
      setUserIcon(user.data().icon)
    }
  }

  useEffect(() => {
    syncUser()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center pl-4 pr-4 absolute right-0 hover:bg-[#382110] h-full">
      <div 
        onClick={toggleMenu}>
        <img 
          src={userIcon || auth.currentUser.photoURL || "assets/profile_placeholder.png"}
          alt="profile pic"
          className="rounded-full w-9"
        />    
      </div>
      <div className="relative w-full">
        <div 
          className=
          { clicked 
            ? 'absolute right-[-20px] top-[10px] flex flex-col w-[250px] gap-2 p-2 rounded-sm border-[0.8px] items-left bg-[#FFFFFF]'
            : 'hidden'
          } 
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