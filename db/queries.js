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

exports.addMessage = async function(username, message, date) {
    const user = await getUserByUsername(username);
    await pool.query("INSERT INTO messages (user, text, time) VALUES ($1, $2, $3)", [user.id, message, date]);
}

exports.getMessages = async function() {
    const { rows } = await pool.query("SELECT (email, time, text) FROM messages LEFT JOIN users ON messages.userId = users.id");
    const res = [];
    // transform row strings into objects
    for (let {row} of rows) {
        console.log(row);
        let [user, time, text] = row.split(",");
        user = user.slice(1);
        time = time.slice(1, -1);
        text = text.slice(1, -2);
        res.push({user, time, text});
    }
    return res;
}