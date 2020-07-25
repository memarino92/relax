
const Spotify = {
    accessToken: '',

    userId: '',

    authHeaders: {},
    
    redirectUri: process.env.REACT_APP_REDIRECT_URI,

    clientId: process.env.REACT_APP_CLIENT_ID,

    getAccessToken() {
        if (Spotify.accessToken) {
            return Spotify.accessToken;
        } else {
            let url = window.location.href;
            if (url.match(/access_token=([^&]*)/)) {
                Spotify.accessToken = url.match(/access_token=([^&]*)/)[1];
                let expiresIn = Number(url.match(/expires_in=([^&]*)/)[1]);

                window.setTimeout(() => Spotify.accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');

                return Spotify.accessToken;

            } else {
                window.location = `https://accounts.spotify.com/authorize?client_id=${Spotify.clientId}&response_type=token&scope=playlist-modify-public%20playlist-read-collaborative%20playlist-read-private%20playlist-modify-private&redirect_uri=${Spotify.redirectUri}`;
            }
        }
    },

    async getUserId() {
        if (Spotify.userId) {
            return Spotify.userId;
        } else {
            const idRequest = await fetch('https://api.spotify.com/v1/me', {
                headers: await Spotify.getAuthHeaders()
            });
            const jsonId = await idRequest.json();
            const userId = jsonId.id;
            Spotify.userId = userId;
            return Spotify.userId;
        }
    },

    async getAuthHeaders() {
        if (Spotify.authHeaders.Authorization) {
            return Spotify.authHeaders;
        } else {
            const authHeaders = { Authorization: `Bearer ${Spotify.getAccessToken()}` };
            Spotify.authHeaders = authHeaders;
            return Spotify.authHeaders;
        }
    },

    async search(term) {
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: await Spotify.getAuthHeaders()
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        } else {
            const tracks = jsonResponse.tracks.items.map((track) => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                };
            });
            return tracks;
        }
    },

    async savePlaylist(name, trackUris) {
        if(!name && trackUris) {
            return;
        } else {
            const newPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${Spotify.getUserId()}/playlists`, {
                headers: await Spotify.getAuthHeaders(),
                method: 'POST',
                body: JSON.stringify({ name: name })
            });
            const jsonPlaylistId = await newPlaylistResponse.json();
            const playlistId = jsonPlaylistId.id;
            await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: await Spotify.getAuthHeaders(),
                method: 'POST',
                body: JSON.stringify({ uris: trackUris })
            });
        }
    },

    async getUserPlaylists() {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: await Spotify.getAuthHeaders()
        });
        let jsonResponse = await response.json();
        if (!jsonResponse.items) {
            return [];
        } else {
            let userPlaylists = [];
            const userId = await Spotify.getUserId();
            jsonResponse.items.forEach((playlist) => {
                const userPlaylist = {
                    id: playlist.id,
                    name: playlist.name,
                    collaborative: playlist.collaborative,
                };
                if (playlist.owner.id === userId) {
                    userPlaylist.isOwner = true;
                } else {
                    userPlaylist.isOwner = false;
                }
                if (userPlaylist.collaborative || userPlaylist.isOwner) {
                userPlaylists.push(userPlaylist);
                }
            });
            while (jsonResponse.next) {
                let nextUrl = jsonResponse.next;
                let nextResponse = await fetch(nextUrl, {
                    headers: await Spotify.getAuthHeaders()
                });
                jsonResponse = await nextResponse.json();
                jsonResponse.items.forEach((playlist) => {
                    const userPlaylist = {
                        id: playlist.id,
                        name: playlist.name,
                        collaborative: playlist.collaborative,
                    };
                    if (playlist.owner.id === userId) {
                        userPlaylist.isOwner = true;
                    } else {
                        userPlaylist.isOwner = false;
                    };
                    if (userPlaylist.collaborative || userPlaylist.isOwner) {
                        userPlaylists.push(userPlaylist);
                    } 
                });
            }
            userPlaylists.sort((a, b) => {
                const playlistA = a.name.toUpperCase();
                const playlistB = b.name.toUpperCase();
              
                let comparison = 0;
                if (playlistA > playlistB) {
                  comparison = 1;
                } else if (playlistA < playlistB) {
                  comparison = -1;
                }
                return comparison;
              });
            return userPlaylists;
        }
    },

    async getPlaylistTracks(playlistId, playlistName) {
        const authHeaders = await Spotify.getAuthHeaders();
        let playlistTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        let playlistTracks = [];
        while (playlistTracksUrl) {
            let response = await fetch(playlistTracksUrl, {
                headers: authHeaders
            });
            let jsonResponse = await response.json();
            if (!jsonResponse.items) {
                return;
            }
            jsonResponse.items.forEach((track) => {
                const playlistTrack =  {
                    id: track.track.id,
                    name: track.track.name,
                    artist: track.track.artists[0].name,
                    album: track.track.album.name,
                    uri: track.track.uri
                };
                playlistTracks.push(playlistTrack)
            });
            playlistTracksUrl = jsonResponse.next;
        }
        return {tracks: playlistTracks, name: playlistName};
    }
};

export default Spotify;