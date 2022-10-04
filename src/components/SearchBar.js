import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchBar = ({submit}) => {
  const [input, setInput] = useState([])

  const handleChange = (e) => {
    e.preventDefault();
    setInput(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(input);
    navigate('/search')
  }

  const navigate = useNavigate();

  return (
    <>
      <form id="search-form" onSubmit={handleSubmit}>
        <input type="text" 
          onChange={handleChange}
          placeholder="Search books" 
          value={input}  
          className="border-2 border-[#DCD6CC] border-solid rounded w-100"
        />
        <button className="bg-[url('assets/search.png')] bg-no-repeat bg-center text-transparent m-2 -mx-10">search</button>
      </form>
    </>
  )
}
