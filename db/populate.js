const {Client} = require("pg");
require("dotenv").config();

const DROP = `
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS memberships;
`;

const CREATE = `
    CREATE TABLE IF NOT EXISTS memberships (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        firstname VARCHAR(255),
        lastname VARCHAR(255),
        email VARCHAR(255),
        membership INTEGER REFERENCES memberships,
        password VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        time TIMESTAMP,
        text TEXT,
        userId INTEGER REFERENCES users
    );
`;

const POPULATE = `
    INSERT INTO memberships (name) VALUES
        ('basic'),
        ('premium');

    INSERT INTO users (firstname, lastname, email, membership, password) VALUES
        ('admin', 'admin', 'admin@sample.com', '1', '1234');

    INSERT INTO messages (time, text, userId) VALUES
        ('2025-10-14 9:44:10', 'Sample Text', (SELECT id FROM users WHERE lastname = 'admin'));
`

async function main() {
    console.log("seeding...");
    const client = new Client ({
        connectionString: process.env.CONNECTION_STRING
    });
    await client.connect();
    console.log("connected", process.env.CONNECTION_STRING);
    await client.query(DROP);
    await client.query(CREATE);
    await client.query(POPULATE);
    await client.end();
    console.log("success!");
}

main();
