import React from 'react';
import './Artist.css';

class Artist extends React.Component {
    constructor(props) {
        super(props);

        this.getTopTracks = this.getTopTracks.bind(this);
    }

    getTopTracks() {
        this.props.getTopTracks(this.props.artist.id);
    }

    render() {
        return (
            <div 
            className="Artist"
            onClick={this.getTopTracks}>
                <div className="Artist-information">
                    <h3>{this.props.artist.name}</h3>
                </div>
            </div>
        );
    }
}

export default Artist;