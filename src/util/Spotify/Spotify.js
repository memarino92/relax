
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
                window.location = `https://accounts.spotify.com/authorize?client_id=${Spotify.clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${Spotify.redirectUri}`;
            }
        }
    },

    async getUserId() {
        if (!Spotify.accessToken) {
            Spotify.getAccessToken();
        }
        if (Spotify.userId) {
            return Spotify.userId;
        } else {
            const authHeaders = {Authorization: `Bearer ${Spotify.getAccessToken()}`};
            Spotify.authHeaders = authHeaders;
            const idRequest = await fetch('https://api.spotify.com/v1/me', {
                headers: Spotify.authHeaders
            });
            const jsonId = await idRequest.json();
            const userId = jsonId.id;
            Spotify.userId = userId;
            return userId;
        }
    },

    async search(term) {
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: Spotify.authHeaders
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
            const userId = await Spotify.getUserId();
            const newPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: Spotify.authHeaders,
                method: 'POST',
                body: JSON.stringify({ name: name })
            });
            const jsonPlaylistId = await newPlaylistResponse.json();
            const playlistId = jsonPlaylistId.id;
            await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: Spotify.authHeaders,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris })
            });
        }
    }
};

export default Spotify;