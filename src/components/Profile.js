import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { auth, db } from "../config/firebase";
import placeholder from "../assets/profile_icon.png"
import { UpdateCard } from "./UpdateCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { AddFriendButton } from "./AddFriendButton";

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [reading, setReading] = useState([]);
  const [updates, setUpdates] = useState([]);
  const {id} = useParams();
  const [user] = useAuthState(auth);

  const syncProfile = useCallback(async () => {
    const docRef = doc(db, 'users', id)
    const profRef = await getDoc(docRef)
    setProfile(profRef.data())
  }, [id]) 
  
  const syncShelves = useCallback(async () => {
    const q1 = query(
      collection(db, 'users', id, 'mybooks'),
      where('shelf', 'array-contains', 'Favorites'),
      orderBy('added', 'desc'),
      limit(5)
    )
    const response1 = await getDocs(q1);
    setFavorites(response1.docs);

    const q2 = query(
      collection(db, 'users', id, 'mybooks'),
      where('shelf', 'array-contains', 'Currently reading'),
      orderBy('added', 'desc'),
      limit(5)
    )    
    const response2 = await getDocs(q2);
    setReading(response2.docs);
  }, [id]) 

  const syncUpdates = useCallback(async() => {
    const q = query(
      collection(db, 'updates'),
      where('userId', '==', id),
      orderBy('added', 'desc')
    )
    const response = await getDocs(q)
    setUpdates(response.docs)
  }, [id])

  useEffect(() => {
    syncProfile();
    syncShelves();
    syncUpdates();
  }, [syncProfile, syncShelves, syncUpdates])

  return (
    <div id="profileContainer" className="flex flex-col h-auto items-center gap-8">
      <div id="profileHeader" className="flex flex-row mb-10 gap-4">
        { profile ? 
          <>
            <div id="headerLeft" className="flex flex-col gap-1">
              <img 
                className="rounded-full w-full"
                referrerPolicy="no-referrer"
                src={profile.icon || placeholder}
                alt="profile icon" />
            </div>
            <div id="headerRight" className="flex flex-col">
              <p className="font-[700] text-[20px]">
                {profile.name}
              </p>
              <div id="separator" className="border-b-[0.8px] border-[#eee] mt-2 mb-2"></div>
              <p>
                <span className="font-[700] text-[14px]">Location: </span>
                <span className="text-[12px]">{profile.location || 'Unknown'}</span>
              </p>
              <p className="whitespace-pre-line">{profile.about || null}</p>
            </div>
          </>
          : <div>Loading...</div>
        }
      </div>
      { user.uid === id ? null : <AddFriendButton id={id} /> }
      <div id="shelvesContainer" className="flex flex-col gap-4 items-center">
        <p className="uppercase font-[700] text-[12px]">
          {profile !== null ? profile.name : ''}'s favorite books
        </p>
        <div id="favorites" className="flex flex-row gap-2 overflow-x-scroll">
          { favorites.map((book) => {
              return (
                <span key={book.data().added}>
                  <Link to={`/books/${book.data().id}`}>
                    <img
                      className="h-60" 
                      src={book.data().cover} 
                      alt={book.data().title} />
                  </Link>
                </span>
              )
            })
          }
        </div>
        <p className="uppercase font-[700] text-[12px]">
          {profile != null ? profile.name : ''} is currently reading
        </p>
        <div id="currentlyReading" className="flex flex-row gap-2 overflow-x-scroll">
          { reading.map((book) => {
              return (
                <span key={book.data().added}>
                  <Link to={`/books/${book.data().id}`}>
                    <img
                      className="h-60" 
                      src={book.data().cover} 
                      alt={book.data().title} />
                  </Link>
                </span>
              )
            })
          }
        </div>
      </div>
      <div id="updates" className="flex flex-col gap-8 w-3/8 h-auto">
        <p className="text-[14px] text-[#333] font-[700] uppercase">{profile != null ? profile.name : ''}'s recent updates</p>
        { updates.map((update, index) => {
            return (
              <div key={index}>
                <UpdateCard update={update} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}