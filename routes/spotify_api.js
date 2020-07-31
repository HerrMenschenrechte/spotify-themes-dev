var express = require('express');
var router = express.Router();
var api = require('axios')
var db = require('../database/db')
var sql = require('../database/sql_queries')

/* GET home page. */
router.get('/search', async function (req, res, next) {

    let connection = await db.createPool().catch(err => console.log(err))
    let user = await connection.query(sql.sql_read_user)
    let access_token = user[0].access_token
    let refresh_token = user[0].refresh_token

    let song = await api.request({
        method: "get",
        url: "https://api.spotify.com/v1/search",
        headers: { 'Authorization': 'Bearer ' + access_token },
        params: { 'q': "q=all+night+long", 'type': 'track' }
    }).catch(err => console.log(err))

    console.log(song)
    res.render('index', { title: 'Song Found' })
});



module.exports = router;
