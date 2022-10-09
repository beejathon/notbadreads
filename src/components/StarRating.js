import React, { useState } from "react";

export const StarRating = ({rating, onRatingSelect}) => {
  const [hover, setHover] = useState(0);

  const handleClick = (index) => {
    onRatingSelect(index)
  }

  return (
    <>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "text-[#fcbb00] text-2xl" : "text-[#ccc] text-2xl"}
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span id="star">&#9733;</span>
          </button>
        );
      })}
    </>
  );
};
