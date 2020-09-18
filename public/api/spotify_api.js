var api = require('axios')


async function refreshToken(session) {


    console.log(session)
    refresh_token = session.refresh_token
    console.log(refresh_token)

    let new_access_token = await api.request({
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        params: {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': process.env.client_id
        },

        headers:
        {
            'content-type': 'application/x-www-form-urlencoded',
            'authorization': 'Basic ' + process.env.client_secret
        }
    }).catch(err => console.log(err))


    console.log(new_access_token)

    return new_access_token.data.access_token
}




async function createPlaylist(token, playlist_name, active_user) {



    let playlist = api.request({
        method: 'POST',
        url: 'https://api.spotify.com/v1/users/' + active_user + '/playlists',
        headers: { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' },
        data: { 'name': playlist_name, }


    }).catch(err => console.log(err))

    return playlist
}



async function findSongs(token, search_query) {



    let result = await api.request({
        method: "get",
        url: "https://api.spotify.com/v1/search",
        headers: { 'Authorization': 'Bearer ' + token },
        params: { 'q': search_query, 'type': 'track', 'market': 'from_token' }
    }).catch(async function handleError(err) {
        console.log(err)
        let refreshed_token = await refreshToken(username)
        let result_new = await findSongs(username, refreshed_token, search_query)
        console.log(result_new)
        return result_new.data.tracks

    })

    return result.data.tracks
}

async function processSongs(songs) {

    let song_ids = []
    songs.items.forEach(element => {
        console.log(element.id)
        song_ids.push("spotify:track:" + element.id)

    });

    return song_ids
}

async function getPlaylistId(user) {

    console.log(user)


    let playlists = await api.request({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: { 'Authorization': 'Bearer ' + user.data.access_token },
        params: { limit: 50 }
    }).catch(err => console.log(err))

    console.log(playlists)
    return playlists


}

async function addSongsToPlaylist(token, song_ids, playlist_id) {
    console.log(song_ids.join())
    console.log(token)

    let added = await api.request({
        method: "PUT",
        url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks",
        headers: { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' },
        params: { uris: song_ids.join() },


    }).catch(err => console.log(err.response))

    return added
}



exports.refreshToken = refreshToken
exports.getPlaylistId = getPlaylistId
exports.createPlaylist = createPlaylist
exports.addSongsToPlaylist = addSongsToPlaylist
exports.findSongs = findSongs
exports.processSongs = processSongs
