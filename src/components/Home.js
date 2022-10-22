import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { UpdateCard } from "./UpdateCard";

export const Home = () => {
  const [shelves, setShelves] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [user] = useAuthState(auth);

  const syncShelves = useCallback(async () => {
    const q = query(collection(db, 'users', user.uid, 'mybooks'))
    const response = await getDocs(q);
    setShelves(response.docs);
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
          { shelves.map((book, index) => {
            if (book.data().shelf[0] === 'Currently reading') {
              return (
                <div key={index}>
                  <Link to={`/books/${book.data().id}`}>
                    <img
                      className="w-26" 
                      src={book.data().cover} 
                      alt={book.data().title} />
                  </Link>
                </div>
              )
            } else {
              return null;
            }
          })
          }
        </div>
        <div id="wantToRead" className="flex flex-col">

        </div>
      </div>
      <div id="updates" className="flex flex-col gap-8 w-3/8">
        <p className="text-[14px] text-[#333] font-[700] uppercase">Updates</p>
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