import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList'
import { Droppable } from 'react-beautiful-dnd';

class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    render() {
        return (
            <div className="Playlist">
                <input 
                onChange={this.handleNameChange}
                value={this.props.playlistName} />
                <Droppable droppableId="Playlist">
                  {provided => ( 
                    <TrackList 
                    provided={provided}
                    innerRef={provided.innerRef}
                    tracks={this.props.playlistTracks}
                    isRemoval={true} 
                    onRemove={this.props.onRemove}
                    isDraggable={true}>
                        {provided.placeholder}
                    </TrackList>
                    )}
                </Droppable>
                <button 
                className="Playlist-save"
                onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}

export default Playlist;