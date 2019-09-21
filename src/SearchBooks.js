import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Book from './Book'

class SearchBooks extends Component {
    state = {
        searchQuery: '',
        searched: false,
        latestFetchedBooks: []
    }

    changeSearchQuery(newQuery) {
        this.setState(() => ({
            searchQuery: newQuery,
            searched: false
        }));
    }

    searchBooks(event) {
        let {myBooks} = this.props;
        //it prevents to reload the page
        event.preventDefault();
        if(this.state.searchQuery.trim() !== '') {
            //if the query is not empty, use the BooksAPI to search books with that
            BooksAPI.search(this.state.searchQuery)
            .then((fetchedBooks) => {
                if(fetchedBooks && fetchedBooks.length > 0) {
                    //Check each fetched book to see if they are already in the current shelves
                    //if that is the case, set the appropriate shelf
                    fetchedBooks.forEach(function(book) {
                        const filteredBook = myBooks.filter(aMyBook => aMyBook.id === book.id);
                        if(filteredBook.length > 0) {
                            book.shelf = filteredBook[0].shelf;
                        } 
                    });

                    this.setState(() => ({
                        latestFetchedBooks: fetchedBooks
                    }));
                }
                else {
                    this.setState(() => ({
                        latestFetchedBooks: [],
                        searched: true
                    }));
                }
            });
        }
    }

    render() {        
        let {shelvesOptions, changeShelfFunc} = this.props;
        
        return (
            <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to='/'>Close</Link>
              <div className="search-books-input-wrapper">
                <form
                    onSubmit={(event) => this.searchBooks(event)}
                >
                    <input 
                    type="text"
                    value={this.state.searchQuery}
                    placeholder="Search by title or author. Then press enter"
                    onChange={(event) => this.changeSearchQuery(event.target.value)}
                    />
                </form>
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.latestFetchedBooks.map(aBook => (
                    <li key={aBook.id}>
                        <Book 
                            bookInformation={aBook}
                            shelvesOptions={shelvesOptions}
                            changeShelfFunc={changeShelfFunc}
                        />
                    </li>
                ))}
              </ol>
            </div>
            {(this.state.searched && this.state.latestFetchedBooks.length <= 0) && 
                (<div className='no-books-message'>
                    No books found with the term: <i>'{this.state.searchQuery}'</i> in it. Try with another query please.
                </div>)
            }
          </div>
        );
    }
}

export default SearchBooks