import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { FriendCard } from "./FriendCard";
import { RequestCard } from "./RequestCard";

const initialState = [];

export const Friends = ({resetNav}) => {
  const [friendList, setFriendList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [user] = useAuthState(auth);
  const [selected, setSelected] = useState(null)
  const [showDialog, setShowDialog] = useState(false)

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
      const friendDoc = await getDoc(docRef)
      // get user's number of books
      const q1 = query(
        collection(db, 'users', id, 'mybooks')
      )
      const qSnap1 = await getDocs(q1)
      const bookCount = qSnap1.docs.length
      //get user's number of friends
      const q2 = query(
        collection(db, 'friends'),
        where(id, '==', true),
        where('accepted', '==', true)
      )
      const qSnap2 = await getDocs(q2)
      const friendCount = qSnap2.docs.length
      const friend = {
        ...friendDoc.data(),
        bookCount: bookCount,
        friendCount: friendCount,
      }
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
    resetNav();
    fetchFriends();
    fetchRequests();
    updateFeed(requesterId);
    console.log('friend accepted')
  }

  const rejectFriend = async (id) => {
    const docRef = doc(db, 'friends', id)
    await deleteDoc(docRef)
    resetState();
    fetchFriends();
    fetchRequests();
    resetNav();
  }

  const confirmRemove = (friendId) => {
    setSelected(friendId)
    setShowDialog(true);
  }

  const removeFriend = async () => {
    console.log(selected)
    const q = query(
      collection(db, 'friends'),
      where(user.uid, '==', true),
      where(selected, '==', true),
      where('accepted', '==', true)
    )

    const qSnap = await getDocs(q);
    qSnap.forEach(async (document) => {
      const docRef = doc(db, 'friends', document.id)
      await deleteDoc(docRef)
    })
    resetState();
    setShowDialog(false);
    fetchFriends();
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
    <div className="flex flex-col w-3/5 h-screen p-4 gap-6">
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
            <FriendCard key={friend.id} friend={friend} showConfirmationBox={confirmRemove} />
          )
        })}
      </div>
      { showDialog ? (
        <div id="dialogBox" className="flex flex-col gap-6 bg-white border-[#D8D8D8] items-center border-[1px] p-4">
          <p>Remove from your friends lst?</p>
          <div className="flex flex=row">
            <button 
              onClick={removeFriend}
              className="rounded-tl-[3px] rounded-bl-[3px] w-[140px] h-[100%]">
              <div className="bg-[url('assets/check.png')] bg-no-repeat bg-center text-transparent">
              confirm button
              </div>
            </button>
            <button 
              onClick={() => setShowDialog(false)}
              className="rounded-tl-[3px] rounded-bl-[3px] w-[140px] h-[100%]">
              <div className="bg-[url('assets/del.png')] bg-no-repeat bg-center text-transparent">
              cancel button
              </div>
            </button>
          </div>
        </div>
      ) : ( 
        null
      )}
    </div>
  )
}