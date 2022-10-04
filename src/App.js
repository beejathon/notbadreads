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
    <div className="App bg-[rgba(244,241,234,0.5)]">
      { user 
      ? <Router>
          <Nav onSubmit={onSubmit}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchList books={books} />} />
          </Routes>
        </Router>
      : <SignIn />
      }
    </div>
  );
}

export default App;

