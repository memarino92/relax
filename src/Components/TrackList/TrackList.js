import React from 'react';
import './TrackList.css';
import { Draggable } from 'react-beautiful-dnd';
import Track from '../Track/Track';

class TrackList extends React.Component {

    renderDraggable() {
        if (this.props.isDraggable) {
            const { provided, innerRef } = this.props;
            return (
                <div 
                className="TrackList"
                {...provided.droppableProps} ref={innerRef}>
                {this.props.tracks.map((track, index) => {
                        return (
                            <Draggable draggableId={track.id} key ={track.id} index={index}>
                                {(provided) => (
                                <Track 
                                provided={provided}
                                innerRef={provided.innerRef}
                                key={track.id} 
                                track={track}
                                onAdd={this.props.onAdd}
                                onRemove={this.props.onRemove}
                                isRemoval={this.props.isRemoval} 
                                isDraggable={this.props.isDraggable}/>
                                )}
                            </Draggable>
                        )
                    })}
                </div>
            );
        } else {
            return (
                <div className="TrackList">
                    {this.props.tracks.map((track) => {
                        return (
                                <Track 
                                key={track.id} 
                                track={track}
                                onAdd={this.props.onAdd}
                                onRemove={this.props.onRemove}
                                isRemoval={this.props.isRemoval} />
                                )}
                        )
                    }
                </div>
            );
        }
    }
    
    
    render() {
        return this.renderDraggable();
    }
}

export default TrackList;