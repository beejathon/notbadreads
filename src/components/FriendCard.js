import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../assets/profile_icon.png"
import { useEffectOnce } from "../hooks/useEffectOnce";

export const FriendCard = ({friend}) => {
  useEffectOnce(() => {
    console.log(friend)
  })

  return (
    <div id="friendContainer" className="flex flex-row gap-2 bg-white border-[#D8D8D8] items-center border-[1px] p-4">
      <Link to={`/users/${friend.data().id}`}>
        <img src={friend.data().icon || placeholder} alt="user icon" className="rounded-full w-16" />
      </Link>
      <span>{friend.data().name}</span>
    </div>
  )
}