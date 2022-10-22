import React from "react";
import { BookCard } from "./BookCard";

export const SearchList = ({books}) => {
  return (
    <div id="searchListContainer" className="flex flex-col flex-0 items-left gap-4">
      {books?.map((book, index) => (
        <div key={index}>
          <BookCard id={book.id} />
        </div>
      ))}
    </div>
  )
}
