import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../config/firebase";

export const BookButton = ({book}) => {
  const [showMenu, setShowMenu] = useState(false);

  const displayMenu = () => {
    setShowMenu(true)
  }

  const hideMenu = () => {
    setShowMenu(false)
  }

  const handleClick = async (e) => {
    e.preventDefault();
    hideMenu();
    const shelf = e.target.id;
    const user = auth.currentUser.uid;
    if (shelf === 'favorites') {
      const bookRef = getDoc(doc(db, 'users', user, 'read', book))
      if (bookRef.exists === undefined) {
        await cleanShelves();
        await setDoc(doc(db, 'users', user, 'read', book), {
          id: book,
          added: serverTimestamp()
        })
        await setDoc(doc(db, 'users', user, shelf, book), {
          id: book,
          added: serverTimestamp()
        })
      } else {
        await setDoc(doc(db, 'users', user, shelf, book), {
          id: book,
          added: serverTimestamp()
        })
      }
    } else {
      await cleanShelves();
      await setDoc(doc(db, 'users', user, shelf, book), {
        id: book,
        added: serverTimestamp()
      })
    }
  }

  const cleanShelves = async () => {
    const user = auth.currentUser.uid;
    await deleteDoc(doc(db, 'users', user, 'want-to-read', book))
    await deleteDoc(doc(db, 'users', user, 'currently-reading', book))
    await deleteDoc(doc(db, 'users', user, 'read', book))
    await deleteDoc(doc(db, 'users', user, 'favorites', book))
  }

  return (
    <div className="bg-[#409D69] m-2 w-[180px] rounded-md flex flex-row flex-auto h-[30px] justify-center items-between relative">
      <div id="btnLeft" className="w-[140px] flex justify-center items-center">
        <span className="text-white">Want to Read</span>
      </div>
      <div onMouseOver={displayMenu} id="btnRight" className="relative border-[#38883d] border-l-[0.8px] h-[100%] flex flex-row flex-auto justify-center">
        <button className="w-[27px]">
          <div className="bg-[url('assets/arrow.png')] bg-no-repeat bg-center bg-[length:8px_4px]">
            <span className="text-transparent">menu</span>
          </div>
        </button>
        { showMenu
          ? <div onMouseLeave={hideMenu} className="float left absolute top-[25px] right-0 z-50 min-w-[140px] bg-white border-[#333333] border-solid border-[0.8px]">
              <li onClick={handleClick} id="want-to-read" className="list-none hover:bg-[#D8D8D8] p-[0.8px] text-[12px]">Want to read</li>
              <li onClick={handleClick} id="currently-reading" className="list-none hover:bg-[#D8D8D8] p-[0.8px] text-[12px]">Currently reading</li>
              <li onClick={handleClick} id="read" className="list-none hover:bg-[#D8D8D8] p-[0.8px] text-[12px]">Read</li>
              <li onClick={handleClick} id="favorites" className="list-none hover:bg-[#D8D8D8] p-[0.8px] text-[12px]">Favorites</li>
            </div>
          : null
        }

      </div>
    </div>
  )
}