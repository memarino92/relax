import React from 'react';
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
    
    renderAction(track) {
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

    renderDroppable() {
        if (this.props.isDroppable) {
            const { provided, innerRef } = this.props;
            return (
                <div
                className="Track"
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={innerRef}
                key={this.props.key}>
                    <div className="Track-information">
                        <h3>{this.props.track.name}</h3>
                        <p>{this.props.track.artist} | {this.props.track.album}</p>
                    </div>
                    {this.renderAction(this.props.track)}
                </div>
            );
        } else {
            return (
                <div className="Track">
                    <div className="Track-information">
                        <h3>{this.props.track.name}</h3>
                        <p>{this.props.track.artist} | {this.props.track.album}</p>
                    </div>
                    {this.renderAction(this.props.track)}
                </div>
            );
        }
    }

    render() {
        return this.renderDroppable();
    }
}

export default Track;