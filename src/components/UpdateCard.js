import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import placeholder from "../assets/profile_icon.png"
import { BookButton } from "./BookButton";

export const UpdateCard = ({update}) => {
  const [currentTime, setCurrentTime] = useState(null)

  const syncTime = () => {
    let now = new Date().getTime();
    setCurrentTime(now)
  }

  useEffect(() => {
    syncTime();
  }, [])

  return (
    <div id="updateContainer" className="flex flex-col w-full gap-2 bg-white border-[#D8D8D8] border-[1px] p-4">
      <div id="updateHeader" className="flex flex-row gap-2 items-center justify-left w-full relative">
        <Link to={`/users/${update.data().userId}`}>
          <img src={update.data().userIcon || placeholder} alt="user icon" className="rounded-full w-10 absolute -ml-10 -mt-5"/>
        </Link>
        <span>{update.data().userName} {update.data().desc}</span>
        { update.data().rating
          ? <div className="flex flex-row gap-1">
              {[...Array(5)].map((star, index) => {
                index +=1;
                return (
                <span id={star} className={index <= update.data().rating ? "text-[#fc7600] text-xl -mr-[6px]" : "text-[#ccc] text-xl -mr-[6px]"}>&#9733;</span>
                )
              })}
            </div>
          : null
        }
        <div className="text-[#767676] text-[14px] absolute right-2">
          {parseInt((currentTime - update.data().added.toDate())/3600000)}h
          </div>
      </div>
      <div id="updateBody" className="flex flex-row gap-2">
        <Link to={`/books/${update.data().bookId}`}>
          <img src={update.data().bookCover} alt="book cover" />
        </Link>
        <div className="flex flex-col gap-1">
          <div>
            <span>
            {update.data().bookTitle}
            </span>
            <span>
              {update.data().bookSubtitle ? `: ${update.data().bookSubtitle}` : null}
            </span> 
          </div>
          { update.data().bookAuthors.length === 1
            ? <div>by <span>{update.data().bookAuthors[0]}</span></div>
            : <div>by 
                {update.data().bookAuthors.map((author, index, array) => {
                  if (index === array.length - 1) {
                    return <span key={index}> {author}</span>
                  } else {
                    return <span key={index}> {author}, </span>
                  }
                })}
              </div>
          }
          <BookButton 
            cover={update.data().bookCover}
            title={update.data().bookTitle}
            subtitle={update.data().bookSubtitle}
            authors={update.data().bookAuthors}
            id={update.data().bookId} />
        </div>
      </div>
    </div>
  )
}