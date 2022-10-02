import React from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";

export const Nav = ({onSubmit}) => {
  return (
    <header className="flex flex-row flex-grow justify-evenly p-2 bg-[#F4F1EA]">
      <div className="logo">
        <Link to='/'>
          notbadreads
        </Link>  
      </div>
      <nav className="flex flex-row flex-grow justify-evenly">
        <Link to='/'>Home</Link>
        <Link to='/'>My Books</Link>
        <SearchBar submit={onSubmit}/>
      </nav>
    </header>
  )
}
