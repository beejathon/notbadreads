import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import placeholder from "../assets/profile_icon.png"
import { auth, db } from "../config/firebase";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { BookButton } from "./BookButton";
import { CommentSection } from "./CommentSection";
import likeBtn from "../assets/like.png"
import likedBtn from "../assets/liked.png"

export const UpdateCard = ({update}) => {
  const [currentTime, setCurrentTime] = useState(null)
  const [user] = useAuthState(auth);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const syncTime = () => {
    let now = new Date().getTime();
    setCurrentTime(now)
  }

  const fetchLikes = async () => {
    setLikes(0);
    const q = query(
      collection(db, 'likes'),
      where('postId', '==', update.id)
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
      postId: update.id,
      userId: user.uid
    })
    fetchLikes();
  }

  const removeLike = async () => {
    const q = query(
      collection(db, 'likes'),
      where('postId', '==', update.id),
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
    syncTime();
    fetchLikes();
  })

  if (update.data().desc === 'is now friends with') {
    return (
      <div id="updateContainer" className="flex flex-col w-full gap-2 bg-white border-[#D8D8D8] border-[1px] p-4">
        <div id="updateHeader" className="flex flex-row gap-2 items-center justify-left w-full relative">
          <Link to={`/users/${update.data().requesteeId}`}>
            <img 
              src={update.data().requesteeIcon || placeholder} 
              alt="user icon" 
              referrerPolicy="no-referrer"
              className="rounded-full w-10 absolute -ml-10 -mt-5"/>
          </Link>
          <span className="text-[#066660] font-bold">{update.data().requestee}</span>
          <span>{update.data().desc}</span>
          <span className="text-[#066660] font-bold">{update.data().requester}</span>
          <Link to={`/users/${update.data().requesterId}`}>
            <img 
            src={update.data().requesterIcon || placeholder} 
            alt="user icon"
            referrerPolicy="no-referrer"
            className="rounded-full w-10"/>
          </Link>
          <div className="text-[#767676] text-[14px] absolute right-2">
            {parseInt((currentTime - update.data().added.toDate())/3600000)}h
          </div>
        </div>  
      </div>
    )
  } else {
    return (
      <div id="updateContainer" className="flex flex-col w-full p-0">
        <div id="updateSection" className="flex flex-col w-full gap-2 bg-white border-[#D8D8D8] border-[1px] p-4">
          <div id="updateHeader" className="flex flex-row gap-2 items-center justify-left w-full relative">
            <Link to={`/users/${update.data().userId}`}>
              <img
                referrerPolicy="no-referrer"
                src={update.data().userIcon || placeholder}
                alt="user icon" 
                className="rounded-full w-10 absolute -ml-10 -mt-5"/>
            </Link>
            <span className="text-[#066660] font-bold">{update.data().userName}</span>
            <span>{update.data().desc}</span>
            { update.data().rating
              ? <div className="flex flex-row gap-1">
                  {[...Array(5)].map((star, index) => {
                    index +=1;
                    return (
                    <span key={index} id={star} className={index <= update.data().rating ? "text-[#fc7600] text-xl -mr-[6px]" : "text-[#ccc] text-xl -mr-[6px]"}>&#9733;</span>
                    )
                  })}
                </div>
              : null
            }
            <div className="text-[#767676] text-[14px] absolute right-2">
              {parseInt((currentTime - update.data().added.toDate())/3600000)}
            </div>
          </div>
          <div id="updateBody" className="flex flex-row gap-2">
            <Link to={`/books/${update.data().bookId}`}>
              <img src={update.data().bookCover} alt="book cover" />
            </Link>
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-bold">
                {update.data().bookTitle}
                </span>
                <span className="font-bold">
                  {update.data().bookSubtitle ? `: ${update.data().bookSubtitle}` : null}
                </span> 
              </div>
              { update.data().bookAuthors.length === 1 ? (
                <div>by <span>{update.data().bookAuthors[0]}</span></div>
              ) : ( 
                <div>by 
                  {update.data().bookAuthors.map((author, index, array) => {
                    if (index === array.length - 1) {
                      return <span key={update.data().id}> {author}</span>
                    } else {
                      return <span key={update.data().id}> {author}, </span>
                    }
                  })}
                </div>
              )}
              <BookButton 
                cover={update.data().bookCover}
                title={update.data().bookTitle}
                subtitle={update.data().bookSubtitle}
                authors={update.data().bookAuthors}
                id={update.data().bookId} />
            </div>
          </div>
          <div id="updateFooter" className="flex flex-col gap-2 mt-2 place-items-start">
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
              <img src={likeBtn} alt="unlike" />
              Like
              </div>
            )}
          </div>
        </div>
        <CommentSection postId={update.id}/>
      </div>
    )
  }
}