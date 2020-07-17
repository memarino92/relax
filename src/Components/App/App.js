import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchResults: [
        {
        name: 'Progeny of Leeches',
        artist: 'Crucial Rip',
        album: 'The Object of Infection',
        id: '1'
      },
      {
        name: 'The Product Is You',
        artist: 'Incendiary',
        album: 'Thousand Mile Stare',
        id: '2'
      },
      {
        name: 'Subjected to a Beating',
        artist: 'Dying Fetus',
        album: 'Reign Supreme',
        id: '3'
      }
    ],
    
    playlistName: 'My Playlist',
    
    playlistTracks: [
      {
      name: 'Progeny of Leeches',
      artist: 'Crucial Rip',
      album: 'The Object of Infection',
      id: '1'
    },
    {
      name: 'The Product Is You',
      artist: 'Incendiary',
      album: 'Thousand Mile Stare',
      id: '2'
    }
  ]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);

  }

  addTrack(track) {
    if (!this.state.playlistTracks.some(playlistTrack => playlistTrack.id === track.id)) {
      let newPlaylistTracks = this.state.playlistTracks;
      newPlaylistTracks.push(track);
      this.setState({
        playlistTracks: newPlaylistTracks
      });
    }
  }

  removeTrack(track) {
    const newTracks = this.state.playlistTracks.filter((playlistTrack) => {
      return playlistTrack.id !== track.id;
    });
    this.setState({
      playlistTracks: newTracks
    });
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar />
          <div className="App-playlist">
            <SearchResults 
            searchResults={this.state.searchResults} 
            onAdd={this.addTrack} />
            <Playlist 
            playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;