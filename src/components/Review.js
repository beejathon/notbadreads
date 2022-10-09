import React from "react";
import { Link } from "react-router-dom";

export const Review = ({review}) => {
  return (
    <div id="reviewContainer" className="flex flex-row m-4 h-full w-9/12">
      <div id="reviewLeft" className="content-start">
        <Link to={`/users/${review.user}`}>
          <img 
            className="max-w-[60px]" 
            src={review.userIcon} 
            alt={review.userName} 
          />
        </Link>
      </div>
      <div id="reviewRight" className="flex flex-col w-full p-2">
        <div id="reviewHeader" className="flex flex-row relative place-items-center gap-1 w-full">
          <Link to={`/users/${review.user}`}>
            <span className="font-bold text-[#00635d]">{review.userName}</span>
          </Link>
          <span>rated it</span>
          <span>{review.rating}</span>
          <span className="absolute right-0 text-[14px] text-[#bbbbbb]"> {new Date(review.added.seconds * 1000).toLocaleDateString("en-US")}</span>
        </div>
        <div id="reviewBody" className="mt-4 mb-4">
          {review.text}
        </div>
        <div id="reviewFooter" className="flex flex-row place-items-center gap-1">
          <span className="text-[14px] text-[#00635d]">{review.likes} people</span>
          <span className="text-[14px]">like this</span>
          <button className="rounded-md m-2 p-1 border-[#D6D0C4] border-[0.3px] bg-[#F4F1EA] text-[13px]">Like</button>
        </div>
      </div>  
    </div>
  )
}