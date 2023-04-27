import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { login, signup } from './src/users.js';
import { getShows, addShow } from './src/shows.js';

const app = express();
app.use(cors());
app.use(express.json());

// User Routes:
app.post("/signup", signup);
app.post("/login", login);

// Show Routes:
app.get("/shows", getShows);
app.post("/shows", addShow);



// lets us run locally without emulators:
app.listen(3000, () => console.log(`Listening on http://localhost:3000...`));

export const api = functions.https.onRequest(app);