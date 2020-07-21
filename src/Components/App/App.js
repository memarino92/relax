import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify/Spotify';
import { DragDropContext } from 'react-beautiful-dnd';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchTerms: '',
      
      searchResults: [],
    
      playlistName: 'New Playlist',
    
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateSearchTerms = this.updateSearchTerms.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

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

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    const playlistName = this.state.playlistName;
    await Spotify.savePlaylist(playlistName, trackURIs);
    alert('Playlist saved!');
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  async search() {
    const newResults = await Spotify.search(this.state.searchTerms);
    this.setState({
      searchResults: newResults
    });
  }

  updateSearchTerms(terms) {
    this.setState({
      searchTerms: terms
    });
  }

  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
  }

  onDragEnd(result) {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
    ) {
    return;
    }

    const newPlaylistTracks = Array.from(this.state.playlistTracks);
    newPlaylistTracks.splice(source.index, 1);
    newPlaylistTracks.splice(destination.index, 0, this.state.playlistTracks[source.index]);

    this.setState({
      playlistTracks: newPlaylistTracks
    })
}

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar 
            onSearch={this.search}
            onTermChange={this.updateSearchTerms} 
            playlistName={this.state.playlistName}/>
          <div className="App-playlist">
            <SearchResults 
            searchResults={this.state.searchResults} 
            onAdd={this.addTrack} />
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist} />
            </DragDropContext>
          </div>
        </div>
      </div>
    );
  }
}

export default App;