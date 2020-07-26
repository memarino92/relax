import React from 'react';
import './ArtistList.css';
import Artist from '../Artist/Artist';

class ArtistList extends React.Component {
    renderHeadline() {
        if (this.props.artistName) {
            return this.props.artistName;
        } else {
            return "Search for an artist"
        }
    }
    
    render() {
        return (
            <div className="Artist-list">
                <h1>{this.renderHeadline()}</h1>
                {this.props.artists.map(artist => {
                    return (
                        <Artist
                        artist={artist} 
                        key={artist.id} 
                        getTopTracks={this.props.getTopTracks}
                        onSearch={this.props.onSearch} />
                    );
                })}
            </div>
        );
    }
}

export default ArtistList;