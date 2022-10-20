import React from "react";
import { Link } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { SearchBar } from "./SearchBar";

export const Nav = ({onSubmit}) => {
  return (
    <header className="flex flex-row pl-6 bg-[#F4F1EA] items-center h-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] mb-10">
      <div id="logo">
        <Link to='/'>
          <span className="logo-left">notbad</span>
          <span className="logo-right">reads</span>
        </Link>  
      </div>
      <nav className="flex flex-row flex-grow items-center h-full place-self-end place-content-center relative">
        <Link to='/'><div className="hover:bg-[#382110] hover:text-white text-[#382110] h-full pt-4 pb-4 pl-6 pr-6">Home</div></Link>
        <Link to='/'><div className="hover:bg-[#382110] hover:text-white text-[#382110] h-full pt-4 pb-4 pl-6 pr-6">My Books</div></Link>
        <SearchBar submit={onSubmit}/>
        <ProfileMenu />
      </nav>
    </header>
  )
}
