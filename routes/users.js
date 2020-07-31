var express = require('express');
var router = express.Router();
var api = require('axios')
var db = require('../database/db')
var sql = require('../database/sql_queries')


/* GET users listing. */
router.get('/login', function (req, res) {

  let my_client_id = "7067b7d5d39040aa9e80455e7bf7a259"
  let scopes = 'user-read-private user-read-email';
  let redirect_uri = "http://localhost:3000"

  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri))
}

);

router.get('/code', async function (req, res) {
  let code = req.query.code
  let token_base_url = 'https://accounts.spotify.com/api/token'
  let grant_type = 'authorization_code'
  let redirect_uri = 'http://localhost:3000/users/code'
  let token_url = token_base_url
  let connection = await db.createPool().catch(err => console.log(err))
  let user = { 'first_name': 'Cedric', 'last_name': 'Mensah', 'access_token': '', 'refresh_token': '' }

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
  }).catch(err => { console.log(err) })
  user.access_token = access_token.data.access_token
  user.refresh_token = access_token.data.refresh_token
  console.log(user)
  let db_response = await connection.query(sql.sql_insert_user, [[user.first_name, user.last_name, user.access_token, user.refresh_token]]).catch(err => console.log(err))
  console.log(db_response)
  // console.log(access_token)
  res.render('index', { title: "Spotify Themes App" })


})


router.get('/token', async function (req, res, next) {

  let base_url = 'https://accounts.spotify.com'
  let authentication_url = '/authorize'
  let client_id = '&client_id=7067b7d5d39040aa9e80455e7bf7a259'
  let response_type = '?response_type=code'
  let redirect_uri = '&redirect_uri=http://localhost:3000/users/code'
  let state = '&state=34fFs29kd09'
  let scope = '&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-collaborative playlist-read-private'

  let code_request_url = base_url + authentication_url + response_type + client_id + scope + redirect_uri + state

  await api.get(code_request_url).catch(err => { console.log(err) })
  res.redirect(code_request_url)

});


module.exports = router;
