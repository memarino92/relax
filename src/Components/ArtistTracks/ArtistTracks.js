import React from 'react';
import './ArtistTracks.css';
import Tracklist from '../TrackList/TrackList';

class ArtistTracks extends React.Component {
    render() {
        return (
            <div className="Artist-tracks">
                <Tracklist 
                tracks={this.props.tracks}
                onAdd={this.props.onAdd} />
            </div>
        );
    }
}

export default ArtistTracks;