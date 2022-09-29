import React, { useCallback, useEffect, useState } from "react";
import oops from '../assets/oops.jpg'

const SearchList = ({terms}) => {
  const [books, setBooks] = useState([])

  const fetchBooks = useCallback(async() => {
    const apiKey = 'AIzaSyAIVABDn3ZZJIiSt3HhDgtZPa3hcueYqKw'
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${terms}&orderBy=relevance&maxResults=10&key=${apiKey}`, {mode: 'cors'}
    )
    const data = await response.json();
    setBooks(data.items)
  }, [terms])

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks])

  return (
    <>
      {books?.map(book => (
        <div key={book.id}>
          <img 
            src={
              book.volumeInfo.imageLinks === undefined
                ? oops
                : book.volumeInfo.imageLinks.thumbnail
              } 
            alt={book.volumeInfo.title}
          />
        </div>
      ))}
    </>   
  )
}

export default SearchList;