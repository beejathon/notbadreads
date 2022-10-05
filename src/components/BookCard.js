import oops from '../assets/oops.jpg';
import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom';

export const BookCard = ({book, id}) => {
  return (
    <div className='flex flex-row m-2'>
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
        <div className='flex flex-row cursor-pointer p-2'>
          <FaStar />    
          <FaStar />    
          <FaStar />    
          <FaStar />    
          <FaStar />    
        </div>
        <div className='mx-2'>No ratings yet</div>
      </div>
    </div>
  )
}