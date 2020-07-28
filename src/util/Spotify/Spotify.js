const Spotify = {
    accessToken: '',

    userId: '',

    authHeaders: {},

    redirectUri: process.env.REACT_APP_REDIRECT_URI,

    clientId: process.env.REACT_APP_CLIENT_ID,

    getAccessToken() {
        if (this.accessToken) {
            return this.accessToken;
        } else {
            let url = window.location.href;
            if (url.match(/access_token=([^&]*)/)) {
                this.accessToken = url.match(/access_token=([^&]*)/)[1];
                let expiresIn = Number(url.match(/expires_in=([^&]*)/)[1]);

                window.setTimeout(() => this.accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');

                return this.accessToken;

            } else {
                window.location = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=token&scope=playlist-modify-public%20playlist-read-collaborative%20playlist-read-private%20playlist-modify-private&redirect_uri=${this.redirectUri}`;
            }
        }
    },

    async getUserId() {
        if (this.userId) {
            return this.userId;
        } else {
            const authHeaders = await this.getAuthHeaders();
            const idRequest = await fetch('https://api.spotify.com/v1/me', {
                headers: authHeaders
            });
            const jsonId = await idRequest.json();
            const userId = jsonId.id;
            this.userId = userId;
            return this.userId;
        }
    },

    async getAuthHeaders() {
        if (this.authHeaders.Authorization) {
            return this.authHeaders;
        } else {
            const accessToken = this.getAccessToken()
            const authHeaders = { Authorization: `Bearer ${accessToken}` };
            this.authHeaders = authHeaders;
            return this.authHeaders;
        }
    },

    //rename to search for track and update calls on other branches
    async search(term) {
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: await this.getAuthHeaders()
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        } else {
            const tracks = jsonResponse.tracks.items.map((track) => {
                return this.trackToTrackConverter(track);
            });
            return tracks;
        }
    },

    //should return playlist object
    async savePlaylist(name, trackUris) {
        if(!name && trackUris) {
            return;
        } else {
            const authHeaders = await this.getAuthHeaders();
            const userId = await this.getUserId();
            const newPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`
            const newPlaylistResponse = await fetch(newPlaylistUrl, {
                headers: authHeaders,
                method: 'POST',
                body: JSON.stringify({ name: name })
            });
            const jsonPlaylistId = await newPlaylistResponse.json();
            const playlistId = jsonPlaylistId.id;
            await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: authHeaders,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris })
            });
        }
    },

    //needs cleaning up in paging method and playlist conversion
    async getUserPlaylists() {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: await this.getAuthHeaders()
        });
        let jsonResponse = await response.json();
        if (!jsonResponse.items) {
            return [];
        } else {
            let userPlaylists = [];
            const userId = await this.getUserId();
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
                    headers: await this.getAuthHeaders()
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
            //sort function should be a named module method with additional, optional arguments
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

    //need to clean up track to track conversion, create playlist track => local track method
    async getPlaylistTracks(playlistId, playlistName) {
        const authHeaders = await this.getAuthHeaders();
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
                const playlistTrack =  this.playlistTracktoTrackconverter(track);
                playlistTracks.push(playlistTrack)
            });
            playlistTracksUrl = jsonResponse.next;
        }
        return {tracks: playlistTracks, name: playlistName};
    },

    //returns first artist from array of response
    async searchForArtist(term) {
        const authHeaders = await this.getAuthHeaders();
        const searchArtistUrl = `https://api.spotify.com/v1/search?type=artist&q=${term}`;
        const response = await fetch(searchArtistUrl, {
            headers: authHeaders
        });
        const jsonResponse = await response.json();
        const artist = this.artistToArtistConverter(jsonResponse.artists.items[0]);

        return artist;
    },

    //returns array of local artist objects
    async getRelatedArtists(artistId) {
        const authHeaders = await this.getAuthHeaders();
        const relatedArtistUrl = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
        const response = await fetch(relatedArtistUrl, {
            headers: authHeaders
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.artists) {
            return [];
        }
        let relatedArtists = [];
        jsonResponse.artists.forEach(artist => {
            const relatedArtist =  this.artistToArtistConverter(artist);
            relatedArtists.push(relatedArtist);
        });
        return relatedArtists;
    },

    //returns artists top 10 tracks
    async getTopTracks(artistId) {
        const authHeaders = await this.getAuthHeaders();
        const topTracksUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=from_token`;
        const response = await fetch(topTracksUrl, {
            headers: authHeaders
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        }
        let topTracks = [];
        jsonResponse.tracks.forEach(track => {
            const topTrack = this.trackToTrackConverter(track);
            topTracks.push(topTrack);
        });
        return topTracks;
    },

    //converts Spotify track objects to local track objects
    trackToTrackConverter(spotifyTrackObject) {
        const localTrackObject = {
            id: spotifyTrackObject.id,
            name: spotifyTrackObject.name,
            artist: spotifyTrackObject.artists[0].name,
            album: spotifyTrackObject.album.name,
            albumImageUrls: spotifyTrackObject.album.images,
            uri: spotifyTrackObject.uri
        };
        return localTrackObject;
    },

    //converts Spotify artist object to local artist object
    artistToArtistConverter(spotifyArtistObject) {
        const localArtistObject = {
            name: spotifyArtistObject.name,
            id: spotifyArtistObject.id,
            imageUrls: spotifyArtistObject.images
        };
        return localArtistObject;
    },

    //converts Spotify playlist track object to local track object
    playlistTracktoTrackconverter(spotifyPlaylistTrackObject) {
        const spotifyTrackObject = spotifyPlaylistTrackObject.track;
        const localTrackObject = this.trackToTrackConverter(spotifyTrackObject);
        return localTrackObject;
    }

};

export default Spotify;