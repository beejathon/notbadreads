import React from "react";
import { Link } from "react-router-dom";

export const Review = ({review}) => {
  return (
    <div id="reviewContainer" className="flex flex-row m-4 h-full w-3/5">
      { review ? (
        <>
          <div id="reviewLeft" className="content-start">
            <Link to={`/users/${review.user}`}>
              <img 
                className="max-w-[60px] rounded-[2px]" 
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
              { 
              <>
                {[...Array(5)].map((star, index) => {
                  index +=1;
                  return (
                  <span key={index} id={star} className={index <= review.rating ? "text-[#fc7600] text-xl -mr-[6px]" : "text-[#ccc] text-xl -mr-[6px]"}>&#9733;</span>
                  )
                })}
              </>
              }
              <span className="absolute right-0 text-[14px] text-[#bbbbbb]">
                {review.added && new Date(review.added.seconds * 1000).toLocaleDateString("en-US")}
              </span>
            </div>
            <div id="reviewBody" className="mt-4 mb-4 whitespace-pre-line">
              {review.text}
            </div>
            <div id="reviewFooter" className="flex flex-row place-items-center gap-1">
              <span className="text-[14px] text-[#00635d]">{review.likes} people</span>
              <span className="text-[14px]">like this</span>
              <button className="rounded-md m-2 p-1 border-[#D6D0C4] border-[0.3px] bg-[#F4F1EA] hover:bg-[#ede6d6] text-[13px]">Like</button>
            </div>
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  )
}