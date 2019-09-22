import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Book from './Book'
import { debounce } from 'lodash'

class SearchBooks extends Component {
    state = {
        searchQuery: '',
        searched: false,
        searching: false,
        latestFetchedBooks: []
    }

    changeSearchQuery(newQuery) {
        this.setState(() => ({
            searchQuery: newQuery,
            searched: false
        }));
    }

    searchBooks = debounce(() => {
        this.setState(() => ({
            latestFetchedBooks: [],
            searching: true
        }));
        let initialQuery = this.state.searchQuery.trim();
        //it prevents to reload the page
        if(initialQuery !== '') {
            let booksApp = this;
            let {myBooks} = this.props;
            //if the query is not empty, use the BooksAPI to search books with that
            BooksAPI.search(initialQuery)
            .then((fetchedBooks) => {
                if(booksApp.state.searchQuery.trim() === '') {
                    this.setState(() => ({
                        latestFetchedBooks: [],
                        searched: false,
                        searching: false
                    }));
                }
                else if(fetchedBooks && fetchedBooks.length > 0
                        && initialQuery === booksApp.state.searchQuery) {
                    //Check each fetched book to see if they are already in the current shelves
                    //if that is the case, set the appropriate shelf
                    fetchedBooks.forEach(function(book) {
                        const filteredBook = myBooks.filter(aMyBook => aMyBook.id === book.id);
                        if(filteredBook.length > 0) {
                            book.shelf = filteredBook[0].shelf;
                        } 
                    });

                    this.setState(() => ({
                        latestFetchedBooks: fetchedBooks,
                        searched: true,
                        searching: false
                    }));
                }
                else if(initialQuery === booksApp.state.searchQuery) {
                    this.setState(() => ({
                        latestFetchedBooks: [],
                        searched: true,
                        searching: false
                    }));
                }
            });
        }
        else {
            this.setState(() => ({
                latestFetchedBooks: [],
                searched: false,
                searching: false
            }));
        }
    }, 600);

    render() {        
        let {shelvesOptions, changeShelfFunc} = this.props;
        
        return (
            <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to='/'>Close</Link>
              <div className="search-books-input-wrapper">
                <input 
                    type="text"
                    value={this.state.searchQuery}
                    placeholder="Search by title or author."
                    onChange={(event) => {this.changeSearchQuery(event.target.value); this.searchBooks()}}
                />
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
                (<div className='general-message'>
                    No books found with the term: <i>'{this.state.searchQuery}'</i> in it. Try with another query please.
                </div>)
            }
            {(this.state.searching) && 
                (<div className='general-message'>
                    <i>Searching...</i>
                </div>)
            }
          </div>
        );
    }
}

export default SearchBooks