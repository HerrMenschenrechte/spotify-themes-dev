var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function (req, res) {

  let my_client_id = "7067b7d5d39040aa9e80455e7bf7a259"
  let scopes = 'user-read-private user-read-email';
  let redirect_uri = "http://localhost:3000"
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
});


module.exports = router;
