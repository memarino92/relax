import React from 'react';
import './TrackList.css';
import { Draggable } from 'react-beautiful-dnd';
import Track from '../Track/Track';

class TrackList extends React.Component {

    setRef = (ref) => {
        // keep a reference to the dom ref as an instance property
        this.ref = ref;
        // give the dom ref to react-beautiful-dnd
        this.props.innerRef(ref);
    }

    render() {
        if (this.props.isDroppable) {
            const { provided } = this.props;
            return (
                <div 
                className="TrackList"
                {...provided.droppableProps} 
                ref={this.setRef}>
                {this.props.tracks.map((track, index) => {
                        return (
                            <Draggable 
                            draggableId={track.id} 
                            key={track.id} 
                            index={index}>
                                {(provided, snapshot) => {
                                    const style = {
                                        ...provided.draggableProps.style,
                                //        transition: 'background-color 2s ease',
                                        backgroundColor: snapshot.isDragging ? "rgba(108, 65, 233, 1)" : "transparent",
                                      };
                                    return (<Track 
                                    provided={provided}
                                    innerRef={provided.innerRef}
                                    track={track}
                                    onAdd={this.props.onAdd}
                                    onRemove={this.props.onRemove}
                                    isRemoval={this.props.isRemoval} 
                                    isDraggable={this.props.isDroppable}
                                    isDragging={snapshot.isDragging}
                                    style={style}
                                    />
                                    );
                                }}
                            </Draggable>
                        )
                    })}
                {provided.placeholder}
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
}

export default TrackList;