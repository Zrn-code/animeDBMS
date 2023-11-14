import express from 'express';
import {getid_values} from './database.js';
const app = express();


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/get_values', async (req, res) => {
    const id_values = await getid_values();
    res.send(id_values);
});
app.listen(5000, () => {
    console.log('Server started on port 5000');
});