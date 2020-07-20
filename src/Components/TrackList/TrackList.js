import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deltaPositionY: this.props.tracks.map((track) => 0),
        }
        
        this.handleDrag = this.handleDrag.bind(this);

    }

    handleDrag(newValue, index) {
        const newState = this.props.tracks.map(() => 0);
        newState[index] = newValue;
        this.setState({
            deltaPositionY: newState
        });
    }
    
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
                    isDraggable={this.props.isDraggable}
                    handleDrag={this.handleDrag}
                    deltaPositionY={this.state.deltaPositionY}/>
                })}
            </div>
        );
    }
}

export default TrackList;