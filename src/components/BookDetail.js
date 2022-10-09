import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ReviewsList } from "./ReviewsList";

export const BookDetail = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();

  const fetchBook = useCallback(async() => {
    const apiKey = 'AIzaSyAIVABDn3ZZJIiSt3HhDgtZPa3hcueYqKw'
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
    )
    const data = await response.json();
    setBook(data.volumeInfo)
  }, [id])
  
  useEffect(() => {
    fetchBook()
  }, [fetchBook])

  return (
    <div id="bookContainer" className="flex flex-col h-auto">
      { book 
        ? <div className="flex flex-row p-2 m-2">
            <img 
              src={book.imageLinks.thumbnail} 
              alt={book.title} 
              className="object-scale-down leading-none place-self-start"
            />
            <div className="flex flex-col m-2">
              <div>
                <span className="text-2xl font-bold">{book.title}</span>
                { book.subtitle === undefined 
                  ? ''
                  : <span className="text-2xl font-bold">: {book.subtitle}</span>
                }
              </div>
              { book.authors.length === 1
                ? <div className="text-xl">by <span>{book.authors[0]}</span></div>
                : <div className="text-xl">by 
                    {book.authors.map((author, index, array) => {
                      if (index === array.length - 1) {
                        return <span key={index}> {author}</span>
                      } else {
                        return <span key={index}> {author}, </span>
                      }
                    })}
                  </div>
                }
              <div 
                dangerouslySetInnerHTML={ {__html: book.description} } 
                className="mt-4"  
              />
              <div>{book.pageCount}</div>  
              <div>{book.publishedDate}</div>  
              <div>{book.publisher}</div>  
              <Link to={`/review/edit/${id}`}>
                <button className="place-self-center rounded-md m-2 p-1 border-[#D6D0C4] border-[0.3px] bg-[#F4F1EA]">
                  Write a review
                </button>
              </Link>
            </div>
          </div>
        : <div>Loading...</div> 
      }
      <ReviewsList id={id} />
    </div>
  );
}