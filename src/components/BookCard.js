import oops from '../assets/oops.jpg';
import { FaStar } from 'react-icons/fa'

export const BookCard = ({book}) => {
  return (
    <div className='flex flex-row m-2'>
      <img 
        src=
          { book.imageLinks === undefined
            ? oops
            : book.imageLinks.thumbnail
          } 
        alt={book.title}
      />
      <div className='m-2'>
        <div>
          <span>{book.title}</span>
          { book.subtitle === undefined 
            ? ''
            : <span>: {book.subtitle}</span>
          }
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