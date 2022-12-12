import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { Link } from "react-router-dom";
import likeBtn from "../assets/like.png"
import likedBtn from "../assets/liked.png"
import { CommentSection } from "./CommentSection";

export const Review = ({review}) => {
  const [user] = useAuthState(auth);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  

  const fetchLikes = async () => {
    setLikes(0);
    const q = query(
      collection(db, 'likes'),
      where('postId', '==', review.id)
    )
    const qSnap = await getDocs(q)
    qSnap.docs.forEach((like) => {
      setLikes((previousState) => previousState + 1);
      if (like.data().userId === user.uid) setLiked(true)
    })
  }

  const addLike = async () => {
    const newLikeRef = doc(collection(db, 'likes'));
    await setDoc(newLikeRef, {
      postId: review.id,
      userId: user.uid
    })
    fetchLikes();
  }

  const removeLike = async () => {
    const q = query(
      collection(db, 'likes'),
      where('postId', '==', review.id),
      where('userId', '==', user.uid)
    )
    const qSnap = await getDocs(q)
    qSnap.forEach(async (like) => {
      const docRef = doc(db, 'likes', like.id)
      await deleteDoc(docRef)
    })
    fetchLikes();
    setLiked(false);
  }

  useEffectOnce(() => {
    fetchLikes();
  })

  return (
    <div id="reviewContainer" className="flex flex-col m-4 h-full w-3/5">
      { review ? (
        <div id="reviewSection" className="flex flex-row w-full bg-white border-[#D8D8D8] border-[1px] p-4">
          <div id="reviewLeft" className="content-start">
            <Link to={`/users/${review.data().user}`}>
              <img 
                className="max-w-[60px] rounded-full" 
                src={review.data().userIcon} 
                alt={review.data().userName} 
              />
            </Link>
          </div>
          <div id="reviewRight" className="flex flex-col w-full p-2">
            <div id="reviewHeader" className="flex flex-row relative place-items-center gap-1 w-full">
              <Link to={`/users/${review.data().user}`}>
                <span className="font-bold text-[#00635d]">{review.data().userName}</span>
              </Link>
              <span>rated it</span>
              { 
              <>
                {[...Array(5)].map((star, index) => {
                  index +=1;
                  return (
                  <span key={index} id={star} className={index <= review.data().rating ? "text-[#fc7600] text-xl -mr-[6px]" : "text-[#ccc] text-xl -mr-[6px]"}>&#9733;</span>
                  )
                })}
              </>
              }
              <span className="absolute right-0 text-[14px] text-[#bbbbbb]">
                {review.data().added && new Date(review.data().added.seconds * 1000).toLocaleDateString("en-US")}
              </span>
            </div>
            <div id="reviewBody" className="mt-4 mb-4 whitespace-pre-line">
              {review.data().text}
            </div>
            <div id="reviewFooter" className="flex flex-col gap-2 place-items-start">
              {likes > 0 ? (
                <div className="text-[#7c7c7c] mt-1 font-[600] text-[14px]">
                  {likes}
                  {likes > 1 ? ' likes': ' like'}
                </div>
              ) : (
                null
              )}
              { liked ? (
                <div
                onClick={removeLike} 
                className="flex flex-row gap-2 place-items-end cursor-pointer hover:underline mb-1 text-[#46423f] font-[600] text-[14px]">
                <img src={likedBtn} alt="unlike" />
                Unlike
                </div>
              ) : (
                <div
                onClick={addLike} 
                className="flex flex-row gap-2 place-items-end cursor-pointer hover:underline mb-1 text-[#46423f] font-[600] text-[14px]">
                <img src={likeBtn} alt="like" />
                Like
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
      <CommentSection postId={review.id }/>
    </div>
  )
}