import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { Review } from "./Review";

export const ReviewsList = ({id}) => {
  const [reviews, setReviews] = useState(null)

  const fetchReviews = useCallback(async () => {
    const q = query(
      collection(db, 'reviews'),
      where('book', '==', id),
      orderBy('added')
    );
    const response = await getDocs(q)
    setReviews(response.docs)
  }, [id])

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews])

  return (
    <div id="reviewsContainer" className="flex flex-col h-full w-screen items-center">
      { reviews?.map((review) => {
          return <Review key={review.data().id} review={review.data()} />
        })
      }
    </div>
  )
}