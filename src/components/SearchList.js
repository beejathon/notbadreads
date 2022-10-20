import React from "react";
import { BookCard } from "./BookCard";

export const SearchList = ({books}) => {
  return (
    <>
      {books?.map((book, index) => (
        <div key={index}>
          <BookCard id={book.id} book={book.volumeInfo} />
        </div>
      ))}
    </>   
  )
}
