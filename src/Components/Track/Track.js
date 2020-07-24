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

    setRef = (ref) => {
        // keep a reference to the dom ref as an instance property
        this.ref = React.createRef();
        // give the dom ref to react-beautiful-dnd
        this.props.innerRef(ref);
    }

    renderDragStyle() {
        if (this.props.isDragging) {
            return {backgroundColor: "rgba(1, 12, 63, 1)"};
        } else {
            return {backgroundColor: "transparent"};
        }
    }

    render() {
        if (this.props.isDraggable) {
            const { provided } = this.props;
            return (
                <div
                className="Track"
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={this.setRef}
                style={this.props.style}
                >
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
        };
    }
}

export default Track;