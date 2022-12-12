import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import placeholder from "../assets/profile_icon.png"

export const Comment = ({comment}) => {
  const [currentTime, setCurrentTime] = useState(null)

  const syncTime = () => {
    let now = new Date().getTime();
    setCurrentTime(now)
  }

  useEffect(() => {
    syncTime();
  }, [])

  return (
    <div id="commentContainer" className="flex flex-row relative">
      <div id="commentLeft">
        <Link to={`/users/${comment.data().userId}`}>
          <img src={comment.data().userIcon || placeholder} alt="user icon" className="rounded-full w-8"/>
        </Link>
      </div>
      <div id="commentRight" className="flex flex-col w-full ml-2">
        <div id="commentTop" className="flex flex-row justify-between w-full">
        <span className="text-[#066660] font-bold">
            {comment.data().userName}
          </span>
          <span className="text-[#767676] text-[14px]">
            {parseInt((currentTime - comment.data().added.toDate())/3600000)}
          </span>
        </div>
        <div id="commentText" dangerouslySetInnerHTML={ {__html: comment.data().text} } />
      </div>
    </div>
  )
}