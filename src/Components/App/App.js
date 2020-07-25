import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import ArtistTracks from '../ArtistTracks/ArtistTracks';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify/Spotify';
import ArtistList from '../ArtistList/ArtistList';
import { DragDropContext } from 'react-beautiful-dnd';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchTerms: '',
      
      searchResults: [],
    
      playlistName: 'New Playlist',
    
      playlistTracks: [],

      artistTracks: [
        {
          name: 'Test Track',
          id: '1',
          artist: 'fake artist',
          album: 'don\'t exist'
        }
      ],

      relatedArtistsList: [
        {
          name: 'Test Artist',
          id: '1'
        }
      ],

      selectedArtist: {}
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateSearchTerms = this.updateSearchTerms.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.getPlaylistTracks = this.getPlaylistTracks.bind(this);
    this.getTopTracks = this.getTopTracks.bind(this);

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
    const selectedArtist = await Spotify.searchForArtist(this.state.searchTerms);
    this.setState({
      selectedArtist: selectedArtist
    });
    const relatedArtists = await Spotify.getRelatedArtists(selectedArtist.id);
    this.setState({
      relatedArtistsList: relatedArtists
    })
  }

  updateSearchTerms(terms) {
    this.setState({
      searchTerms: terms
    });
  }

  async componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
    const userPlaylists = await Spotify.getUserPlaylists();
    this.setState({
      userPlaylists: userPlaylists
    });
  }

  async getPlaylistTracks(playlistId, playlistName) {
    const newState = await Spotify.getPlaylistTracks(playlistId, playlistName);
    this.setState({
      playlistTracks: newState.tracks,
      playlistName: newState.name
    });
  }

  async getTopTracks(artistId) {
    const newArtistTracks = await Spotify.getTopTracks(artistId);
    this.setState({
      artistTracks: newArtistTracks
    });
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
    const trackMoved = newPlaylistTracks[source.index];
    newPlaylistTracks.splice(source.index, 1);
    newPlaylistTracks.splice(destination.index, 0, trackMoved);

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
            <ArtistList 
            artists={this.state.relatedArtistsList} 
            getTopTracks={this.getTopTracks} />
            <ArtistTracks 
            tracks={this.state.artistTracks} 
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