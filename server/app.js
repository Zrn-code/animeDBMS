import express from 'express';
import cors from 'cors';
import { getAnime,getAnimes,getAnimeDetails } from './database.js';
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

app.get('/api/getAnimeDetails/:id', async (req, res) => {
    const id = req.params.id;
    const anime_details = await getAnimeDetails(id);
    res.send(anime_details);
});


app.listen(8800, () => {
    console.log('Server started on port 8800');
});