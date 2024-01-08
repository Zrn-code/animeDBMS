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
    try {
        const user = await db.findUserByEmail(email)
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
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1w" })
        return res.status(200).json({ message: "login success", token: token })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "server failed" })
    }
})
app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body

    const ifEmailexist = await db.checkEmail(email)
    const ifUsernameExist = await db.checkUserName(name)

    if (ifEmailexist > 0) {
        return res.status(401).send("email exist")
    } else if (ifUsernameExist > 0) {
        return res.status(401).send("username exist")
    } else {
        const payload = {
            id: await db.createID(),
            email: email,
        }

        await db.insertNewUser(payload.id, name, password, email)

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" })
        return res.status(200).json({ message: "login success", token: token })
    }
})

app.get("/api/getRating", async (req, res) => {
    const token = req.headers.authorization
    const { anime_id } = req.body
    if (!token) return res.status(401).send("Token not found")

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Token expired")
            } else {
                return res.status(401).send("Token is invalid")
            }
        }
        const user_id = authData.id
        if (!anime_id || anime_id === undefined) {
            const inf = await db.getRating(user_id)
            res.send(inf)
        } else {
            const inf = await db.getRatingWithId(user_id, anime_id)
            res.send(inf)
        }
    })
})

app.get("/api/getRating/:id", async (req, res) => {
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
        const user_id = authData.id
        const anime_id = req.params.id

        const inf = await db.getRatingWithId(user_id, anime_id)
        res.send(inf)
    })
})

app.get("/api/getWatchList", async (req, res) => {
    const token = req.headers.authorization
    const { anime_id } = req.body
    if (!token) return res.status(401).send("Token not found")

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Token expired")
            } else {
                return res.status(401).send("Token is invalid")
            }
        }
        const user_id = authData.id
        if (!anime_id || anime_id === undefined) {
            const inf = await db.getWatchList(user_id)
            res.send(inf)
        } else {
            const inf = await db.getWatchListWithId(user_id, anime_id)
            res.send(inf)
        }
    })
})

app.get("/api/getWatchList/:id", async (req, res) => {
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
        const user_id = authData.id
        const anime_id = req.params.id
        const inf = await db.getWatchListWithId(user_id, anime_id)
        res.send(inf)
    })
})

app.get("/api/getReview", async (req, res) => {
    const token = req.headers.authorization
    const { anime_id } = req.body
    if (!token) return res.status(401).send("Token not found")

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Token expired")
            } else {
                return res.status(401).send("Token is invalid")
            }
        }
        const user_id = authData.id
        if (!anime_id || anime_id === undefined) {
            const inf = await db.getReview(user_id)
            res.send(inf)
        } else {
            const inf = await db.getReviewWithId(user_id, anime_id)
            res.send(inf)
        }
    })
})

app.get("/api/getReview/:id", async (req, res) => {
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
        const user_id = authData.id
        const anime_id = req.params.id
        const inf = await db.getReviewWithId(user_id, anime_id)
        res.send(inf)
    })
})

app.post("/api/addRating", async (req, res) => {
    const { anime_id, score } = req.body
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
        const user_id = authData.id

        const parsedScore = parseInt(score)

        if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 10) {
            await db.addRating(user_id, anime_id, parsedScore)
            return res.status(200).send("Add Rating Successfully")
        } else {
            return res.status(401).send("Wrong format")
        }
    })
})

app.put("/api/updateRating", async (req, res) => {
    const { anime_id, score } = req.body
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
        const user_id = authData.id

        const parsedScore = parseInt(score)

        if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 10) {
            await db.updateRating(user_id, anime_id, parsedScore)
            return res.status(200).send("Update Rating Successfully")
        } else {
            return res.status(401).send("Wrong format")
        }
    })
})

app.post("/api/addStatus", async (req, res) => {
    const { anime_id, status } = req.body
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
        const user_id = authData.id
        if (status == 1 || status == 2 || status == 3 || status == 4 || status == 6) {
            await db.addStatus(user_id, anime_id, status)
            return res.status(200).send("Add Status Successfully")
        } else {
            return res.status(401).send("wrong format")
        }
    })
})

app.put("/api/updateStatus", async (req, res) => {
    const { anime_id, status } = req.body
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
        const user_id = authData.id
        if (status == 1 || status == 2 || status == 3 || status == 4 || status == 6) {
            await db.updateStatus(user_id, anime_id, status)
            return res.status(200).send("Update Status Successfully")
        } else {
            return res.status(401).send("wrong format")
        }
    })
})

app.delete("/api/deleteReview", async (req, res) => {
    const token = req.headers.authorization
    const anime_id = req.headers.anime_id
    if (!token) return res.status(401).send("Token not found")

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Token expired")
            } else {
                return res.status(401).send("Token is invalid")
            }
        }
        const user_id = authData.id
        const ifreviewExist = await db.checkreview(user_id, anime_id)
        if (ifreviewExist > 0) {
            await db.removeReview(user_id, anime_id)
            return res.status(200).send("Deleted Successfully")
        } else {
            return res.status(401).send("review not found")
        }
    })
})

app.delete("/api/deleteRating", async (req, res) => {
    const token = req.headers.authorization
    const anime_id = req.headers.anime_id
    if (!token) return res.status(401).send("Token not found")

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Token expired")
            } else {
                return res.status(401).send("Token is invalid")
            }
        }
        const user_id = authData.id
        const ifratingExist = await db.checkrating(user_id, anime_id)
        if (ifratingExist > 0) {
            await db.removeRating(user_id, anime_id)
            return res.status(200).send("Deleted Successfully")
        } else {
            return res.status(401).send("rating not found")
        }
    })
})

app.delete("/api/deleteWatchStatus", async (req, res) => {
    const token = req.headers.authorization
    const anime_id = req.headers.anime_id
    if (!token) return res.status(401).send("Token not found")

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Token expired")
            } else {
                return res.status(401).send("Token is invalid")
            }
        }
        const user_id = authData.id
        const ifwatchStatusExist = await db.checkwatchStatus(user_id, anime_id)
        if (ifwatchStatusExist > 0) {
            await db.removeWatchStatus(user_id, anime_id)
            return res.status(200).send("Deleted Successfully")
        } else {
            return res.status(401).send("status not found")
        }
    })
})

app.get("/api/getProfile", async (req, res) => {
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
        res.send(email)
    })
})

app.get("/api/getAnimesCnt", async (req, res) => {
    const animes_cnt = await db.getAnimesCnt()
    res.send(animes_cnt)
})

app.get("/api/getWatchStatusCnt", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const watch_status_cnt = await db.getWatchStatusCnt()
        res.send(watch_status_cnt)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token expired")
                } else {
                    return res.status(401).send("Token is invalid")
                }
            }
            const id = authData.id
            const watch_status_cnt = await db.getWatchStatusCnt(id)
            res.send(watch_status_cnt)
        })
    }
})

app.get("/api/getRatingCnt", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const rating_cnt = await db.getRatingCnt()
        res.send(rating_cnt)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token expired")
                } else {
                    return res.status(401).send("Token is invalid")
                }
            }
            const id = authData.id
            const rating_cnt = await db.getRatingCnt(id)
            res.send(rating_cnt)
        })
    }
})

app.get("/api/getUserCnt", async (req, res) => {
    const user_cnt = await db.getUserCnt()
    res.send(user_cnt)
})

app.get("/api/getReviewCnt", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const review_cnt = await db.getReviewCnt()
        res.send(review_cnt)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") return res.status(401).send("Token expired")
                else return res.status(401).send("Token is invalid")
            }
            const id = authData.id
            const review_cnt = await db.getReviewCnt(id)
            res.send(review_cnt)
        })
    }
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

app.get("/api/getScoreDistribution/:id", async (req, res) => {
    const id = req.params.id
    const score_distribution = await db.getScoreDistribution(id)
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

app.get("/api/getWeightScore/:id", async (req, res) => {
    const id = req.params.id
    const weight_score = await db.getWeightScore(id)
    res.send(weight_score)
})

app.get("/api/getTopAnime/:type/:st/:ed", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const id = 0
        const type = req.params.type
        const st = req.params.st
        const ed = req.params.ed
        const display = 0
        const topAnime = await db.getTopAnime(id, type, st, ed, display)
        res.send(topAnime)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token expired")
                } else {
                    return res.status(401).send("Token is invalid")
                }
            }
            const id = authData.id
            const type = req.params.type
            const st = req.params.st
            const ed = req.params.ed
            const display = req.headers.display
            const topAnime = await db.getTopAnime(id, type, st, ed, display)
            res.send(topAnime)
        })
    }
})

app.get("/api/getAnimesByGenre/:genre/:type/:st/:ed", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const id = 0
        const genre = req.params.genre
        const type = req.params.type
        const st = req.params.st
        const ed = req.params.ed
        const display = 0
        const Anime = await db.getAnimesByGenre(id, genre, type, st, ed, display)
        res.send(Anime)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token expired")
                } else {
                    return res.status(401).send("Token is invalid")
                }
            }
            const display = req.headers.display
            const id = authData.id
            const genre = req.params.genre
            const type = req.params.type
            const st = req.params.st
            const ed = req.params.ed
            const Anime = await db.getAnimesByGenre(id, genre, type, st, ed, display)
            res.send(Anime)
        })
    }
})

app.get("/api/getAnimesByLetter/:letter/:type/:st/:ed", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const id = 0
        const letter = req.params.letter
        const type = req.params.type
        const st = req.params.st
        const ed = req.params.ed
        const display = 0
        const Anime = await db.getAnimesByLetter(id, letter, type, st, ed, display)
        res.send(Anime)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token expired")
                } else {
                    return res.status(401).send("Token is invalid")
                }
            }
            const display = req.headers.display
            const id = authData.id
            const letter = req.params.letter
            const type = req.params.type
            const st = req.params.st
            const ed = req.params.ed
            const Anime = await db.getAnimesByLetter(id, letter, type, st, ed, display)
            res.send(Anime)
        })
    }
})

app.get("/api/getRecommend", async (req, res) => {
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
        const recommend = await db.getRecommend(id)
        res.send(recommend)
    })
})

app.get("/api/getTopAnimeByGender/:gender/:st/:ed", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const id = 0
        const display = 0
        const gender = req.params.gender
        const st = req.params.st
        const ed = req.params.ed
        const Anime = await db.getTopAnimeByGender(id, gender, st, ed, display)
        res.send(Anime)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token expired")
                } else {
                    return res.status(401).send("Token is invalid")
                }
            }
            const display = req.headers.display
            const id = authData.id
            const gender = req.params.gender
            const st = req.params.st
            const ed = req.params.ed
            const Anime = await db.getTopAnimeByGender(id, gender, st, ed, display)
            res.send(Anime)
        })
    }
})

app.get("/api/getTopAnimeByYear/:year/:st/:ed", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const id = 0
        const display = 0
        const year = req.params.year
        const st = req.params.st
        const ed = req.params.ed
        const Anime = await db.getTopAnimeByYear(id, year, st, ed, display)
        res.send(Anime)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token expired")
                } else {
                    return res.status(401).send("Token is invalid")
                }
            }
            const display = req.headers.display
            const id = authData.id
            const year = req.params.year
            const st = req.params.st
            const ed = req.params.ed
            const Anime = await db.getTopAnimeByYear(id, year, st, ed, display)
            res.send(Anime)
        })
    }
})

app.get("/api/searchAnime/:keyword/:st/:ed", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const id = 0
        const keyword = req.params.keyword
        const st = req.params.st
        const ed = req.params.ed
        const Anime = await db.searchAnime(id, keyword, st, ed)
        res.send(Anime)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token expired")
                } else {
                    return res.status(401).send("Token is invalid")
                }
            }
            const display = req.headers.display
            const id = authData.id
            const keyword = req.params.keyword
            const st = req.params.st
            const ed = req.params.ed
            const Anime = await db.searchAnime(id, keyword, st, ed, display)
            res.send(Anime)
        })
    }
})

app.get("/api/getAnimesCnt/:type/:param", async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
        const display = 0
        const id = 0
        const type = req.params.type
        const param = req.params.param
        const cnt = await db.getAnimesCntWithCondition(id, type, param, display)
        res.send(cnt)
    } else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send("Token expired")
                } else {
                    return res.status(401).send("Token is invalid")
                }
            }
            const display = req.headers.display
            const type = req.params.type
            const param = req.params.param
            const id = authData.id
            const cnt = await db.getAnimesCntWithCondition(id, type, param, display)
            res.send(cnt)
        })
    }
})

app.post("/api/addReview", async (req, res) => {
    const { anime_id, review } = req.body
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
        const user_id = authData.id

        if ((await db.checkIfUserreviewExist(user_id, anime_id)) > 0) {
            return res.status(401).send("wrong format(the user's review almost exist)")
        }

        await db.addReview(user_id, anime_id, review)
        return res.status(200).send("Add Review Successfully")
    })
})

app.put("/api/updateReview", async (req, res) => {
    const { anime_id, review } = req.body
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
        const user_id = authData.id

        if ((await db.checkIfUserreviewExist(user_id, anime_id)) > 0) {
            await db.updateReview(user_id, anime_id, review)
            return res.status(200).send("Update Review Successfully")
        } else {
            return res.status(401).send("wrong format")
        }
    })
})

app.post("/api/updateProfile", async (req, res) => {
    const { gender, birthday } = req.body
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
        const user_id = authData.id

        let year = parseInt(birthday.substring(0, 5))
        if (!(gender == "Female" || gender == "Male") || !(year >= 1000 && year <= 9999)) {
            return res.status(401).send("Wrong format")
        } else {
            await db.updateProfile(user_id, gender, birthday)
            return res.status(200).send("Update Successfully")
        }
    })
})

app.get("/api/getWatchListDistribution", async (req, res) => {
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
        const WatchList_distribution = await db.getWatchListDistribution(id)
        res.send(WatchList_distribution)
    })
})

app.get("/api/getRatingDistribution", async (req, res) => {
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
        const rating_distribution = await db.getRatingDistribution(id)
        res.send(rating_distribution)
    })
})

app.put("/api/updatePassword", async (req, res) => {
    const { old_password, new_password } = req.body
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
        const OldPassword = await db.getPassword(id)
        if (OldPassword == old_password) {
            if (new_password.length >= 6 && new_password.length <= 20) {
                await db.updatePassword(id, new_password)
                return res.status(200).send("Update Password Successfully")
            } else {
                return res.status(401).send("Wrong format")
            }
        } else {
            return res.status(401).send("Old password not correct")
        }
    })
})
