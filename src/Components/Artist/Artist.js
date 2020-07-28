import React from 'react';
import './Artist.css';
import { ReactComponent as SearchIcon } from './search_icon.svg';


class Artist extends React.Component {
    constructor(props) {
        super(props);

        this.getTopTracks = this.getTopTracks.bind(this);
        this.searchArtist = this.searchArtist.bind(this);
    }

    getTopTracks() {
        this.props.getTopTracks(this.props.artist.id);
    }

    searchArtist() {
        this.props.onSearch(this.props.artist);
    }

    render() {
        return (
            <div
            className="Artist"
            onClick={this.getTopTracks}>
                <div className="Artist-information">
                <img src={this.props.artist.imageUrls[this.props.artist.imageUrls.length-1].url} alt={this.props.artist.name}/>
                    <h3>{this.props.artist.name}</h3>
                </div>
                <button
                className="Artist-action"
                onClick={this.searchArtist}
                ><SearchIcon /></button>
            </div>
        );
    }
}

export default Artist;