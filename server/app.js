import express from 'express';
import cors from 'cors';
import { getAnime,getAnimes,getAnimeDetails,getGenres,getGenresCnt } from './database.js';
const app = express();

app.use(cors());

app.get('/api/', (req, res) => {
    res.send('Hello World!');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/api/getAnimes', async (req, res) => {
    const animes = await getAnimes();
    res.send(animes);
});

app.get('/api/getAnime/:id', async (req, res) => {
    const id = req.params.id;
    const animes = await getAnime(id);
    res.send(animes);
});

app.get('/api/getAnimeDetails/:id', async (req, res) => {
    const id = req.params.id;
    //console.log(id);
    const anime_details = await getAnimeDetails(id);
    res.send(anime_details);
});

app.get('/api/getGenres', async (req, res) => {
    const genres = await getGenres();
    res.send(genres);
});

app.get('/api/getGenresCnt', async (req, res) => {
    const genres_cnt = await getGenresCnt();
    res.send(genres_cnt);
});

app.listen(8800, () => {
    console.log('Server started on port 8800');
});