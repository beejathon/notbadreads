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
    <div id="bookContainer" className="flex flex-col w-screen items-center">
      { book 
        ? <div className="flex flex-row w-8/12">
            <div className="w-full justify-center">
              <Link to={`books/${id}`}>
                <img 
                  src={book.imageLinks.thumbnail} 
                  alt={book.title} 
                  className="object-scale-down leading-none place-self-start shadow-[0px_5px_5px_0px_rgba(221,221,221)]"
                />
              </Link>
            </div>
            <div className="flex flex-col">
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
              <div id="rating" className="flex flex-row items-center">
                { 
                  <div className="flex flex-row">
                    {[...Array(5)].map((star, index) => {
                      index +=1;
                      return (
                      <span id={star} className={index <= book.averageRating ? "text-[#fc7600] text-2xl -mr-[4px]" : "text-[#ccc] text-2xl -mr-[4px]"}>&#9733;</span>
                      )
                    })}
                  </div>
                }
                <span className="mx-2 text-[12px] text-[#999999]">
                  {book.averageRating ? `— ${book.averageRating} avg rating ` :'— No ratings'}
                  {book.ratingsCount ? `— ${book.ratingsCount} ratings` : null}
                </span>  
              </div>
              <div 
                dangerouslySetInnerHTML={ {__html: book.description} } 
                className="mt-4 mb-2"  
              />
              <div className="text-[#333] text-[13px]">{book.pageCount} pages</div>  
              <div className="text-[#333] text-[13px]">Published {book.publishedDate} by {book.publisher}</div>
              <Link to={`/review/edit/${id}`}>
                <button className="place-self-start rounded-[3px] mt-4 p-1 border-[#D6D0C4] border-[0.3px] bg-[#F4F1EA] hover:bg-[#ede6d6] text-[#333] text-[14px] pt-[8px] pb-[8px] pl-[12px] pr-[12px]">
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