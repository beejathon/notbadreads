import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";

export const AddFriendButton = ({id}) => {
  const [user] = useAuthState(auth);

  const addFriend = async (e) => {
    e.preventDefault();
    const newFriendsRef = doc(collection(db, 'friends'))
    await setDoc(newFriendsRef, {
      pending: true,
      accepted: false,
      rejected: false,
      requestedBy: user.uid,
      requestedFrom: id,
      userIds: [user.uid, id],
      added: serverTimestamp()
    })
    console.log('Friend requested')
  }

  return (
    <button
      onClick={addFriend} 
      className="bg-[#382110] hover:bg-[#58371F] text-white p-4 rounded-[3px]">
      Add Friend
    </button>
  )
}