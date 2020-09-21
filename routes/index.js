var express = require('express');
var router = express.Router();
var spotify = require('../public/api/spotify_api')

/* GET home page. */
router.get('/', function (req, res, next) {

  if (req.cookies.session_user === undefined) {
    res.render('login', { title: "Spotify Theme Playlists" })
  } else {
    res.render('index', { title: 'Spotify Theme Playlists' });

  }
});

router.get('/cookies', function (req, res, next) {
  res.render('cookies', { title: "Cookies Policy" })
}
)

router.post('/', async function (req, res, next) {

  let session = req.cookies
  let search_query = req.body.query

  let fresh_token = await spotify.refreshToken(session).catch(err => console.log(err))
  console.log("The user has searched for: " + search_query)



  let result = await spotify.findSongs(fresh_token, search_query).catch(err => console.log(err))
  let song_ids = await spotify.processSongs(result).catch(err => console.log(err))

  res.cookie('songs', song_ids)
  res.cookie('playlist_name', search_query)
  res.render('index', { data: result.items })


});

router.post('/create_playlist', async function (req, res, next) {

  let session = req.cookies

  let fresh_token = await spotify.refreshToken(session).catch(err => console.log(err))

  let playlist = await spotify.createPlaylist(fresh_token, session.playlist_name, session.session_user).catch(err => console.log(err))

  let success = await spotify.addSongsToPlaylist(fresh_token, session.songs, playlist.data.id).catch(err => console.log(err))

  res.clearCookie('songs')
  res.clearCookie('playlist_name')
})

router.get('/playlist_created', async function (req, res, next) {
  res.render('success', { title: "Your Playlist has been created" })

})


module.exports = router;



