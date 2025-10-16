const pool = require("./pool");

exports.getUser = async function(id) {
    const {rows} = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    return rows[0];
}

exports.get = async function(query) {
    const {rows} = await pool.query(query);

    return rows;
}

exports.getUserByUsername = async function(username) {
    const {rows} = await pool.query("SELECT * FROM users WHERE email = $1", [username]);

    return rows[0];
}

exports.addUser = async function(username, hashedPassword) {
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [username, hashedPassword]);
}

exports.addMessage = async function(user, message, date) {
    await pool.query("INSERT INTO messages (username, message, date) VALUES ($1, $2, $3)", [user, message, date]);
}