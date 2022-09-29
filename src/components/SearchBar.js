import React, { useState } from "react";

const SearchBar = ({submit}) => {
  const [input, setInput] = useState([])

  const handleChange = (e) => {
    e.preventDefault();
    setInput(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(input);
  }

  return (
    <>
      <form id="search-form" onSubmit={handleSubmit}>
        <input type="text" 
          onChange={handleChange}
          placeholder="Search books" 
          value={input}  
        />
        <button className="" ></button>
      </form>
    </>
  )
}

export default SearchBar;