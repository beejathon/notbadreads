import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchBar = ({submit}) => {
  const [input, setInput] = useState([])
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setInput(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(input);
    navigate('/search');
    setInput([]);
  }

  return (
    <div className="ml-10">
      <form id="search-form" onSubmit={handleSubmit}>
        <input type="text" 
          onChange={handleChange}
          placeholder="Search books" 
          value={input}  
          className="border-[0.8px] border-[#DCD6CC] border-solid rounded-[3px] w-100 pt-[4px] pb-[4px] pl-[8px] pr-[26px]"
        />
        <button className="bg-[url('assets/search.png')] bg-no-repeat bg-center text-transparent m-2 -mx-10">search</button>
      </form>
    </div>
  )
}
