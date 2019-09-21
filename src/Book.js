import React, {Component} from 'react'

class Book extends Component {
    render() {
        let {bookInformation, shelvesOptions, changeShelfFunc} = this.props;
        
        return (
            <div className="book">
                <div className="book-top">
                {bookInformation.imageLinks
                ? (
                    <div className="book-cover" style={{ 
                        width: 128, 
                        height: 193, 
                        backgroundImage: `url(${bookInformation.imageLinks.thumbnail})` }}>
                    </div>
                )
                : (
                    <div className="book-no-image"></div>
                )}
                <div className="book-shelf-changer">
                    <select 
                        value={bookInformation.shelf ? bookInformation.shelf : 'none'}
                        onChange={(event) => changeShelfFunc(bookInformation, event.target.value)}
                         >
                        <option value="move" disabled>Move to...</option>
                        {shelvesOptions.map(shelfOption => (
                            <option 
                                key={shelfOption.nameId}
                                value={shelfOption.nameId} >
                                {shelfOption.name}
                            </option>    
                        ))}
                        <option value="none">None</option>
                    </select>
                </div>
                </div>
                <div className="book-title">{bookInformation.title}</div>
                <div className="book-authors">{bookInformation.authors ? bookInformation.authors.join(', ') : ''}</div>
            </div>
        );
    }
}

export default Book