import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { StarRating } from "./StarRating";

export const ReviewEdit = () => {
  const [rating, setRating] = useState(null);
  const [text, setText] = useState('Enter your review (optional)');
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.target.value)
  }

  const onRatingSelect = (index) => {
    setRating(index)
  }

  const fetchBook = useCallback(async() => {
    const apiKey = 'AIzaSyAIVABDn3ZZJIiSt3HhDgtZPa3hcueYqKw'
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
    )
    const data = await response.json();
    setBook(data.volumeInfo)
  }, [id])
  
  const fetchReview = useCallback(async() => {
    const q = query(
      collection(db, 'reviews'), 
      where('user', '==', auth.currentUser.uid),
      where('id', '==', id)
      )
    const docs = await getDocs(q)
    docs.forEach((doc) => {
      if (doc.exists) {
        setRating(doc.data().rating)
        setText(doc.data().text)
      }
    })
 
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'reviews', id), {
      id: id,
      user: auth.currentUser.uid,
      userName: auth.currentUser.displayName,
      userIcon: auth.currentUser.photoURL,
      rating: rating,
      text: text,
      likes: [0],
      added: serverTimestamp()
    })
    navigate(`/books/${id}`)
  }

  useEffect(() => {
    fetchBook();
    fetchReview();
  }, [fetchBook, fetchReview])

  return (
    <div id="reviewEditContainer" className="flex flex-col h-screen">
      { book
        ? <div 
            id="reviewEditHeader" 
            className="flex flex-row p-2 m-2">
            <img 
              src={book.imageLinks.thumbnail} 
              alt={book.title} 
              className="object-scale-down leading-none"
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
            </div>
          </div>
        : null
      }
      <div id="reviewEditBody" className="flex flex-col m-2 p-2 h-screen">
        <div id="reviewRating" className="mb-2">
          <StarRating rating={rating} onRatingSelect={onRatingSelect} />
        </div>
        <div id="reviewTextInput">
          <input 
            className="bg-[#FFFFFF] border-[#DCD6CC] border-[1px] rounded-[3px] resize-y w-8/12 h-80 text-start align-text-top inline-block"
            onChange={handleChange} 
            type="textarea" 
            value={text} />
        </div>
        <button 
          onClick={handleSubmit}
          className="place-self-start rounded-md m-2 p-1 border-[#D6D0C4] border-[0.3px] bg-[#F4F1EA]">
            Post
        </button>
      </div>
    </div>
  )
}