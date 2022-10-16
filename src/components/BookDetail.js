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
    <div id="bookContainer" className="flex flex-col h-auto w-screen items-center">
      { book 
        ? <div className="flex flex-row p-2 m-2 w-8/12">
            <img 
              src={book.imageLinks.thumbnail} 
              alt={book.title} 
              className="mr-4 object-scale-down leading-none place-self-start shadow-[0px_5px_5px_0px_rgba(221,221,221)]"
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
              <div id="rating">
                {/* { <>
                    {[...Array(5)].map((star, index) => {
                      index +=1;
                      return (
                      <span id={star} className={index <= review.rating ? "text-[#fc7600] text-xl -mr-[6px]" : "text-[#ccc] text-xl -mr-[6px]"}>&#9733;</span>
                      )
                    })}
                  </>
                } */}
              </div>
              <div 
                dangerouslySetInnerHTML={ {__html: book.description} } 
                className="mt-4 mb-2"  
              />
              <div className="text-[#333] text-[13px]">{book.pageCount} pages</div>  
              <div className="text-[#333] text-[13px]">Published {book.publishedDate} by {book.publisher}</div>
              <button className="place-self-start rounded-[3px] mt-4 p-1 border-[#D6D0C4] border-[0.3px] bg-[#F4F1EA] hover:bg-[#ede6d6] text-[#333] text-[14px] pt-[8px] pb-[8px] pl-[12px] pr-[12px]">
                <Link to={`/review/edit/${id}`}>Write a review</Link>
              </button>
            </div>
          </div>
        : <div>Loading...</div> 
      }
      <ReviewsList id={id} />
    </div>
  );
}