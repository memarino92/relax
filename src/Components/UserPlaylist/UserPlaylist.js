import React from 'react';
import './UserPlaylist.css';

class UserPlaylist extends React.Component {
    constructor(props) {
        super(props);

        this.getPlaylistTracks = this.getPlaylistTracks.bind(this);
    }
    
    getPlaylistTracks() {
        this.props.getPlaylistTracks(this.props.playlist.id, this.props.playlist.name);
    }

    render() {
        return (
            <div 
            className="User-playlist"
            onClick={this.getPlaylistTracks}>
                <div className="User-playlist-information">
                    <h3>{this.props.playlist.name}</h3>
                    <p></p>
                </div>
            </div>
        );
    }
}

export default UserPlaylist;