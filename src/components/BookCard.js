import oops from '../assets/oops.jpg';
import { Link } from 'react-router-dom';
import { BookButton } from './BookButton';
import { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const BookCard = ({id}) => {
  const [book, setBook] = useState(null);
  const [ratingsCount, setRatingsCount] = useState(null)
  const [avgRating, setAvgRating] = useState(null);

  const fetchBook = useCallback(async() => {
    const apiKey = 'AIzaSyAIVABDn3ZZJIiSt3HhDgtZPa3hcueYqKw'
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
    )
    const data = await response.json();
    setBook(data.volumeInfo)
  }, [id])

  const syncRating = useCallback(async () => {
    const q = query(
      collection(db, 'ratings'),
      where('book', '==', id))
    const qSnap = await getDocs(q);

    if (book) {
      // get number of ratings
      const n = qSnap.docs.length;
      const m = book.ratingsCount;
      // if both exist, sync ratings from google books and firebase
      if (qSnap.docs.length > 0 && book.averageRating) {
        // get firebase average
        const a = qSnap.docs.reduce((prev, curr) => {
          return prev += curr.data().rating;
        }, 0) / n;
        // get google books average
        const b = book.averageRating;
        // get weighted average
        const weightedAvg = ((n/(m+n))*a) + ((m/(m+n))*b)
        const roundedAvg = Math.round(weightedAvg*10)/10
        setRatingsCount(n + m)
        setAvgRating(parseFloat(roundedAvg))
      }
      // sync ratings from firebase only if no google books ratings
      if (qSnap.docs.length > 0 && !book.averageRating) {
        const a = qSnap.docs.reduce((prev, curr) => {
          return prev += curr.data().rating;
        }, 0) / qSnap.docs.length;
        const avg = Math.round((a/n)*10)/10
        setAvgRating(avg)
        setRatingsCount(n)
      }
      // sync ratings from google books only if no firebase ratings
      if (qSnap.docs.length === 0 && book.averageRating !== undefined) {
        setAvgRating(book.averageRating)
        setRatingsCount(m)
      }
    }
  }, [book, id])

  useEffect(() => {
    fetchBook();
  }, [fetchBook])

  useEffect(() => {
    syncRating();
  }, [syncRating])

  return (
    <div className="flex flex-row m-2">
      { book ? 
        <>
          <Link to={`/books/${id}`}>
            <img 
              src=
                { book.imageLinks === undefined
                  ? oops
                  : book.imageLinks.thumbnail
                } 
              alt={book.title}
          />
          </Link>
          <div className='m-2'>
            <div>
              <Link to={`/books/${id}`}>
                <span>{book.title}</span>
                { book.subtitle === undefined 
                  ? ''
                  : <span>: {book.subtitle}</span>
                }
              </Link>
            </div>
            { book.authors.length === 1
              ? <div>by <span>{book.authors[0]}</span></div>
              : <div>by 
                  {book.authors.map((author, index, array) => {
                    if (index === array.length - 1) {
                      return <span key={index}> {author}</span>
                    } else {
                      return <span key={index}> {author}, </span>
                    }
                  })}
                </div>
              }
            <div className="flex flex-row p-2 items-center">
              { 
                <div className="flex flex-row gap-1">
                  {[...Array(5)].map((star, index) => {
                    index +=1;
                    return (
                    <span id={star} className={index <= avgRating ? "text-[#fc7600] text-xl -mr-[6px]" : "text-[#ccc] text-xl -mr-[6px]"}>&#9733;</span>
                    )
                  })}
                </div>
              }
              <span className="mx-2 text-[12px] text-[#999999]">
                {avgRating ? `— ${avgRating} avg rating ` :'— No ratings'}
                {ratingsCount ? `— ${ratingsCount} ratings` : null}
              </span>  
            </div>
            <BookButton 
              cover={book.imageLinks.thumbnail}
              title={book.title}
              subtitle={book.subtitle}
              authors={book.authors} 
              id={id} />
          </div>
        </>
        : <div>Loading...</div>
      }
    </div>
  )
}