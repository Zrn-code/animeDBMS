import express from 'express';
import cors from 'cors';
import { getAnime,getAnimes,getAnimeDetails,getGenres,getGenresCnt,getGenreName } from './database.js';
const app = express();

app.use(cors());

app.get('/api/', (req, res) => {
    res.send('Hello World!');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await findByEmail(email);
  
      if (!user) {
        return res.status(401).json({ message: 'The email is not correct.' });
      }
  
      const isPasswordValid = await checkPassword(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'The email or password is not correct.' });
      }
  
      return res.status(200).json({ message: 'login success', user: user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'server failed' });
    }
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

app.get('/api/getGenreName/:id', async (req, res) => {
    const id = req.params.id;
    const genre_name = await getGenreName(id);
    res.send(genre_name);
});

app.get('/api/getGenresCnt/:id', async (req, res) => {
    const id = req.params.id;
    const genre_cnt = await getGenresCnt(id);
    res.send(genre_cnt);
});


app.listen(8800, () => {
    console.log('Server started on port 8800');
});