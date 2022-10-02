import React from 'react';
import { render, screen } from '@testing-library/react';
import { BookCard } from './BookCard';

describe("BookCard", ()=> {
  const book1 = {
    title: "good book",
    authors: [
      "good author"
    ]
  };

  const book2 = {
    title: "not bad book",
    authors: [
      "not bad author 1",
      "not bad author 2",
    ]
  };

  it("renders book with one author", () => {
    render(<BookCard book={book1}/>)
  
    expect(screen.getByText("good book")).toBeInTheDocument
    expect(screen.getByText("good author")).toBeInTheDocument
  })

  it("renders book with multiple authors", () => {
    render(<BookCard book={book2}/>)
  
    expect(screen.getByText("not bad book")).toBeInTheDocument
    expect(screen.getByText("not bad author 1,")).toBeInTheDocument
    expect(screen.getByText("not bad author 2")).toBeInTheDocument
  })
})