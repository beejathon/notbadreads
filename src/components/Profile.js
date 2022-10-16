import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [shelves, setShelves] = useState([]);
  const [feed, setFeed] = useState([]);
  const {id} = useParams();

  const syncProfile = useCallback(async () => {
    const docRef = doc(db, 'users', id)
    const profRef = await getDoc(docRef)
    setProfile(profRef.data())
  }, [id]) 
  
  const syncShelves = useCallback(async () => {
    const q = query(collection(db, 'users', id, 'mybooks'))
    const shelves = await getDocs(q);
    setShelves(shelves.docs);
  }, [id]) 

  const syncFeed = useCallback(async () => {
    const q = query(
      collection(db, 'updates'),
      where('user', '==', id)
    );
    const feedRef = await getDocs(q);
    console.log(feedRef)
  }, [id]) 

  useEffect(() => {
    syncProfile();
    syncShelves();
  }, [syncProfile, syncShelves])

  return (
    <div id="profileContainer" className="flex flex-col h-screen items-center">
      <div id="profileHeader" className="flex flex-row mb-10 gap-4">
        { profile 
          ? <>
              <div id="headerLeft" className="flex flex-col gap-1">
                <img 
                  className="rounded-full w-full"
                  src={profile.icon || "assets/profile_placeholder.png"} alt={profile.name} />
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
      <div id="shelvesContainer" className="flex flex-col gap-4">
        <p className="uppercase font-[700] text-[12px]">
          {profile != null ? profile.name: ''}'s favorite books
        </p>
        <div id="favorites" className="flex flex-row gap-2">
          { shelves.map((book, index) => {
              if (book.data().shelf.length > 1) {
                return (
                  <span key={index}>
                    <Link to={`/books/${book.data().id}`}>
                      <img
                        className="h-60" 
                        src={book.data().cover} 
                        alt={book.data().title} />
                    </Link>
                  </span>
                )
              } else {
                return null;
              }
            })
          }
        </div>
        <p className="uppercase font-[700] text-[12px]">
          {profile != null ? profile.name : ''} is currently reading
        </p>
        <div id="currentlyReading" className="flex flex-row gap-2">
          { shelves.map((book, index) => {
              if (book.data().shelf[0] === 'Currently reading') {
                return (
                  <span key={index}>
                    <Link to={`/books/${book.data().id}`}>
                      <img
                        className="h-60" 
                        src={book.data().cover} 
                        alt={book.data().title} />
                    </Link>
                  </span>
                )
              } else {
                return null;
              }
            })
          }
        </div>
      </div>
    </div>
  )
}