import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import bodyParser from "body-parser"
import * as db from "./database.js"
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get("/api/", (req, res) => {
    res.send("Hello World!")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body

    console.log(email)
    try {
        const user = await db.findUserByEmail(email)
        //console.log(email);
        //console.log(user);
        if (!user) {
            return res.status(401).json({ message: "The email is not found." })
        }

        let isPasswordValid = false
        if (user.user_password === password) isPasswordValid = true

        if (!isPasswordValid) {
            return res.status(401).json({ message: "The email or password is not correct." })
        }
        const payload = {
            id: user.user_id,
            email: user.user_email,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })
        return res.status(200).json({ message: "login success", token: token })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "server failed" })
    }
})

app.get("/api/getProfile", async (req, res) => {
    console.log(req.headers.authorization)
    const token = req.headers.authorization
    if (!token) return res.status(401).send("Token not found")

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Token expired")
            } else {
                return res.status(401).send("Token is invalid")
            }
        }
        const id = authData.id
        const profile = await db.getProfile(id)
        res.send(profile)
    })
})

app.get("/api/getEmail", async (req, res) => {
    console.log(req.headers.authorization)
    const token = req.headers.authorization
    if (!token) return res.status(401).send("Token not found")

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Token expired")
            } else {
                return res.status(401).send("Token is invalid")
            }
        }
        const id = authData.id
        const email = await db.getEmail(id)
        console.log(email)
        res.send(email)
    })
})

app.get("/api/getAnimesCnt", async (req, res) => {
    const animes_cnt = await db.getAnimesCnt()
    res.send(animes_cnt)
})

app.get("/api/getWatchStatusCnt", async (req, res) => {
    const watch_status_cnt = await db.getWatchStatusCnt()
    res.send(watch_status_cnt)
})

app.get("/api/getRatingCnt", async (req, res) => {
    const rating_cnt = await db.getRatingCnt()
    res.send(rating_cnt)
})

app.get("/api/getUserCnt", async (req, res) => {
    const user_cnt = await db.getUserCnt()
    res.send(user_cnt)
})

app.get("/api/getReviewCnt", async (req, res) => {
    const review_cnt = await db.getReviewCnt()
    res.send(review_cnt)
})

app.get("/api/getAnimes", async (req, res) => {
    const animes = await db.getAnimes()
    res.send(animes)
})

app.get("/api/getAnime/:id", async (req, res) => {
    const id = req.params.id
    const animes = await db.getAnime(id)
    res.send(animes)
})

app.get("/api/getAnimeDetails/:id", async (req, res) => {
    const id = req.params.id
    //console.log(id);
    const anime_details = await db.getAnimeDetails(id)
    res.send(anime_details)
})

app.get("/api/getGenres", async (req, res) => {
    const genres = await db.getGenres()
    res.send(genres)
})

app.get("/api/getGenresCnt", async (req, res) => {
    const genres_cnt = await db.getGenresCnt()
    res.send(genres_cnt)
})

app.get("/api/getGenreName/:id", async (req, res) => {
    const id = req.params.id
    const genre_name = await db.getGenreName(id)
    res.send(genre_name)
})

app.get("/api/getGenresCnt/:id", async (req, res) => {
    const id = req.params.id
    const genre_cnt = await db.getGenresCnt(id)
    res.send(genre_cnt)
})

const port = process.env.PORT || 8800

app.listen(port, () => {
    console.log("Server started on port " + port)
})

app.get("/api/getRank/:id", async (req, res) => {
    const id = req.params.id
    const ranking = await db.getRank(id)
    res.send(ranking)
})

app.get("/api/getPopularity/:id", async (req, res) => {
    const id = req.params.id
    const popularity = await db.getPopularity(id)
    res.send(popularity)
})

app.get("/api/getMeanScore/:id", async (req, res) => {
    const id = req.params.id
    const meanScore = await db.getMeanScore(id)
    res.send(meanScore)
})

app.get("/api/getAnimeGenres/:id", async (req, res) => {
    const id = req.params.id
    const genres = await db.getAnimeGenres(id)
    res.send(genres)
})

app.get("/api/getScoreDistrubtion/:id", async (req, res) => {
    const id = req.params.id
    const score_distribution = await db.getScoreDistrubtion(id)
    res.send(score_distribution)
})

app.get("/api/getWatchStatus/:id", async (req, res) => {
    const id = req.params.id
    const watch_status = await db.getWatchStatus(id)
    res.send(watch_status)
})

app.get("/api/getReviews/:id", async (req, res) => {
    const id = req.params.id
    const reviews = await db.getReviews(id)
    res.send(reviews)
})
