import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";

export const BookButton = ({book}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [bookStatus, setBookStatus] = useState(null)

  const displayMenu = () => {
    setShowMenu(true)
  }

  const hideMenu = () => {
    setShowMenu(false)
  }

  const shelve = async (e) => {
    e.preventDefault();
    hideMenu();
    const shelf = e.target.id;
    const user = auth.currentUser.uid;
    if (shelf === 'Favorites') {
      const bookRef = getDoc(doc(db, 'users', user, 'Read', book))
      if (bookRef.exists) {
        await setDoc(doc(db, 'users', user, shelf, book), {
          id: book,
          added: serverTimestamp()
        })
      } else {
        await cleanShelves();
        await setDoc(doc(db, 'users', user, 'Read', book), {
          id: book,
          added: serverTimestamp()
        })
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
    await syncStatus();
  }

  const unshelve = async () => {
    const user = auth.currentUser.uid;
    const shelf = bookStatus;
    if (bookStatus === 'Read') {
      const bookRef = await getDoc(doc(db, 'users', user, 'Favorites', book))
      if (bookRef.exists) {
        await deleteDoc(doc(db, 'users', user, shelf, book));
        await deleteDoc(doc(db, 'users', user, 'Favorites', book));
      } else {
        await deleteDoc(doc(db, 'users', user, shelf, book));
      }
    }
    await deleteDoc(doc(db, 'users', user, shelf, book));
    await syncStatus();
  }


  const cleanShelves = async () => {
    const user = auth.currentUser.uid;
    await deleteDoc(doc(db, 'users', user, 'Want to read', book))
    await deleteDoc(doc(db, 'users', user, 'Currently reading', book))
    await deleteDoc(doc(db, 'users', user, 'Read', book))
    await deleteDoc(doc(db, 'users', user, 'Favorites', book))
  }

  const syncStatus = async () => {
    const user = auth.currentUser.uid;
    let status = null;
    const bookRef0 = await getDoc(doc(db, 'users', user, 'Want to read', book))
    if (bookRef0.exists()) status = 'Want to read';
    const bookRef1 = await getDoc(doc(db, 'users', user, 'Currently reading', book))
    if (bookRef1.exists()) status = 'Currently reading';
    const bookRef2 = await getDoc(doc(db, 'users', user, 'Read', book))
    if (bookRef2.exists()) status = 'Read';
    setBookStatus(status);
  }

  useEffect(() => {
    syncStatus();
  }, [])

  return (
    <div className="m-2 w-[180px] flex flex-row flex-auto h-[30px] justify-center items-between relative">
      { bookStatus === null
        ? <div 
            id="btnLeftUnshelved" 
            className="hover:bg-[#3d9363] bg-[#409D69] rounded-tl-[3px] rounded-bl-[3px] w-[140px] h-[100%] flex justify-center items-center overflow-x-hidden">
            <span
              onClick={shelve}
              id="Want to read" 
              className="cursor-pointer text-white text-[14px] font-[700]">
                Want to read
            </span>
          </div>
        : <div 
            id="btnLeftShelved" 
            className="bg-[#f2f2f2] border-[#dddddd] border-[0.8px] rounded-tl-[3px] rounded-bl-[3px] w-[140px] h-[100%] flex justify-center items-center overflow-x-hidden">
            <span 
              onClick={unshelve}
              className="cursor-pointer hover:bg-[url('assets/del.png')] bg-[url('assets/check.png')] bg-no-repeat bg-left text-transparent">
              del
            </span>
            <span className="text-[#181818] text-[13px] font-[700]">
              {bookStatus}
            </span>
          </div>
      }

      <div 
        onMouseOver={displayMenu} 
        id="btnRight" 
        className="relative hover:bg-[#3d9363] bg-[#409D69] border-l-[#38883d] border-l-[0.8px] rounded-tr-[3px] rounded-br-[3px] h-[100%] flex flex-row flex-auto justify-center ">
        <button className="w-[27px]">
          <div className="bg-[url('assets/arrow.png')] bg-no-repeat bg-center bg-[length:8px_4px]">
            <span className="text-transparent">menu</span>
          </div>
        </button>
        { showMenu
          ? <div 
              onMouseLeave={hideMenu} 
              className="absolute top-[25px] right-0 z-50 min-w-[140px] bg-white border-[#333333] border-solid border-[0.8px] rounded-sm">
              <li 
                onClick={shelve} 
                id="Want to read" 
                className="list-none hover:bg-[#D8D8D8] p-[0.8px] text-[12px] cursor-pointer">
                  Want to read
              </li>
              <li 
                onClick={shelve} 
                id="Currently reading" 
                className="list-none hover:bg-[#D8D8D8] p-[0.8px] text-[12px] cursor-pointer">
                  Currently reading
              </li>
              <li 
                onClick={shelve} 
                id="Read" 
                className="list-none hover:bg-[#D8D8D8] p-[0.8px] text-[12px] cursor-pointer">
                  Read
              </li>
              <li 
                onClick={shelve} 
                id="Favorites" 
                className="list-none hover:bg-[#D8D8D8] p-[0.8px] text-[12px] cursor-pointer">
                  Favorites
              </li>
            </div>
          : null
        }
      </div>
    </div>
  )
}