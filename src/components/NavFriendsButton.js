import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase";

export const NavFriendsButton = () => {
  const [pending, setPending] = useState(null);
  const [user] = useAuthState(auth);

  const fetchRequests = useCallback(async () => {
    const q = query(
      collection(db, 'friends'),
      where('requestedFrom', '==', user.uid),
      where('pending', '==', true)
    )

    const qSnap = await getDocs(q)
    if (qSnap.docs.length > 0) setPending(qSnap.docs.length)
  }, [user]) 

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests])

  return (
    <Link to={'/friends'} className="h-full w-full p-3 hover:bg-[#382110]">
      <div className="bg-[url('assets/icn_nav_friend.svg')] bg-no-repeat bg-clip-border bg-center bg-contain h-full w-full relative">
        { pending
          ? <div className="bg-[#fa3e3e] absolute right-5 top-5 opacity-80 rounded-full w-4 h-4 border-[0.3px] border-[#DCD6CC] text-white text-center text text-xs font-bold">{pending}</div>
          : <></>          
        }
      </div>
    </Link>
  )
}