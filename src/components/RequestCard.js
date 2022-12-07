import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../assets/profile_icon.png"

export const RequestCard = ({request, onAccept, onReject}) => {
  const accept = () => {
    onAccept(request.requestId, request.id);
  }
  
  const reject = () => {
    onReject(request.requestId);
  }

  return (
    <div id="requestCard" className="flex flex-row gap-4 bg-white border-[#D8D8D8] items-center border-[1px] p-4">
      <div id="cardLeft">
        <Link to={`users/${request.id}`}>
          <img src={request.icon || placeholder} alt="user icon" />
        </Link>
      </div>
      <div id="cardRight" className="flex flex-col gap-1">
        <span>{request.name} would like to be friends</span>
        <div id="optionBbuttons" className="flex flex-row gap-4">
          <button 
            onClick={accept}
            className="rounded-tl-[3px] rounded-bl-[3px] w-[140px] h-[100%]">
            <div className="bg-[url('assets/check.png')] bg-no-repeat bg-center text-transparent">
            accept button
            </div>
          </button>
          <button 
            onClick={reject}
            className="rounded-tl-[3px] rounded-bl-[3px] w-[140px] h-[100%]">
            <div className="bg-[url('assets/del.png')] bg-no-repeat bg-center text-transparent">
            reject button
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}