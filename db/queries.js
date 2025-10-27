const pool = require("./pool");

exports.getUser = async function(id) {
    const {rows} = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (rows[0].membership !== null) {
        const memberships = await pool.query("SELECT name FROM memberships WHERE id = $1", [rows[0].membership]);
        const membership = memberships?.rows[0];
        rows[0].membership = membership?.name;
    }

    return rows[0];
}

exports.get = async function(query) {
    const {rows} = await pool.query(query);

    return rows;
}

exports.getUserByUsername = async function(username) {
    const {rows} = await pool.query("SELECT * FROM users WHERE email = $1", [username]);
    if (rows.length === 0) {
        return null;
    }
    if (rows[0].membership !== null) {
        const memberships = await pool.query("SELECT name FROM memberships WHERE id = $1", [rows[0].membership]);
        const membership = memberships?.rows[0];
        rows[0].membership = membership?.name;
    }   
    return rows[0];
}

exports.addUser = async function(firstname, lastname, username, membership, hashedPassword) {
    await pool.query("INSERT INTO users (firstname, lastname, email, membership, password) VALUES ($1, $2, $3, $4, $5)", [firstname, lastname, username, membership, hashedPassword]);
}

exports.addMessage = async function(user, message, date) {
    await pool.query("INSERT INTO messages (userId, text, time) VALUES ($1, $2, $3)", [user, message, date]);
}

exports.getMessages = async function() {
    const { rows } = await pool.query("SELECT (email, time, text) FROM messages LEFT JOIN users ON messages.userId = users.id");
    const res = [];
    // transform row strings into objects
    for (let {row} of rows) {
        let [user, time, text] = row.split(",");
        user = user.slice(1);
        time = time.slice(0, -1) + "Z";
        
        if (text.charAt(0) == '"') {
            text = text.slice(1, -2);
        }
        else {
            text = text.slice(0, -1);
        }
        res.push({user, time, text});
    }
    return res;
}