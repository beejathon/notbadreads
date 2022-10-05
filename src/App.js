import React, { useCallback, useEffect, useState } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
} from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { SearchList } from "./components/SearchList";
import { Home } from "./components/Home";
import { Nav } from "./components/Nav";
import { cleanData } from "./helpers/helpers";
import { auth } from "./config/firebase";
import { SignIn } from "./components/SignIn";
import { BookDetail } from "./components/BookDetail";

function App() {
  const [terms, setTerms] = useState([])
  const [books, setBooks] = useState([])
  const [user] = useAuthState(auth);

  const fetchBooks = useCallback(async() => {
    const apiKey = 'AIzaSyAIVABDn3ZZJIiSt3HhDgtZPa3hcueYqKw'
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${terms}&orderBy=relevance&maxResults=10&key=${apiKey}`, {mode: 'cors'}
    )
    const data = await response.json();
    const items = await cleanData(data.items)
    setBooks(items)
  }, [terms])

  const onSubmit = (data) => {
   setTerms(data)
  }

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks])

  return (
    <div className="bg-[rgba(244,241,234,0.5)] w-100">
      { user 
        ? <Router>
            <Nav onSubmit={onSubmit}/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchList books={books} />} />
              <Route path="/books/:id" element={<BookDetail />} />
            </Routes>
          </Router>
        : <SignIn />
      }
    </div>
  );
}

export default App;

