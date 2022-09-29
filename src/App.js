import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchList from "./components/SearchList";

const firebaseConfig = {
  apiKey: "AIzaSyAIVABDn3ZZJIiSt3HhDgtZPa3hcueYqKw",
  authDomain: "notbadreads.firebaseapp.com",
  projectId: "notbadreads",
  storageBucket: "notbadreads.appspot.com",
  messagingSenderId: "715831450876",
  appId: "1:715831450876:web:30792b6dd051be1b59cb79"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [terms, setTerms] = useState([])

  const onSubmit = (data) => {
   setTerms(data)
  }

  return (
    <div className="App">
      <SearchBar submit={onSubmit} />
      <SearchList terms={terms} />
    </div>
  );
}

export { App, auth };
