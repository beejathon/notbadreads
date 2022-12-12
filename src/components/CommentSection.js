import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";

const initialState = [];

export const CommentSection = ({postId}) => {
  const [comments, setComments] = useState([]);
  const [user] = useAuthState(auth);

  const fetchComments = async () => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('added', 'asc')
    )
    const qSnap = await getDocs(q);
    setComments(qSnap.docs);
  }

  const addComment = async (text) => {
    const newCommentRef = doc(collection(db, 'comments'));
    const userRef = doc(collection(db, 'users'), user.uid)
    const poster = await getDoc(userRef)
    const data = {
      text: text,
      postId: postId,
      userId: poster.data().id,
      userIcon: poster.data().icon,
      userName: poster.data().name,
      added: serverTimestamp()
    }
    await setDoc(newCommentRef, data);
    resetState();
    await fetchComments();
  }

  const resetState = () => {
    setComments(initialState)
  }

  useEffectOnce(() => {
    fetchComments();
  })

  return (
    <div id="commentSection" className="flex flex-col w-full gap-3 bg-[#f3f3f3] border-[#D8D8D8] border-[1px] p-4">
      { comments ? (
        comments.map((comment) => {
          return (
            <div key={comment.id}>
              <Comment comment={comment}/>
            </div>
          )
        })
      ) : (
        null
      )}
      <CommentForm addComment={addComment} />
    </div>
  )
}