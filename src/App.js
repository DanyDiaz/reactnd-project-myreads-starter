import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    books: [],
    shelves: [
      {name: 'Currently Reading', nameId: 'currentlyReading'},
      {name: 'Want to Read', nameId: 'wantToRead'},
      {name: 'Read', nameId: 'read'}
    ]
  }

  changeShelf = (book, newShelf) => {
    //Update state
    const booksApp = this;
    let booksAux = this.state.books;
    let originalShelf = booksAux[booksAux.findIndex(aBook => aBook.id === book.id)].shelf;
    booksAux[booksAux.findIndex(aBook => aBook.id === book.id)].shelf = newShelf;
    this.setState(() => ({
      books: booksAux
    }));
    //Update the shelf fo the book with the API
    BooksAPI.update(book, newShelf)
      .catch(function() {
        alert('There was a problem modifying the shelf. Try again later.');
        //If there was a problem, restore the original state
        booksAux[booksAux.findIndex(aBook => aBook.id === book.id)].shelf = originalShelf;
        booksApp.setState(() => ({
          books: booksAux
        }));
      });
  }
  
  componentDidMount() {
    BooksAPI.getAll().then(fetchedBooks => {
      //Load books information
      this.setState((currentState) => ({
        books: fetchedBooks
      }));
    })
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
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
                      shelvesOptions={this.state.shelves.filter(aShelf => aShelf.nameId.trim() !== '')}
                      changeShelfFunc={this.changeShelf}
                    />
                ))}
              </div>
            </div>
            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>Add a book</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
