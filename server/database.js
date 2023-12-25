import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()

const pool = mysql
    .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    })
    .promise()

export async function getAnimesCnt() {
    const result = await pool.query("SELECT count(*) as cnt FROM anime_dataset")
    return result[0]
}

export async function getWatchStatusCnt() {
    const result = await pool.query("SELECT count(*) as cnt FROM users_status")
    return result[0]
}

export async function getRatingCnt() {
    const result = await pool.query("SELECT count(*) as cnt FROM users_score")
    return result[0]
}

export async function getUserCnt() {
    const result = await pool.query("SELECT count(*) as cnt FROM users_details")
    return result[0]
}

export async function getReviewCnt() {
    const result = await pool.query("SELECT count(*) as cnt FROM review")
    return result[0]
}

export async function getAnimes() {
    const result = await pool.query("SELECT * FROM anime_dataset limit 10")
    return result[0]
}

export async function getAnime(id) {
    const result = await pool.query("SELECT * FROM anime_dataset WHERE anime_id = ?", [id])
    return result[0]
}

export async function getAnimeDetails(id) {
    const result = await pool.query("SELECT * FROM anime_details WHERE anime_id = ?", [id])
    return result[0]
}

export async function getGenres() {
    const result = await pool.query("SELECT * FROM genres")
    return result[0]
}

export async function getGenreName(id) {
    const result = await pool.query("SELECT Genre_name FROM genres WHERE Genre_id = ?", [id])
    return result[0]
}

export async function getGenresCnt(id) {
    if (id) {
        const result = await pool.query("SELECT count(anime_genres.anime_id) as cnt FROM anime_genres WHERE anime_genres.Genre_id = ?", [
            id,
        ])
        return result[0]
    } else {
        const result = await pool.query(
            "SELECT anime_genres.Genre_id, count(anime_genres.anime_id) as cnt FROM anime_genres GROUP BY anime_genres.Genre_id"
        )
        return result[0]
    }
}

export async function findUserByEmail(email) {
    const result = await pool.query("SELECT * FROM users_account WHERE users_account.user_email = ?", [email])
    return result[0][0]
}

export async function getProfile(id) {
    const result = await pool.query("SELECT * FROM users_details WHERE users_details.Mal_id = ?", [id])
    return result[0][0]
}

export async function getEmail(id) {
    const result = await pool.query("SELECT user_email FROM users_account WHERE users_account.user_id = ?", [id])
    return result[0][0]
}

export async function getRank(id) {
    const result = await pool.query(
        "SELECT ranking FROM (SELECT anime_id,RANK() OVER (ORDER BY weight_score DESC,mean_score DESC,members DESC,anime_id)AS ranking FROM anime_statistic )A WHERE A.anime_id = ?;",
        [id]
    )
    return result[0]
}

export async function getPopularity(id) {
    const result = await pool.query(
        "SELECT popularity,members FROM (SELECT anime_id,members,RANK() OVER (ORDER BY members DESC) popularity FROM anime_statistic)A WHERE anime_id = ?",
        [id]
    )
    return result[0]
}

export async function getMeanScore(id) {
    const result = await pool.query("SELECT mean_score,scored_by FROM anime_statistic WHERE anime_statistic.anime_id = ?", [id])
    return result[0]
}

export async function getAnimeGenres(id) {
    const result = await pool.query(
        "select genre_name, anime_genres.genre_id from genres,anime_dataset,anime_genres where anime_dataset.anime_id = ? and genres.Genre_id = anime_genres.Genre_id and anime_dataset.anime_id = anime_genres.anime_id",
        [id]
    )
    return result[0]
}

export async function getScoreDistrubtion(id) {
    const result = await pool.query(
        "SELECT rating as score,COUNT(*) as cnt FROM (SELECT anime_id,rating FROM users_score where anime_id = ?)A GROUP BY anime_id,rating ORDER BY rating",
        [id]
    )
    return result[0]
}

export async function getWatchStatus(id) {
    const result = await pool.query(
        "SELECT status_id as watch_status_id,COUNT(*) as cnt FROM (SELECT anime_id,status_id FROM users_status where anime_id = ?)A GROUP BY anime_id,status_id ORDER BY status_id",
        [id]
    )
    return result[0]
}

export async function getReviews(id) {
    const result = await pool.query(
        "SELECT Username as username,review,rating as score from users_details,(SELECT users_review.user_id, users_review.review, users_score.rating FROM users_review LEFT OUTER JOIN users_score ON users_review.user_id = users_score.user_id AND users_review.anime_id = users_score.anime_id WHERE users_review.anime_id = ?) C WHERE users_details.Mal_ID = C.user_id LIMIT 100",
        [id]
    )
    return result[0]
}

export async function getWeightScore(id) {
    const result = await pool.query("SELECT weight_score FROM anime_statistic WHERE anime_id = ?;", [id])
    return result[0]
}

export async function getTopAnime(id, type, st, ed) {
    const typeValues = type.split("+")
    if (typeValues != "Default") {
        if (id) {
            const result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,ranking,members_cnt,type,Premiered,user_score,user_status from (SELECT B.anime_id,score,weight_score,ranking,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,ranking,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY weight_score DESC,mean_score DESC,members DESC,anime_id) AS ranking FROM anime_statistic WHERE anime_id in(SELECT anime_id FROM anime_dataset WHERE type in (?))ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result LEFT OUTER JOIN anime_dataset on result.anime_id = anime_dataset.anime_id",
                [typeValues, ed - st + 1, parseInt(st - 1), id, id]
            )
            return result[0]
        } else {
            const result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,ranking,members_cnt,type,Premiered from (SELECT anime_statistic.anime_id,mean_score as score,members as members_cnt,RANK() OVER ( ORDER BY weight_score DESC,mean_score DESC,members DESC,anime_id) ranking FROM anime_statistic WHERE anime_id in(SELECT anime_id FROM anime_dataset WHERE type in (?)) ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER JOIN anime_dataset on choosen_id.anime_id = anime_dataset.anime_id",
                [typeValues, ed - st + 1, parseInt(st - 1)]
            )
            return result[0]
        }
    } else {
        if (id) {
            const result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,ranking,members_cnt,type,Premiered,user_score,user_status from (SELECT B.anime_id,score,weight_score,ranking,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,ranking,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY weight_score DESC,mean_score DESC,members DESC,anime_id) AS ranking FROM anime_statistic WHERE anime_id in(SELECT anime_id FROM anime_dataset)ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result LEFT OUTER JOIN anime_dataset on result.anime_id = anime_dataset.anime_id",
                [ed - st + 1, parseInt(st - 1), id, id]
            )
            return result[0]
        } else {
            const result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,ranking,members_cnt,type,Premiered from (SELECT anime_statistic.anime_id,mean_score as score,members as members_cnt,RANK() OVER ( ORDER BY weight_score DESC,mean_score DESC,members DESC,anime_id) ranking FROM anime_statistic WHERE anime_id in(SELECT anime_id FROM anime_dataset) ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER JOIN anime_dataset on choosen_id.anime_id = anime_dataset.anime_id",
                [ed - st + 1, parseInt(st - 1)]
            )
            return result[0]
        }
    }
}

export async function getAnimesByGenre(id, genre_id, type, st, ed) {
    if (id) {
        let result
        if (type == "Score") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis,user_score,user_status FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis,user_score,user_status FROM (SELECT B.anime_id,score,weight_score,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY weight_score DESC,members DESC,Premiered DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE anime_statistic.anime_id in(SELECT anime_id FROM anime_genres WHERE Genre_id = ?)ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result JOIN anime_details on result.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [genre_id, ed - st + 1, parseInt(st - 1), id, id]
            )
        } else if (type == "Members") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis,user_score,user_status FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis,user_score,user_status FROM (SELECT B.anime_id,score,weight_score,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY members DESC,weight_score DESC,Premiered DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE anime_statistic.anime_id in(SELECT anime_id FROM anime_genres WHERE Genre_id = ?)ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result JOIN anime_details on result.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [genre_id, ed - st + 1, parseInt(st - 1), id, id]
            )
        } else if (type == "Newest") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis,user_score,user_status FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis,user_score,user_status FROM (SELECT B.anime_id,score,weight_score,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY Premiered DESC,weight_score DESC,members DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE anime_statistic.anime_id in(SELECT anime_id FROM anime_genres WHERE Genre_id = ?)ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result JOIN anime_details on result.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [genre_id, ed - st + 1, parseInt(st - 1), id, id]
            )
        } else if (type == "Title") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis,user_score,user_status FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis,user_score,user_status FROM (SELECT B.anime_id,score,weight_score,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY Name,weight_score DESC,members DESC)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE anime_statistic.anime_id in(SELECT anime_id FROM anime_genres WHERE Genre_id = ?)ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result JOIN anime_details on result.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [genre_id, ed - st + 1, parseInt(st - 1), id, id]
            )
        }
        return result[0]
    } else {
        let result
        if (type == "Score") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY weight_score DESC,members DESC,Premiered DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE anime_statistic.anime_id in(SELECT anime_id FROM anime_genres WHERE Genre_id = ?)ORDER BY ranking limit ? OFFSET ?)choosen_id JOIN anime_details on choosen_id.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [genre_id, ed - st + 1, parseInt(st - 1)]
            )
        } else if (type == "Members") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY members DESC,weight_score DESC,Premiered DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE anime_statistic.anime_id in(SELECT anime_id FROM anime_genres WHERE Genre_id = ?)ORDER BY ranking limit ? OFFSET ?)choosen_id JOIN anime_details on choosen_id.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [genre_id, ed - st + 1, parseInt(st - 1)]
            )
        } else if (type == "Newest") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY Premiered DESC,weight_score DESC,members DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE anime_statistic.anime_id in(SELECT anime_id FROM anime_genres WHERE Genre_id = ?)ORDER BY ranking limit ? OFFSET ?)choosen_id JOIN anime_details on choosen_id.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [genre_id, ed - st + 1, parseInt(st - 1)]
            )
        } else if (type == "Title") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY Name,weight_score DESC,members DESC,Premiered DESC)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE anime_statistic.anime_id in(SELECT anime_id FROM anime_genres WHERE Genre_id = ?)ORDER BY ranking limit ? OFFSET ?)choosen_id JOIN anime_details on choosen_id.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [genre_id, ed - st + 1, parseInt(st - 1)]
            )
        }
        return result[0]
    }
}

export async function getAnimesByLetter(id, letter, type, st, ed) {
    letter = letter + "%"
    if (id) {
        let result
        if (type == "Score") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis,user_score,user_status FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis,user_score,user_status FROM (SELECT B.anime_id,score,weight_score,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY weight_score DESC,members DESC,Premiered DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE Name LIKE ? ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result JOIN anime_details on result.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [letter, ed - st + 1, parseInt(st - 1), id, id]
            )
        } else if (type == "Members") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis,user_score,user_status FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis,user_score,user_status FROM (SELECT B.anime_id,score,weight_score,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY members DESC,weight_score DESC,Premiered DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE Name LIKE ? ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result JOIN anime_details on result.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [letter, ed - st + 1, parseInt(st - 1), id, id]
            )
        } else if (type == "Newest") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis,user_score,user_status FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis,user_score,user_status FROM (SELECT B.anime_id,score,weight_score,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY Premiered DESC,weight_score DESC,members DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE Name LIKE ? ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result JOIN anime_details on result.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [letter, ed - st + 1, parseInt(st - 1), id, id]
            )
        } else if (type == "Title") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis,user_score,user_status FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis,user_score,user_status FROM (SELECT B.anime_id,score,weight_score,members_cnt,user_score,user_status FROM (SELECT choosen_id.anime_id,score,weight_score,members_cnt,user_score FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY Name,weight_score DESC,members DESC)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE Name LIKE ? ORDER BY ranking limit ? OFFSET ?)choosen_id LEFT OUTER join (SELECT anime_id,rating as user_score from users_score WHERE user_id = ?)A on A.anime_id = choosen_id.anime_id) B LEFT OUTER JOIN (SELECT anime_id,status_name as user_status from users_status,status WHERE user_id = ? and users_status.status_id = status.status_id)A on B.anime_id = A.anime_id) result JOIN anime_details on result.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [letter, ed - st + 1, parseInt(st - 1), id, id]
            )
        }
        return result[0]
    } else {
        let result
        if (type == "Score") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY weight_score DESC,members DESC,Premiered DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE Name LIKE ? ORDER BY ranking limit ? OFFSET ?)choosen_id JOIN anime_details on choosen_id.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [letter, ed - st + 1, parseInt(st - 1)]
            )
        } else if (type == "Members") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY members DESC,weight_score DESC,Premiered DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE Name LIKE ? ORDER BY ranking limit ? OFFSET ?)choosen_id JOIN anime_details on choosen_id.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [letter, ed - st + 1, parseInt(st - 1)]
            )
        } else if (type == "Newest") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY Premiered DESC,weight_score DESC,members DESC,Name)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE Name LIKE ? ORDER BY ranking limit ? OFFSET ?)choosen_id JOIN anime_details on choosen_id.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [letter, ed - st + 1, parseInt(st - 1)]
            )
        } else if (type == "Title") {
            result = await pool.query(
                "SELECT anime_dataset.anime_id,Name,Image_URL,score,weight_score,members_cnt,type,Premiered,Synopsis FROM (SELECT anime_details.anime_id,score,weight_score,members_cnt,Synopsis FROM (SELECT anime_statistic.anime_id,mean_score as score,weight_score,members as members_cnt,RANK() OVER (ORDER BY Name,weight_score DESC,members DESC,Premiered DESC)AS ranking FROM anime_statistic join anime_dataset on anime_statistic.anime_id = anime_dataset.anime_id WHERE Name LIKE ? ORDER BY ranking limit ? OFFSET ?)choosen_id JOIN anime_details on choosen_id.anime_id = anime_details.anime_id) final LEFT OUTER JOIN anime_dataset on final.anime_id = anime_dataset.anime_id",
                [letter, ed - st + 1, parseInt(st - 1)]
            )
        }
        return result[0]
    }
}
