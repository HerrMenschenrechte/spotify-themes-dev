var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Spotify Theme Playlists' });
});

router.post('/search', function (req, res, next) {

  console.log(req.body.query)

})

module.exports = router;



