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
import { ReviewEdit } from "./components/ReviewEdit";
import { Profile } from "./components/Profile";
import { Friends } from "./components/Friends";
import { MyBooks } from "./components/MyBooks";

function App() {
  const [terms, setTerms] = useState([])
  const [books, setBooks] = useState([])
  const [user] = useAuthState(auth);
  const [count, setCount] = useState(0);

  const fetchBooks = useCallback(async() => {
    const apiKey = 'AIzaSyCCR3kcDEtKZO_rpIDBwJaLgrIfsRAMdlA'
    let url = 'https://www.googleapis.com/books/v1/volumes?'
    url += `q=${terms}`
    url += '&orderBy=relevance&maxResults=10'
    url += `&fields=items(id, volumeInfo)`
    url += `&key=${apiKey}`
    const response = await fetch(url, {mode: 'cors'})
    const data = await response.json();
    const items = await cleanData(data.items)
    setBooks(items)
  }, [terms])

  const onSubmit = (data) => {
   setTerms(data)
  }

  const resetNav = () => {
    setCount(count + 1)
  }

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks])

  return (
    <div className="bg-[rgba(244,241,234,0.5)] flex flex-col items-center w-screen h-auto">
      { user ? (
        <Router>
            <Nav key={count} onSubmit={onSubmit}/>
            <Routes>
              <Route path="/notbadreads" element={<Home />} />
              <Route path="/mybooks" element={<MyBooks />} />
              <Route path="/search" element={<SearchList books={books} />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/review/edit/:id" element={<ReviewEdit />} />
              <Route path="/users/:id" element={<Profile />} />
              <Route path="/friends" element={<Friends resetNav={resetNav} />} />
            </Routes>
          </Router>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default App;

