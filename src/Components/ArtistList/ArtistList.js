import React from 'react';
import './ArtistList.css';
import Artist from '../Artist/Artist';

class ArtistList extends React.Component {
    render() {
        return (
            <div className="Artist-list">
                {this.props.artists.map(artist => {
                    return (
                        <Artist
                        artist={artist} 
                        key={artist.id} 
                        getTopTracks={this.props.getTopTracks} />
                    );
                })}
            </div>
        );
    }
}

export default ArtistList;