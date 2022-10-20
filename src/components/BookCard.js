import oops from '../assets/oops.jpg';
import { Link } from 'react-router-dom';
import { BookButton } from './BookButton';

export const BookCard = ({book, id}) => {
  return (
    <div className="flex flex-row m-2">
      <Link to={`/books/${id}`}>
        <img 
          src=
            { book.imageLinks === undefined
              ? oops
              : book.imageLinks.thumbnail
            } 
          alt={book.title}
      />
      </Link>
      <div className='m-2'>
        <div>
          <Link to={`/books/${id}`}>
            <span>{book.title}</span>
            { book.subtitle === undefined 
              ? ''
              : <span>: {book.subtitle}</span>
            }
          </Link>
        </div>
        { book.authors.length === 1
          ? <div>by <span>{book.authors[0]}</span></div>
          : <div>by 
              {book.authors.map((author, index, array) => {
                if (index === array.length - 1) {
                  return <span key={index}> {author}</span>
                } else {
                  return <span key={index}> {author}, </span>
                }
              })}
            </div>
          }
        <div className="flex flex-row p-2 items-center">
          { 
            <div className="flex flex-row">
              {[...Array(5)].map((star, index) => {
                index +=1;
                return (
                <span id={star} className={index <= book.averageRating ? "text-[#fc7600] text-xl -mr-[6px]" : "text-[#ccc] text-xl -mr-[6px]"}>&#9733;</span>
                )
              })}
            </div>
          }
          <span className="mx-2 text-[12px] text-[#999999]">
            {book.averageRating ? `— ${book.averageRating} avg rating ` :'— No ratings'}
            {book.ratingsCount ? `— ${book.ratingsCount} ratings` : null}
          </span>  
        </div>
        <BookButton 
          cover={book.imageLinks.thumbnail}
          title={book.title}
          subtitle={book.subtitle}
          authors={book.authors} 
          id={id} />
      </div>
    </div>
  )
}