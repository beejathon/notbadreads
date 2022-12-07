import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { UpdateCard } from "./UpdateCard";

export const Home = () => {
  const [reading, setReading] = useState([]);
  const [toRead, setToRead] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [user] = useAuthState(auth);

  const syncShelves = useCallback(async () => {
    const q1 = query(
      collection(db, 'users', user.uid, 'mybooks'),
      where('shelf', 'array-contains', 'Currently reading'),
      orderBy('added', 'desc'),
      limit(5)
    )
    const response1 = await getDocs(q1);
    setReading(response1.docs);

    const q2 = query(
      collection(db, 'users', user.uid, 'mybooks'),
      where('shelf', 'array-contains', 'Want to read'),
      orderBy('added', 'desc'),
      limit(5)
    )    
    const response2 = await getDocs(q2);
    setToRead(response2.docs);
  }, [user]) 

  const syncUpdates = useCallback(async() => {
    const q = query(
      collection(db, 'updates'),
      orderBy('added', 'desc')
    )
    const response = await getDocs(q)
    setUpdates(response.docs)
  }, [])

  useEffect(() => {
    syncShelves();
    syncUpdates();
  }, [syncShelves, syncUpdates])

  return (
    <div id="main" className="w-screen h-screen flex flex-row flex-1 justify-evenly">
      <div id="aside" className="flex flex-col">
        <div id="reading" className="flex flex-col gap-4">
          <p className="uppercase font-[700] text-[#333] text-[14px]">Currently reading</p>
          { reading.length > 0 ? (
            reading.map((book) => {
              return (
                <div key={book.data().added}>
                  <Link to={`/books/${book.data().id}`}>
                    <img
                      className="w-26" 
                      src={book.data().cover} 
                      alt={book.data().title} />
                  </Link>
                </div>
              )
            })
          ) : (
            <div>Nothing here yet...</div>
          )}
        </div>
        <div id="wantToRead" className="flex flex-col gap-4">
          <p className="uppercase font-[700] text-[#333] text-[14px] mt-10">Want to read</p>
          { toRead.length > 0 ? (
            toRead.map((book) => {
              return (
                <div key={book.data().added}>
                  <Link to={`/books/${book.data().id}`}>
                    <img
                      className="w-26" 
                      src={book.data().cover} 
                      alt={book.data().title} />
                  </Link>
                </div>
              )
            })
          ) : (
            <div>Nothing here yet...</div>
          )}
        </div>
      </div>
      <div id="updates" className="flex flex-col gap-8 w-3/8">
        <p className="text-[14px] text-[#333] font-[700] uppercase">Updates</p>
        { updates.map((update) => {
            return (
              <div key={update.data().id}>
                <UpdateCard update={update} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}