exports.sql_insert_user = `INSERT INTO users (username, access_token, refresh_token) VALUES (?)`;

exports.sql_read_user = `SELECT * FROM Spotify.users WHERE username=`;

exports.sql_update_token = `UPDATE Spotify.users SET access_token = ?`