import React from 'react';
import Draggable from 'react-draggable';
import './Track.css';

class Track extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            deltaPositionY: 0
        }

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);

    }

    handleDrag = (e, ui) => {
        const y = this.state.deltaPositionY;
        this.setState({
          deltaPositionY: y + ui.deltaY,
          }
        );
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
            return <button className="handle">{this.state.deltaPositionY}||{this.props.trackPosition}</button>;
        } else {
            return;
        }
    }
    
    render() {
        return (
            <Draggable
            axis="y"
            handle=".handle"
            disabled={!this.props.isDraggable}
            onDrag={this.handleDrag}>
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