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

async function getGenres(){
    const result = await pool.query('SELECT * FROM genres');
    return result[0];
}

async function getGenreName(id){
    const result = await pool.query('SELECT Genre_name FROM genres WHERE Genre_id = ?', [id]);
    return result[0];
}

async function getGenresCnt(id) {
    if (id) {
        const result = await pool.query('SELECT count(anime_genres.anime_id) as cnt FROM anime_genres WHERE anime_genres.Genre_id = ?', [id]);
        return result[0];
    } else {
        const result = await pool.query('SELECT anime_genres.Genre_id, count(anime_genres.anime_id) as cnt FROM anime_genres GROUP BY anime_genres.Genre_id');
        return result[0];
    }
}


async function findUserByEmail(email){
    const result = await pool.query('SELECT * FROM users_account WHERE users_account.user_email = ?', [email]);
    return result[0][0];
  };


async function getProfile(id) {
    const result = await pool.query('SELECT * FROM users_details WHERE users_details.Mal_id = ?', [id]);
    return result[0][0];
}


export { getAnimes, getAnime, getAnimeDetails, getGenres ,getGenresCnt,getGenreName,findUserByEmail,getProfile};