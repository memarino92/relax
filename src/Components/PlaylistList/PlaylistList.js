import React from 'react';
import './PlaylistList.css';
import UserPlaylist from '../UserPlaylist/UserPlaylist';

class PlaylistList extends React.Component {
    render() {
        return (
            <div className="Playlist-list">
                {this.props.userPlaylists.map(playlist => {
                    return (
                        <UserPlaylist 
                        playlist={playlist} 
                        key={playlist.id} 
                        getPlaylistTracks={this.props.getPlaylistTracks} />
                );
                })}
            </div>
        );
    }
}

export default PlaylistList;