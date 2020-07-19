import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {this.props.tracks.map((track, i) => {
                    return <Track 
                    trackPosition={i}
                    key={track.id} 
                    track={track}
                    onAdd={this.props.onAdd}
                    onRemove={this.props.onRemove}
                    isRemoval={this.props.isRemoval} 
                    isDraggable={this.props.isDraggable}/>
                })}
            </div>
        );
    }
}

export default TrackList;