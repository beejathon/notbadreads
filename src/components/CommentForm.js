import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import placeholder from "../assets/profile_icon.png"

export const CommentForm = ({addComment}) => {
  const [text, setText] = useState([]);
  const [user] = useAuthState(auth);

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addComment(text);
    setText([]);
  }

  return (
    <div className="flex flex-row">
      <div>
        <Link to={`/users/${user.uid}`}>
          <img src={user.photoURL || placeholder} alt="user icon" className="rounded-full w-8"/>
        </Link>
      </div>
      <div className="flex flex-col gap-2 ml-2 w-full">
        <textarea 
          className="text-[13px] px-1 py-1 text-gray-900 resize-y"
          onChange={(e) => handleChange(e)} 
          name="comment" 
          rows="1"
          placeholder="Write a comment..." 
          value={text} />
        <button 
          className="cursor-pointer hover:bg-[#ede6d6] rounded-[3px] border-[#D6D0C4] border-[1px] text-[11px] w-fit px-2 py-1"
          onClick={handleSubmit}>
            Comment
        </button>
      </div>
    </div>
    
  )
}