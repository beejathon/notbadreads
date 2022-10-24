import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";

export const Friends = () => {
  const [friendList, setFriendList] = useState([]);
  const [user] = useAuthState(auth);

  const fetchFriends = useCallback(async () => {
    const q = query(
      collection(db, 'friends'),
      where('userIds', 'array-contains', user.uid)
    )

    const qSnap = await getDocs(q)
    qSnap.docs.forEach((doc) => {
      doc.data().userIds.forEach((id) => {
        if (id != user.uid)
        setFriendList(...friendList, id)
      })
    })
  }, [])

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends])

  return (
    <div>

    </div>
  )
}