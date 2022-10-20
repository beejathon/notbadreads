import { collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";

export const BookButton = (
  {
  cover, 
  title, 
  subtitle, 
  authors, 
  id
  }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [bookStatus, setBookStatus] = useState(null)
  const [user] = useAuthState(auth)

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
    const bookRef = doc(db, 'users', user.uid, 'mybooks', id)
    const book = await getDoc(bookRef)
    if (!book.exists()) {
      addBook(shelf, bookRef);
    } else {
      updateBook(shelf, bookRef);
    }
    await syncStatus();
  }

  const addBook = async (shelf, bookRef) => {
    let data;
    if (shelf === 'Favorites') {
      data = {
        id: id,
        cover: cover,
        title: title,
        subtitle: subtitle,
        author: authors,
        shelf: ['Read', 'Favorites'],
        read: serverTimestamp(),
        added: serverTimestamp()
      }
      await setDoc(bookRef, data)
    } else if (shelf === 'Read') {
      data = {
        id: id,
        cover: cover,
        title: title,
        subtitle: subtitle,
        author: authors,
        shelf: [shelf],
        read: serverTimestamp(),
        added: serverTimestamp()
      }
      await setDoc(bookRef, data)
    } else {
      data = {
        id: id,
        cover: cover,
        title: title,
        subtitle: subtitle,
        author: authors,
        shelf: [shelf],
        added: serverTimestamp()
      }
      await setDoc(bookRef, data)
    }
    await syncStatus();
    await updateFeed(shelf);
  }

  const updateBook = async (shelf, bookRef) => {
    if (shelf === 'Read') {
      await updateDoc(bookRef, {
        shelf: [shelf],
        read: serverTimestamp()
      })
    } else if (shelf === 'Favorites') {
      await updateDoc(bookRef, {
        shelf: ['Read', 'Favorites'],
        read: serverTimestamp()
      })
    } else {
      await updateDoc(bookRef, {
        shelf: [shelf],
        read: null,
      })
    }
    await syncStatus();
    await updateFeed(shelf)
  }

  const unshelve = async () => {
    const bookRef = doc(db, 'users', user.uid, 'mybooks', id);
    await deleteDoc(bookRef);
    await syncStatus();
  }

  const syncStatus = useCallback(async () => {
    let status = null;
    const bookRef = doc(db, 'users', user.uid, 'mybooks', id)
    const book = await getDoc(bookRef)
    if (book.exists() && book.data().shelf.length > 1) status = 'Read';
    if (book.exists()) status = book.data().shelf[0];
    setBookStatus(status);
  }, [user, id]) 

  const updateFeed = async (shelf) => {
    const newUpdateRef = doc(collection(db, 'updates'));
    let data;
    if (shelf === 'Want to read') {
      data = {
        userId: user.uid,
        userName: user.displayName,
        userIcon: user.photoURL,
        desc: 'wants to read',
        bookId: id,
        bookCover: cover,
        bookTitle: title,
        bookSubtitle: subtitle,
        bookAuthors: authors,
        added: serverTimestamp()
      }
    }
    if (shelf === 'Currently reading') {
      data = {
        userId: user.uid,
        userName: user.displayName,
        userIcon: user.photoURL,
        desc: 'started reading',
        bookId: id,
        bookCover: cover,
        bookTitle: title,
        bookSubtitle: subtitle,
        bookAuthors: authors,
        added: serverTimestamp()
      }
    }
    if (shelf === 'Read') {
      data = {
        userId: user.uid,
        userName: user.displayName,
        userIcon: user.photoURL,
        desc: 'finished reading',
        bookId: id,
        bookCover: cover,
        bookTitle: title,
        bookSubtitle: subtitle,
        bookAuthors: authors,
        added: serverTimestamp()
      }
    }
    await setDoc(newUpdateRef, data)
  }

  useEffect(() => {
    syncStatus();
  }, [syncStatus])

  return (
    <div className="m-2 w-[180px] flex flex-row flex-0 h-[30px] justify-center items-between relative">
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