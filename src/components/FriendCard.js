import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../assets/profile_icon.png"

export const FriendCard = ({friend, showConfirmationBox}) => {
  const confirmRemove = () => {
    showConfirmationBox(friend.id);
  }
  return (
    <div id="friendContainer" className="flex flex-row gap-6 bg-white border-[#D8D8D8] items-center border-[1px] p-4">
      <Link to={`/users/${friend.id}`}>
        <img src={friend.icon || placeholder} alt="user icon" className="rounded-full w-16" />
      </Link>
      <span>{friend.name}</span>
      <div className="flex flex-col">
        <div><span>{friend.bookCount}</span> book(s)</div> 
        <div><span>{friend.friendCount}</span> friend(s)</div> 
      </div>
      <button 
        onClick={confirmRemove}
        className="rounded-tl-[3px] rounded-bl-[3px] w-[140px] h-[100%] ml-auto">
        <div className="bg-[url('assets/del.png')] bg-no-repeat bg-center text-transparent">
        del
        </div>
        <span className="text-[12px] text-[#999999]">Remove Friend</span>
      </button>
    </div>
  )
}