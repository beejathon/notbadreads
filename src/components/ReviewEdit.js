import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { StarRating } from "./StarRating";

export const ReviewEdit = () => {
  const [rating, setRating] = useState(null);
  const [text, setText] = useState([]);
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.target.value)
  }

  const onRatingSelect = (index) => {
    setRating(index)
  }

  const fetchBook = useCallback(async() => {
    const apiKey = 'AIzaSyCCR3kcDEtKZO_rpIDBwJaLgrIfsRAMdlA'
    let url = 'https://www.googleapis.com/books/v1/volumes/';
    url += `${id}?key=${apiKey}`
    const response = await fetch(url, {mode: 'cors'})
    const data = await response.json();
    setBook(data.volumeInfo)
  }, [id])
  
  const fetchReview = useCallback(async() => {
    const q = query(
      collection(db, 'reviews'), 
      where('user', '==', user.uid),
      where('book', '==', id)
      )
    const qSnap = await getDocs(q)
    qSnap.forEach((doc) => {
      if (doc.exists) {
        setRating(doc.data().rating)
        setText(doc.data().text)
      }
    })
  }, [user, id])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewsQ = query(
      collection(db, 'reviews'),
      where('book', '==', id),
      where('user', '==', user.uid))
    const reviewsQSnap = await getDocs(reviewsQ);
    let reviewDocRef;
    let reviewDoc;
    reviewsQSnap.docs.forEach(async (document) => {
      reviewDocRef = doc(db, 'reviews', document.id)
      reviewDoc = await getDoc(reviewDocRef)
    });
    
    const ratingsQ = query(
      collection(db, 'ratings'), 
      where('book', '==', id),
      where('user', '==', user.uid))
    const ratingsQSnap = await getDocs(ratingsQ)
    let ratingDocRef;
    let ratingDoc;
    ratingsQSnap.docs.map(async (document) => {
      ratingDocRef = doc(db, 'ratings', document.id)
      ratingDoc = await getDoc(ratingDocRef)
    });

    if (text.length > 0 && reviewDoc === undefined) addReview(); 
    if (text.length > 0 && reviewDoc !== undefined) updateReview(reviewDocRef); 
    if (rating && ratingDoc === undefined) addRating();
    if (rating && ratingDoc !== undefined) updateRating(ratingDocRef);

    navigate(`/books/${id}`);
  }

  const addReview = async () => {
    const newReviewRef = doc(collection(db, 'reviews'));
    const reviewData = {
      desc: 'reviewed a book',
      book: id,
      user: user.uid,
      userName: user.displayName,
      userIcon: user.photoURL,
      rating: rating,
      text: text,
      likes: [0],
      added: serverTimestamp()
    }
    await setDoc(newReviewRef, reviewData)
    updateFeed(reviewData);
  }

  const updateReview = async (docRef) => {
    const reviewData = {
      desc: 'updated a review',
      book: id,
      user: user.uid,
      userName: user.displayName,
      userIcon: user.photoURL,
      rating: rating,
      text: text,
      likes: [0],
      added: serverTimestamp()
    }
    await setDoc(docRef, reviewData)
    updateFeed(reviewData);
  }

  const addRating = async () => {
    const newRatingRef = doc(collection(db, 'ratings'));
    const ratingData = {
      desc: 'rated a book',
      book: id,
      user: user.uid,
      userName: user.displayName,
      userIcon: user.photoURL,
      rating: rating,
      added: serverTimestamp()
    }
    await setDoc(newRatingRef, ratingData)
    if (text.length === 0) {
      updateFeed(ratingData);
      console.log('activity feed updated')
    }
  }

  const updateRating = async (docRef) => {
    const ratingData = {
      desc: 'rated a book',
      book: id,
      user: user.uid,
      userName: user.displayName,
      userIcon: user.photoURL,
      rating: rating,
      added: serverTimestamp()
    }
    const ratingRef = doc(db, 'ratings', docRef)
    await updateDoc(ratingRef, ratingData)
    if (text.length === 0) {
      updateFeed(ratingData);
      console.log('activity feed updated')
    }
  }

  const updateFeed = async (update) => {
    const newUpdateRef = doc(collection(db, 'updates'));
    await setDoc(newUpdateRef, {
      userId: user.uid,
      userName: user.displayName,
      userIcon: user.photoURL,
      desc: update.desc,
      ...rating && { rating: update.rating },
      bookId: id,
      bookCover: book.imageLinks.thumbnail,
      bookTitle: book.title,
      ...book.subtitle && { bookSubtitle: book.subtitle },
      bookAuthors: book.authors,
      added: serverTimestamp()
    })
  }

  useEffect(() => {
    fetchBook();
    fetchReview();
  }, [fetchBook, fetchReview])

  return (
    <div id="reviewEditContainer" className="flex flex-col items-center h-screen w-3/5">
      { book
        ? <div 
            id="reviewEditHeader" 
            className="flex flex-row p-2 m-2 w-full">
            <Link to={`/books/${id}`}>
              <img 
                src={book.imageLinks.thumbnail} 
                alt={book.title} 
                className="object-scale-down leading-none"
              />
            </Link>
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
      <div id="reviewEditBody" className="flex flex-col m-2 p-2 w-full h-screen">
        <div id="reviewRating" className="flex flex-row gap-1 items-center mb-2">
          <span>My rating:</span>
          <StarRating rating={rating} onRatingSelect={onRatingSelect} />
        </div>
        <div id="separator" className="border-b-[0.8px] border-[#eee] text-[14px] text-[#181818] mb-2"></div>
        <div id="reviewTextInput">
          <p>What did you think?</p>
          <textarea 
            className="bg-[#FFFFFF] border-[#DCD6CC] border-[1px] rounded-[3px] resize-y w-full h-80 text-start align-text-top inline-block"
            onChange={handleChange} 
            placeholder="Enter your review (optional)"
            value={text} />
        </div>
        <button 
          onClick={handleSubmit}
          className="place-self-start rounded-md m-2 p-1 border-[#D6D0C4] border-[0.3px] bg-[#F4F1EA] hover:bg-[#ede6d6]">
            Post
        </button>
      </div>
    </div>
  )
}