var express = require('express');
var router = express.Router();
var api = require('axios')
var db = require('../public/database/db')
var sql = require('../public/database/sql_queries')

router.get(['/code', '/:'], async function (req, res) {
  let code = req.query.code
  let token_base_url = 'https://accounts.spotify.com/api/token'
  let grant_type = 'authorization_code'
  let redirect_uri = 'https://spotify-themes.azurewebsites.net/users/code'
  let user = { 'username': '', 'access_token': '', 'refresh_token': '' }


  let access_token = await api.request({
    url: token_base_url,
    method: 'post',
    params: {
      'grant_type': grant_type,
      'code': code,
      'redirect_uri': redirect_uri,
    },

    headers:
    {
      'content-type': 'application/x-www-form-urlencoded',
      'authorization': 'Basic NzA2N2I3ZDVkMzkwNDBhYTllODA0NTVlN2JmN2EyNTk6ZWM4NTBlNTU3NjUwNGE4ODg2YThlNmY1ZTAxZjNmMzI='
    }


  }).catch(err => console.log(err))


  let username = await api.request({
    url: 'https://api.spotify.com/v1/me',
    method: 'get',

    headers:
    {
      'content-type': 'application/x-www-form-urlencoded',
      'authorization': 'Bearer ' + access_token.data.access_token
    }
  }).catch(err => console.log(err))

  console.log(username)

  user.username = username.data.id
  user.access_token = access_token.data.access_token
  user.refresh_token = access_token.data.refresh_token

  console.log(user)

  res.cookie('session_user', user.username)
  res.cookie('access_token', user.access_token)
  res.cookie('refresh_token', user.refresh_token)
  res.render('index', { title: "Spotify Themes App" })


})


router.get('/token', async function (req, res, next) {

  let base_url = 'https://accounts.spotify.com'
  let authentication_url = '/authorize'
  let client_id = '&client_id=' + process.env.client_id
  let response_type = '?response_type=code'
  let redirect_uri = '&redirect_uri=https://spotify-themes.azurewebsites.net/users/code'
  let state = '&state=34fFs29kd09'
  let scope = '&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-collaborative playlist-read-private'

  let code_request_url = base_url + authentication_url + response_type + client_id + scope + redirect_uri + state

  let response = await api.get(code_request_url).catch(err => { console.log(err) })
  console.log(response)


  res.redirect(code_request_url)

});


module.exports = router;
