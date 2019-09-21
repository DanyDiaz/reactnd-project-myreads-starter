import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import SearchBooks from './SearchBooks'
import {Link, Route} from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    books: [],
    shelves: [
      {name: 'Currently Reading', nameId: 'currentlyReading'},
      {name: 'Want to Read', nameId: 'wantToRead'},
      {name: 'Read', nameId: 'read'}
    ]
  }

  changeShelf = (book, newShelf) => {
    const booksApp = this;
    let originalBooks = this.state.books;
    let AuxBooks = this.state.books;
    //If the shelf is 'none', then remove the book from the array
    if(newShelf === 'none') {
      AuxBooks = AuxBooks.filter(aBook => aBook.id !== book.id);
    }
    else {
      //Set the new shelf to the book sent
      book.shelf = newShelf;
      //Add the book to the array if it does not exist
      if(AuxBooks.filter(aBook => aBook.id === book.id).length <= 0) {
        AuxBooks.push(book);
      }
      //Update the data in the array for the book
      AuxBooks[AuxBooks.findIndex(aBook => aBook.id === book.id)] = book;
    }
    //Update state
    this.setState(() => ({
      books: AuxBooks
    }));
    //Update the shelf fo the book with the API
    BooksAPI.update(book, newShelf)
      .catch(function() {
        alert('There was a problem modifying the shelf. Try again in a moment.');
        booksApp.setState(() => ({
          books: originalBooks
        }));
      });
  }
  
  componentDidMount() {
    BooksAPI.getAll().then(fetchedBooks => {
      //Load books information
      this.setState(() => ({
        books: fetchedBooks
      }));
    })
  }

  render() {
    return (
      <div className="app">
        <Route path='/search' render={() => (  
          <SearchBooks
            shelvesOptions={this.state.shelves}
            myBooks={this.state.books}
            changeShelfFunc={this.changeShelf}
          />
        )} />
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {this.state.shelves.map(aShelf => (
                    <BookShelf 
                      key={aShelf.nameId}
                      bookShelf={aShelf}
                      books={this.state.books.filter(book => book.shelf === aShelf.nameId)}
                      shelvesOptions={this.state.shelves}
                      changeShelfFunc={this.changeShelf}
                    />
                ))}
              </div>
            </div>
            <div className="open-search">
              <Link 
                className='open-search-link'
                to='/search'>Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
