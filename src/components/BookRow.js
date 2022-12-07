import React from "react";
import { Link } from "react-router-dom";

export const BookRow = ({book}) => {
  return (
    <tr key={book.data().id}>
      <td>
        <Link to={`/books/${book.data().id}`}>
          <img 
            src={book.data().cover}
            alt={book.title}
            className="w-20 shadow-[0px_5px_5px_0px_rgba(221,221,221)]"
          />
        </Link>
      </td>
      <td>{book.data().title}</td>
      <td>
        <div>{book.data().author[0]}</div>
        {book.data().author.length > 1 
        ? <div>{book.data().author[1]}</div>
        : null}
      </td>
      <td>{book.data().read && new Date(book.data().read.seconds * 1000).toLocaleDateString("en-US")}</td>
      <td>{new Date(book.data().added.seconds * 1000).toLocaleDateString("en-US")}</td>
    </tr>
  )
}