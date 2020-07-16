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
    ]
    };
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} />
            <Playlist />
          </div>
        </div>
      </div>
    );
  }
}

export default App;