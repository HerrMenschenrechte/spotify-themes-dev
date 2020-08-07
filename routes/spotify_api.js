var express = require('express');
var router = express.Router();
var api = require('axios')
var db = require('../database/db')
var sql = require('../database/sql_queries')

/* GET home page. */
router.post('/search', async function (req, res, next) {

    let token = await getToken()
    let search_query = req.body.query
    console.log(search_query)

    let result = await findSongs(token, search_query).catch(err => console.log(err))
    let song_ids = await processSongs(result).catch(err => console.log(err))
    await addSongsToPlaylist(song_ids).catch(err => console.log(err))
    await createPlaylist(token).catch(err => console.log(err))
    res.end(JSON.stringify(result.data.tracks.items))

});

router.get('/create', async function (req, res, next) {

    // Get a user access token

    let token = await getToken()

    // create a Playlist 
    let playlist = await createPlaylist(token).catch(err => console.log(err))

    console.log(playlist)
    console.log(playlist.status)

    // If the playlist is successfully created, show message to user, if there is a non-success status, show it to the user, if there is an error - show it to the user
    if (playlist.status == 201) {
        res.render('index', { title: 'Playlist Created' })
    } else if (playlist.status == undefined) {
        res.render('index', { title: playlist })
    } else {
        res.render('index', { title: "Error " + playlist.statusText })
    }

})

router.get('/delete', async function (req, res, next) {

    let token = await getToken()


})






async function createPlaylist(token) {

    let doesExist = []
    let id = []

    // Get the list of existing playlists
    let checkPlaylists = await api.request({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: { 'Authorization': 'Bearer ' + token },
        params: { limit: 50 }
    }).catch(err => console.log(err))

    // Push the existing playlist names into an array to check against the new playlist name

    await checkPlaylists.data.items.forEach(element => {
        doesExist.push(element.name)
        id.push(element.id)
    })

    console.log(doesExist)
    console.log(id)

    // if the playlist name already exists, return "playlist already exists" to the user
    let exist = doesExist.includes('Tuesday')
    console.log(exist)

    if (exist == true) {
        return "Playlist already exists"

        // if the playlist name does not exist, create playlist with the new name
    } else {



        console.log(checkPlaylists)

        let playlist = api.request({
            method: 'POST',
            url: 'https://api.spotify.com/v1/users/teddmanbvb/playlists',
            headers: { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' },
            data: { 'name': 'Tuesday', }


        }).catch(err => console.log(err))

        return playlist
    }
}




async function getToken() {

    let connection = await db.createPool().catch(err => console.log(err))
    let user = await connection.query(sql.sql_read_user)
    let access_token = user[0].access_token
    let refresh_token = user[0].refresh_token

    return access_token

}

async function findSongs(token, search_query) {




    let result = await api.request({
        method: "get",
        url: "https://api.spotify.com/v1/search",
        headers: { 'Authorization': 'Bearer ' + token },
        params: { 'q': search_query, 'type': 'track' }
    }).catch(err => console.log(err))

    console.log(result)

    return result
}

async function processSongs(songs) {

    let song_ids = []
    songs.data.tracks.items.forEach(element => {
        console.log(element.id)
        song_ids.push("spotify:track:" + element.id)

    });

    return song_ids
}

async function getPlaylistId(playlistName) {

    let token = await getToken()

    let playlists = await api.request({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: { 'Authorization': 'Bearer ' + token },
        params: { limit: 50 }
    }).catch(err => console.log(err))



}

async function addSongsToPlaylist(song_ids) {
    console.log(song_ids)

    let songs_to_add = song_ids
    console.log(songs_to_add)

    let token = await getToken()

    let added = await api.request({
        method: "PUT",
        url: "https://api.spotify.com/v1/playlists/1SWqO7EomHsO98P1fQs1VR/tracks",
        headers: { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' },
        params: {},
        data: { uris: songs_to_add }
    }).catch(err => console.log(err.response.data))

    console.log(added)
}


module.exports = router;
