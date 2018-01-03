import React, { Component } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [{
        name: 'Rock and Roll',
        artist: 'Aerosmith',
        album: 'Aerosmith unplugged'
      }],
      playlistName: "My Playlist",
      playlistTracks: [{
        name: "this name",
        artist: 'this artist',
        album: 'this album'
      }]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.searchSpotify = this.searchSpotify.bind(this);
  }

  async searchSpotify(term) {
   console.log('Searching Spotify with ' + term);
   let trackList = await Spotify.search(term);
   this.setState({searchResults: trackList});
   console.log(this.state.searchResults);
 }

  addTrack(track) {
    let currentTracks = this.state.playlistTracks;
    let dups = currentTracks.filter(song => song.id === track.id);
    if (dups === 0) {
      currentTracks.push(track);
      this.setState({
        playlistTracks: currentTracks
      });
    }
  }

  removeTrack(track){
    let id = track.id;
    let currentPlaylistTracks = this.state.playlistTracks;
    let newPlaylist = currentPlaylistTracks.filter(song => song.id !== id);
    this.setState({
      playlistTracks: newPlaylist
    });
  }

updatePlaylistName(name) {
  this.setState({
    playlistName: name
  });
}

savePlaylist(){
     let tracks = this.state.playlistTracks;
     let trackURIs = tracks.map(track => track.uri);
     Spotify.savePlaylist(this.state.playlistName, trackURIs);
     window.setTimeout(() => alert(this.state.playlistName + "has been added to your Spotify Playlist"), 1500);
 }

 render() {
   return (
     <div>
       <h1>Ja<span className="highlight">mmm</span>ing</h1>
       <div className="App">
         < SearchBar searchSpotify={this.searchSpotify} />
         <div className="App-playlist">
           <SearchResults tracks={this.state.searchResults} onAdd={this.addTrack} />
           <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} />
         </div>
       </div>
     </div>
   );
 }
}

export default App;
