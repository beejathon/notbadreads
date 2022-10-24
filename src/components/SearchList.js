import React from "react";
import { BookCard } from "./BookCard";

export const SearchList = ({books}) => {
  return (
    <div id="searchListContainer" className="flex flex-col flex-0 items-left gap-4">
      {books?.map((book) => (
        <div key={book.id}>
          <BookCard book={{id: book.id, ...book.volumeInfo}} />
        </div>
      ))}
    </div>
  )
}
