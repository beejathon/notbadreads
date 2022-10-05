import React from "react";
import { BookCard } from "./BookCard";

export const SearchList = ({books}) => {
  return (
    <>
      {books?.map(book => (
        <BookCard key={book.id} id={book.id} book={book.volumeInfo} />
      ))}
    </>   
  )
}
