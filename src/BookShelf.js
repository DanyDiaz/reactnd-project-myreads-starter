import React, {Component} from 'react'
import Book from './Book'

class BookShelf extends Component {
    render() {
        let {bookShelf, books, shelvesOptions, changeShelfFunc} = this.props;
        
        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{bookShelf.name}</h2>
                <div className="bookshelf-books">
                <ol className="books-grid">
                    {books.length > 0  
                    ? (books.map(aBook => (
                        <li key={aBook.id}>
                        <Book 
                            bookInformation={aBook} 
                            shelvesOptions={shelvesOptions}
                            changeShelfFunc={changeShelfFunc}
                        />
                        </li>
                    )))
                    : (<div>
                        <i>No books in this shelf for the moment</i>
                    </div>)}
                </ol>
                </div>
            </div>
        );
    }
}

export default BookShelf