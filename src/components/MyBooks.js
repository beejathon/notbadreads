import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { BookRow } from "./BookRow";

export const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [shelf, setShelf] = useState('All');
  const [user] = useAuthState(auth)

  const fetchBooks = async () => {
    const q = query(
      collection(db, `users/${user.uid}/mybooks`),
      orderBy('added', 'desc')
    )

    const qSnap = await getDocs(q);
    qSnap.forEach((book) => {
      setBooks((previousState) => [...previousState, book])
    })
  }

  useEffectOnce(() => {
    fetchBooks();
  })

  return (
    <div id="myBooks" className="flex flex-col w-3/5 h-screen p-4 gap-6">
      <p className="uppercase font-[700] text-[#333] text-[14px]">My Books</p>
      <div id="main" className="flex flex-row gap-2">
        <div id="menuLeft" className="flex flex-col w-1/5 gap-4">
          <p>Bookshelves</p>
          <ul className="flex flex-col gap-2">
            <li
              className="cursor-pointer hover:underline text-[#00635d]" 
              onClick={(e) => setShelf(e.target.id)} 
              id="All">All
            </li>
            <li 
              className="cursor-pointer hover:underline text-[#00635d]" 
              onClick={(e) => setShelf(e.target.id)} 
              id="Read">Read
            </li>
            <li 
              className="cursor-pointer hover:underline text-[#00635d]" 
              onClick={(e) => setShelf(e.target.id)} 
              id="Currently reading">Currently reading
            </li>
            <li 
              className="cursor-pointer hover:underline text-[#00635d]" 
              onClick={(e) => setShelf(e.target.id)} 
              id="Want to read">Want to read
            </li>
            <li 
              className="cursor-pointer hover:underline text-[#00635d]" 
              onClick={(e) => setShelf(e.target.id)} 
              id="Favorites">Favorites
            </li>
          </ul>
        </div>
        <div id="shelves" className="flex flex-col w-4/5">
          <table className="table-auto border-spacing-6 border-separate">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author(s)</th>
                <th>Date read</th>
                <th>Date added</th>
              </tr>
            </thead>
            <tbody>
            { shelf === 'All'
              ? books.map((book) => {
                return (
                  <>
                    <BookRow book={book} />
                  </>
                )
              })
              : books
                .filter((book) => {
                  return book.data().shelf.includes(shelf)
                })
                .map((book) => {
                  return (
                    <>
                      <BookRow book={book} />
                    </>
                  )
                })
            }
            </tbody>
          </table>
      </div>
      </div>
    </div>
  )
}