import React from 'react';
import Draggable from 'react-draggable';
import './Track.css';

class Track extends React.Component {
    
    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);

    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }
    
    renderAction() {
        if (this.props.isRemoval) {
            return (
                <button 
                className="Track-action"
                onClick={this.removeTrack}>-</button>
            );
        } else {
            return (
                <button 
                className="Track-action"
                onClick={this.addTrack}>+</button>
            );
        }
    }

    renderHandle() {
        if (this.props.isDraggable) {
            return <button className="handle">||0||</button>;
        } else {
            return;
        }
    }
    
    render() {
        return (
            <Draggable
            axis="y"
            handle=".handle"
            bounds=".TrackList">
                <div className="Track">
                    {this.renderHandle()}
                    <div className="Track-information">
                        <h3>{this.props.track.name}</h3>
                        <p>{this.props.track.artist} | {this.props.track.album}</p>
                    </div>
                    {this.renderAction()}
                </div>
            </Draggable>
        );
    }
}

export default Track;