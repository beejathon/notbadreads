import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { FriendCard } from "./FriendCard";
import { RequestCard } from "./RequestCard";

const initialState = [];

export const Friends = () => {
  const [friendList, setFriendList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [user] = useAuthState(auth);

  const fetchRequests = (async () => {
    const q = query(
      collection(db, 'friends'),
      where('requestedFrom', '==', user.uid),
      where('pending', '==', true)
    )

    const qSnap = await getDocs(q);
    qSnap.docs?.forEach(async (document) => {
      const requesterId = document.data().requestedBy
      const docRef = doc(db, 'users', requesterId);
      const requester = await getDoc(docRef)
      const newRequest = {...requester.data(), requestId: document.id}
      setRequests((previousState) => [...previousState, newRequest])
    })
  }) 

  const fetchFriends = (async () => {
    let friendIds = [];
    const q = query(
      collection(db, 'friends'),
      where(user.uid, '==', true),
      where('accepted', '==', true)
    )

    const qSnap = await getDocs(q)
    qSnap.docs?.forEach((doc) => {
      if (doc.data().requestedBy === user.uid) {
        friendIds = [...friendIds, doc.data().requestedFrom]
      } else {
        friendIds = [...friendIds, doc.data().requestedBy]
      }
    })

    friendIds.forEach(async (id) => {
      const docRef = doc(db, 'users', id)
      const friend = await getDoc(docRef)
      setFriendList((previousState) => [...previousState, friend])
    })
  })

  const acceptFriend = async (requestId, requesterId) => {
    const docRef = doc(db, 'friends', requestId)
    await updateDoc(docRef, {
      accepted: true,
      pending: false,
      added: serverTimestamp()
    })
    resetState();
    fetchFriends();
    fetchRequests();
    updateFeed(requesterId);
    console.log('friend accepted')
  }

  const rejectFriend = async (id) => {
    const docRef = doc(db, 'friends', id)
    await updateDoc(docRef, {
      rejected: true,
      pending: false,
      added: serverTimestamp()
    })
    resetState();
    fetchRequests();
  }

  const resetState = () => {
    setRequests(initialState);
    setFriendList(initialState);
  }

  const updateFeed = async (requesterId) => {
    const docRef = doc(db, 'users', requesterId);
    const requester = await getDoc(docRef)
    const newUpdateRef = doc(collection(db, 'updates'));
    await setDoc(newUpdateRef, {
      requesteeId: user.uid,
      requestee: user.displayName,
      requesteeIcon: user.photoURL,
      requesterId: requesterId,
      requester: requester.data().name,
      requesterIcon: requester.data().icon,
      desc: 'is now friends with',
      added: serverTimestamp()
    })
  }

  useEffectOnce(() => {
    fetchFriends();
    fetchRequests();
  })

  useEffect(() => {
    console.log(friendList)
  }, [friendList])

  return (
    <div className="flex flex-col w-full h-screen p-4">
      {requests.length > 0 
        ? <p className="uppercase font-[700] text-[#333] text-[14px]">Requests</p> 
        : null 
      }
      <div id="requestsList" className="flex flex-col w-full">
        {requests?.map((request) => {
          return (
            <RequestCard key={request.id} request={request} onAccept={acceptFriend} onReject ={rejectFriend} />
          )
        })}
      </div>
      <p className="uppercase font-[700] text-[#333] text-[14px]">Friends</p>
      <div id="friendList">
          {friendList?.map((friend) => {
            return (
              <FriendCard key={friend.data().id} friend={friend} />
            )
          })}
      </div>
    </div>
  )
}