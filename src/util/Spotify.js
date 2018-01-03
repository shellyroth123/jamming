const clientId = "8b190698384c4ce0b59487cee521cfe5";
const redirectUri = "http:localhost:3000/";

let accessToken;

const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/); //if these are true we will return an array
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
     accessToken = accessTokenMatch[1];
     const expiresIn = Number(expiresInMatch[1]);
     window.setTimeout(() => accessToken = '', expiresIn * 1000); //The accessToken will be set to a blank variable in the expiration time.
     window.history.pushState('Access Token', null, '/');
     return accessToken;
   } else {
     const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
     window.location = accessUrl;
   }
 },

 search(term){
   const accessToken = Spotify.getAccessToken();
   return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
     {
       headers: {
         Authorization: `Bearer ${accessToken}`
       }
     }).then(response => {
         return response.json()
       }).then(jsonResponse =>
         {
           if(!jsonResponse.tracks){
             return [];
           }
             return jsonResponse.tracks.items.map(track =>
                 ({
                   id: track.id,
                   name: track.name,
                   artist: track.artists[0].name,
                   album: track.album.name,
                   uri: track.uri
                 }));
             });
 },

 savePlaylist(name, trackURIs){
   const accessToken = Spotify.getAccessToken();
   const headers = { Authorization: `Bearer ${accessToken}` };
   let userID;

   return fetch('https://api.spotify.com/v1/me',{
     headers: headers
   }).then(response => response.json()
   ).then(jsonResponse => {
     userID = jsonResponse.id;
     return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
     {
       headers: headers,
       method: 'POST',
       body: JSON.stringify({name: name})
     }).then(response => response.json()
   ).then(jsonResponse => {
     const playlistID = jsonResponse.id;
     return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
       headers: headers,
       method: 'POST',
       body: JSON.stringify({uris: trackURIs})
       })
     })
   });
 }


}


export default Spotify;
