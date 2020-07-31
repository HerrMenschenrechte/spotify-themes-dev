exports.sql_insert_user = `INSERT INTO users (first_name, last_name, access_token, refresh_token) VALUES (?)`;

exports.sql_read_user = `SELECT * FROM Spotify.users`;