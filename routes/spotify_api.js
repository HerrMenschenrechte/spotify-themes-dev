var express = require('express');
var router = express.Router();
var api = require('axios')
var db = require('../database/db')
var sql = require('../database/sql_queries')

/* GET home page. */
router.get('/search', async function (req, res, next) {

    let token = await getToken()

    let result = await findSongs(token).catch(err => console.log(err))
    let song_ids = await processSongs(result).catch(err => console.log(err))
    await addSongsToPlaylist(token, song_ids).catch(err => console.log(err))
    await createPlaylist(token).catch(err => console.log(err))
    res.end(JSON.stringify(result.data.tracks.items))

});

router.get('/create', async function (req, res, next) {

    let token = await getToken()
    let playlist = await createPlaylist(token).catch(err => console.log(err))
    console.log(playlist)
    console.log(playlist.status)
    if (playlist.status == 201) {
        res.render('index', { title: 'Playlist Created' })
    } else if (playlist.status == undefined) {
        res.render('index', { title: playlist })
    } else {
        res.render('index', { title: "Error " + playlist.statusText })
    }
})






async function createPlaylist(token) {

    let doesExist = []
    let checkPlaylists = await api.request({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: { 'Authorization': 'Bearer ' + token },
        params: { limit: 50 }
    }).catch(err => console.log(err))

    await checkPlaylists.data.items.forEach(element => {
        doesExist.push(element.name)
    })

    console.log(doesExist)
    let exist = doesExist.includes('Tuesday')

    if (exist == true) {
        return "Playlist already exists"
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

async function findSongs(token) {




    let result = await api.request({
        method: "get",
        url: "https://api.spotify.com/v1/search",
        headers: { 'Authorization': 'Bearer ' + token },
        params: { 'q': "all+night+long", 'type': 'track' }
    }).catch(err => console.log(err))

    console.log(result)

    return result
}

async function processSongs(songs) {

    let song_ids = []
    songs.data.tracks.items.forEach(element => {
        console.log(element.id)
        song_ids.push(element.id)

    });

    return song_ids
}

async function addSongsToPlaylist(token, song_ids) {
    console.log(song_ids)



}


module.exports = router;
