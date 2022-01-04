import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    handleTermChange(event) {
        this.props.onTermChange(event.target.value);
    }

    handleKeyUp(event) {
        if (event.key === "Enter") {
            this.props.onSearch();
        }
    }

    updateSearchTerms() {
        if (this.props.searchTerms === this.props.selectedArtistName) {
            return this.props.selectedArtistName;
        }
    }

    render() {
        return (
            <div className="SearchBar">
            <input 
            placeholder="Enter an Artist"
            onChange={this.handleTermChange} 
            onKeyUp={this.handleKeyUp} 
            value={this.props.searchTerms} />
            <button 
            className="SearchButton" 
            onClick={this.props.onSearch}>SEARCH</button>
            </div>
        );
    }
}

export default SearchBar;