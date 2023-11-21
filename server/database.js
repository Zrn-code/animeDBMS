import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();

async function getAnimes() {
    const result = await pool.query('SELECT * FROM anime_dataset limit 10');
    return result[0];
}

async function getAnime(id) {
    const result = await pool.query('SELECT * FROM anime_dataset WHERE anime_id = ?', [id]);
    return result[0];
}

async function getAnimeDetails(id) {
    const result = await pool.query('SELECT * FROM anime_details WHERE anime_id = ?', [id]);
    return result[0];
}


export { getAnimes, getAnime, getAnimeDetails};