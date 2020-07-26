import React from 'react';
import './ArtistTracks.css';
import Tracklist from '../TrackList/TrackList';

class ArtistTracks extends React.Component {
    render() {
        return (
            <div className="Artist-tracks">
                <h1>Top Tracks</h1>
                <Tracklist 
                tracks={this.props.tracks}
                onAdd={this.props.onAdd} />
            </div>
        );
    }
}

export default ArtistTracks;