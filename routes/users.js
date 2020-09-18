var express = require('express');
var router = express.Router();
var api = require('axios')

router.get(['/code', '/:'], async function (req, res) {
  let code = req.query.code
  let token_base_url = 'https://accounts.spotify.com/api/token'
  let grant_type = 'authorization_code'
  let redirect_uri = 'http://localhost:3000/users/code'

  let access_token = await api.request({
    url: token_base_url,
    method: 'post',
    params: {
      'grant_type': grant_type,
      'code': code,
      'redirect_uri': redirect_uri,
      'client_id': 'f822f424fd864e459d4953e969865a7f',
      'client_secret': '1f1873ac40a7430881a4bf95c054eb12'
    },

    headers:
    {
      'content-type': 'application/x-www-form-urlencoded',
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

  console.log(access_token)

  res.cookie('session_user', username.data.id)
  res.cookie('access_token', access_token.data.access_token)
  res.cookie('refresh_token', access_token.data.refresh_token)
  res.render('index', { title: "Spotify Themes App" })


})


router.get('/token', async function (req, res, next) {

  let base_url = 'https://accounts.spotify.com'
  let authentication_url = '/authorize'
  let client_id = '?client_id=f822f424fd864e459d4953e969865a7f'
  let response_type = '&response_type=code'
  let redirect_uri = '&redirect_uri=http://localhost:3000/users/code'
  let state = '&state=34fFs29kd09'
  let scope = '&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-collaborative playlist-read-private'

  let code_request_url = base_url + authentication_url + client_id + response_type + scope + redirect_uri + state

  let response = await api.get(code_request_url).catch(err => console.log(err))

  res.redirect(code_request_url)

});


module.exports = router;
