import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useEffectOnce } from "../hooks/useEffectOnce";

export const AddFriendButton = ({id}) => {
  const [user] = useAuthState(auth);
  const [friend, setFriend] = useState(false)
  const [pending, setPending] = useState(false)

  const checkFriendStatus = async () => {
    const q1 = query(
      collection(db, 'friends'),
      where(user.uid, '==', true),
      where(id, '==', true),
      where('accepted', '==', true)
    )
    const qSnap1 = await getDocs(q1)
    qSnap1.forEach((doc) => {
      if (doc.exists()) setFriend(true)
    })

    const q2 = query(
      collection(db, 'friends'),
      where(user.uid, '==', true),
      where(id, '==', true),
      where('pending', '==', true)
    )
    const qSnap2 = await getDocs(q2)
    qSnap2.forEach((doc) => {
      if (doc.exists()) setPending(true)
    })
  }

  const addFriend = async (e) => {
    e.preventDefault();
    const newFriendsRef = doc(collection(db, 'friends'))
    await setDoc(newFriendsRef, {
      pending: true,
      accepted: false,
      requestedBy: user.uid,
      requestedFrom: id,
      [user.uid]: true,
      [id]: true,
      added: serverTimestamp()
    })
    resetState();
    checkFriendStatus();
  }

  const resetState = () => {
    setFriend(false)
    setPending(false)
  }
  
  useEffectOnce(() => {
    checkFriendStatus();
  }, [])

  if ( !friend && !pending ) {
    return (
      <button
        onClick={addFriend} 
        className="bg-[#382110] hover:bg-[#58371F] text-white p-4 rounded-[3px]">
        Add Friend
      </button>
    )
  }

  if ( !friend && pending ) {
    return (
      <div
        className="bg-[#f2f2f2] border-[#dddddd] border-[0.8px] rounded-[3px] p-4">
        Friend Request Pending
      </div>
    )
  }

  if ( friend) {
    return (
      <div
        className="bg-[#f2f2f2] border-[#dddddd] border-[0.8px] rounded-tl-[3px] rounded-bl-[3px] p-2 flex justify-center items-center overflow-x-hidden">
        <span 
          className="bg-[url('assets/check.png')] bg-no-repeat bg-left text-transparent">
          del
        </span>
        Friends
      </div>
    )
  }
}