import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../../features/common/headerSlice"
import axiosInstance from "../../app/axios"
import { useState } from "react"
import moment from "moment"
import TitleCard from "../../components/Cards/TitleCard"
import { Link } from "react-router-dom"
import TrashIcon from "@heroicons/react/24/outline/TrashIcon"
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon"
import { showNotification } from "../../features/common/headerSlice"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Filler, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import { Pie } from "react-chartjs-2"
import { openModal } from "../../features/common/modalSlice"
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement, Tooltip, Legend, Tooltip, Filler, Legend)

function BarChart({ dataset }) {
    let cntArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    dataset.forEach((item) => {
        if (item.score <= 0) return
        const index = item.score - 1
        cntArray[index] = item.cnt
    })

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    }

    const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

    const data = {
        labels,
        datasets: [
            {
                label: "Users",
                data: cntArray,
                backgroundColor: "grey",
            },
        ],
    }

    return (
        <TitleCard title={"Score Stats"}>
            <Bar options={options} data={data} />
        </TitleCard>
    )
}

function PieChart({ dataset, cnt }) {
    //console.log(dataset)
    let cntArray = [0, 0, 0, 0, 0]
    dataset.forEach((item) => {
        if (item.watch_status_id <= 0) return
        const index = item.watch_status_id === 6 ? 4 : item.watch_status_id - 1
        cntArray[index] = item.cnt
    })

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    }

    //console.log(dataset)
    const labels = ["Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"]

    const data = {
        labels,
        datasets: [
            {
                label: "users",
                data: cntArray,
                backgroundColor: [
                    "rgba(255, 99, 255, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 206, 255, 0.8)",
                    "rgba(75, 192, 255, 0.8)",
                    "rgba(153, 102, 255, 0.8)",
                ],
                borderColor: [
                    "rgba(255, 99, 255, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 255, 1)",
                    "rgba(75, 192, 255, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    }
    if (dataset.length > 0) {
        return (
            <TitleCard title={`Watch Status (${cnt})`}>
                <Pie options={options} data={data} />
            </TitleCard>
        )
    } else {
        return <TitleCard title={`Watch Status (${cnt})`}></TitleCard>
    }
}

function RatingPage({ token }) {
    const dispatch = useDispatch()
    const [Rating, setRating] = useState([])
    const [RatingPage, setRatingPage] = useState(1)
    const [totalRatingPages, setTotalRatingPages] = useState(1)
    const startIndexRating = (RatingPage - 1) * 20
    const endIndexRating = RatingPage * 20
    const itemsPerPage = 20
    useEffect(() => {
        getRating()
    }, [])

    const deleteRating = (anime_id) => async () => {
        try {
            const response = await axiosInstance.delete(
                `/api/removeRating`,
                { anime_id: anime_id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                }
            )
            dispatch(showNotification({ message: response.data.message, status: 1 }))
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }

    const getRating = async () => {
        try {
            const response = await axiosInstance.get("/api/getRating", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const ratingData = response.data
            setRating(ratingData)
            setRatingPage(1)
            setTotalRatingPages(Math.ceil(ratingData.length / itemsPerPage))
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }
    return (
        <TitleCard title="Rating" className="overflow-x-auto w-full">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Anime</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {Rating &&
                        Rating.slice(startIndexRating, endIndexRating).map((rating, index) => {
                            return (
                                <tr>
                                    <td>
                                        <img src={rating.Image_URL} alt={rating.title}></img>
                                    </td>
                                    <td>{rating.title}</td>
                                    <td>
                                        {rating.score} <TrashIcon className="w-8" onClick={deleteRating(rating.anime_id)} />{" "}
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <div className="flex justify-center btn-group">
                <button
                    className="btn"
                    onClick={() => {
                        if (RatingPage > 1) setRatingPage(RatingPage - 1)
                    }}
                    disabled={RatingPage === 1}
                >
                    prev
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        if (RatingPage < totalRatingPages) setRatingPage(RatingPage + 1)
                    }}
                    disabled={RatingPage === totalRatingPages}
                >
                    next
                </button>
            </div>
        </TitleCard>
    )
}

function WatchListPage({ token }) {
    const dispatch = useDispatch()
    const [WatchList, setWatchList] = useState([])
    const [WatchListPage, setWatchListPage] = useState(1)
    const [totalWatchListPages, setTotalWatchListPages] = useState(1)
    const startIndexWatchList = (WatchListPage - 1) * 10
    const endIndexWatchList = WatchListPage * 10
    const itemsPerPage = 10
    const getWatchList = async () => {
        try {
            const response = await axiosInstance.get("/api/getWatchList", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const watchListData = response.data
            setWatchList(watchListData)
            setWatchListPage(1)
            setTotalWatchListPages(Math.ceil(watchListData.length / itemsPerPage))
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }
    useEffect(() => {
        getWatchList()
    }, [])
    return (
        <TitleCard title="Watch List">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Anime</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {WatchList &&
                        WatchList.slice(startIndexWatchList, endIndexWatchList).map((watchlist, index) => {
                            return (
                                <tr>
                                    <td>
                                        <img src={watchlist.Image_URL} alt={watchlist.title}></img>
                                    </td>
                                    <td>{watchlist.title}</td>
                                    <td>{watchlist.status}</td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <div className="flex justify-center btn-group">
                <button
                    className="btn"
                    onClick={() => {
                        if (WatchListPage > 1) setWatchListPage(WatchListPage - 1)
                    }}
                    disabled={WatchListPage === 1}
                >
                    prev
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        if (WatchListPage < totalWatchListPages) setWatchListPage(WatchListPage + 1)
                    }}
                    disabled={WatchListPage === totalWatchListPages}
                >
                    next
                </button>
            </div>
        </TitleCard>
    )
}

function ReviewPage({ token }) {
    const dispatch = useDispatch()
    const [Review, setReview] = useState([])
    const [ReviewPage, setReviewPage] = useState(1)
    const [totalReviewPages, setTotalReviewPages] = useState(1)
    const startIndexReview = (ReviewPage - 1) * 10
    const endIndexReview = ReviewPage * 10
    const itemsPerPage = 10
    const getReview = async () => {
        try {
            const response = await axiosInstance.get("/api/getReview", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const reviewData = response.data
            setReview(reviewData)
            setReviewPage(1)
            setTotalReviewPages(Math.ceil(reviewData.length / itemsPerPage))
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }
    useEffect(() => {
        getReview()
    }, [])
    return (
        <TitleCard title="Review">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Anime</th>
                        <th>review</th>
                    </tr>
                </thead>
                <tbody>
                    {Review &&
                        Review.slice(startIndexReview, endIndexReview).map((review, index) => {
                            return (
                                <tr>
                                    <td>
                                        <img src={review.Image_URL} alt={review.title}></img>
                                    </td>
                                    <td>{review.title}</td>
                                    <td>{review.review}</td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <div className="flex justify-center btn-group">
                <button
                    className="btn"
                    onClick={() => {
                        if (ReviewPage > 1) setReviewPage(ReviewPage - 1)
                    }}
                    disabled={ReviewPage === 1}
                >
                    prev
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        if (ReviewPage < totalReviewPages) setReviewPage(ReviewPage + 1)
                    }}
                    disabled={ReviewPage === totalReviewPages}
                >
                    next
                </button>
            </div>
        </TitleCard>
    )
}

const RecommendList = ({ genre_id, token }) => {
    const [animes, setAnimes] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 2
    const [sortedBy, setSortedBy] = useState("Score")
    const display = "NotSeen"
    const getAnimes = async () => {
        try {
            const response = await axiosInstance.get(`/api/getAnimesByGenre/${genre_id}/${sortedBy}/1/10`, display, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const animeData = response.data
            console.log(animeData)
            setAnimes(animeData)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAnimes()
    }, [genre_id, sortedBy])

    const nextPage = () => {
        if (currentPage < Math.ceil(animes.length / itemsPerPage) - 1) {
            setCurrentPage((prevPage) => prevPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1)
        }
    }

    const switchSortBy = () => {
        if (sortedBy === "Score") {
            setSortedBy("Members")
        } else {
            setSortedBy("Score")
        }
    }

    const displayedAnimes = animes.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

    return (
        <>
            {displayedAnimes.length > 0 && (
                <div className="mt-5 w-full">
                    <div className="grid grid-cols-2">
                        {displayedAnimes.map((anime, index) => (
                            <div key={index} className="mx-2">
                                <div className="bg-base-100 rounded-xl h-80">
                                    <Link to={`../details/${anime.anime_id}`} className="flex flex-col items-center">
                                        <img src={anime.Image_URL} alt={anime.Name} className="my-5 rounded-xl h-48"></img>
                                        <div className="text-xl font-bold text-overflow text-center">
                                            {anime.Name} ({anime.type})
                                        </div>
                                        <div className="flex flex-col justify-center items-center">
                                            <div className="text-xl font-bold mx-2">
                                                ⭐{anime.score} 🧑‍💻{anime.members_cnt}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-5">
                        <button className="btn" onClick={switchSortBy}>
                            {sortedBy}
                        </button>
                        <div className="flex">
                            <button className="btn" onClick={prevPage} disabled={currentPage === 0}>
                                prev
                            </button>
                            <button
                                className="btn"
                                onClick={nextPage}
                                disabled={currentPage === Math.ceil(animes.length / itemsPerPage) - 1}
                            >
                                next
                            </button>
                        </div>
                        <button className="btn btn-primary">
                            <Link to={`../genre/${genre_id}`}>More</Link>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

const AnalysisPage = ({ token }) => {
    const dispatch = useDispatch()
    const [recommend, setRecommend] = useState([])
    const [genre_id, setGenre_id] = useState(0)

    const getRecommend = async () => {
        try {
            const response = await axiosInstance.get("/api/getRecommend", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const recommendData = response.data
            setRecommend(recommendData)
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }
    useEffect(() => {
        getRecommend()
    }, [])

    return (
        <div className="w-full ">
            <div className="bg-base-100 rounded-xl my-5 text-xl p-5 font-bold">Guess You Like</div>
            <div className="flex flex-wrap">
                {recommend &&
                    recommend.map((recommend, index) => {
                        return (
                            <div key={index} className="grow mx-2">
                                <button
                                    className="bg-base-100 text-center px-3 py-2 rounded-xl font-bold"
                                    onClick={() => setGenre_id(recommend.Genre_id)}
                                >
                                    {recommend.Genre_name}
                                </button>
                            </div>
                        )
                    })}
            </div>
            {genre_id ? (
                <RecommendList genre_id={genre_id} token={token} />
            ) : (
                <div class="flex mt-5 bg-base-100 rounded-xl items-center justify-center h-72">
                    <div class="flex items-center justify-center">
                        <p class="text-center leading-8">
                            This feature is based on all the anime shows where you have given a rating of over eight points. It calculates
                            the total number of categories among them and selects the top five favorite categories.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

function InternalPage() {
    const dispatch = useDispatch()
    const [profile, setProfile] = useState([])
    const [email, setEmail] = useState([])
    const token = localStorage.getItem("token")
    const [ratingCnt, setRatingCnt] = useState(0)
    const [reviewCnt, setReviewCnt] = useState(0)
    const [watchListCnt, setWatchListCnt] = useState(0)
    const [currentPage, setCurrentPage] = useState("overview")
    const [watchDistribution, setWatchDistribution] = useState([])
    const [ratingDistribution, setRatingDistribution] = useState([])
    if (!token) {
        dispatch(
            openModal({
                title: "You need to login",
                bodyType: MODAL_BODY_TYPES.REQUIRE_LOGIN,
            })
        )
    }

    const getProfile = async () => {
        try {
            const response = await axiosInstance.get("/api/getProfile", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const profileData = response.data
            profileData.Birthday = moment(profileData.Birthday).format("YYYY-MM-DD")
            setProfile(profileData)
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    localStorage.removeItem("token")
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }

    const getEmail = async () => {
        try {
            const response = await axiosInstance.get("/api/getEmail", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const emailData = response.data
            setEmail(emailData)
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }
    const getRatingCnt = async () => {
        try {
            const response = await axiosInstance.get("/api/getRatingCnt", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const ratingCntData = response.data[0]
            setRatingCnt(ratingCntData["cnt"])
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            }
        }
    }

    const getRatingDistribution = async () => {
        try {
            const response = await axiosInstance.get("/api/getRatingDistribution", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const ratingDistributionData = response.data
            console.log(ratingDistributionData)
            setRatingDistribution(ratingDistributionData)
        } catch (error) {
            console.log(error)
        }
    }

    const getWatchDistribution = async () => {
        try {
            const response = await axiosInstance.get("/api/getWatchListDistribution", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const watchDistributionData = response.data
            console.log(watchDistributionData)
            setWatchDistribution(watchDistributionData)
        } catch (error) {
            console.log(error)
        }
    }

    const getReviewCnt = async () => {
        try {
            const response = await axiosInstance.get("/api/getReviewCnt", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const reviewCntData = response.data[0]
            setReviewCnt(reviewCntData["cnt"])
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            }
        }
    }
    const getWatchListCnt = async () => {
        try {
            const response = await axiosInstance.get("/api/getWatchStatusCnt", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const watchListCntData = response.data[0]
            setWatchListCnt(watchListCntData["cnt"])
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            }
        }
    }

    useEffect(() => {
        getProfile()
        getEmail()
        getRatingCnt()
        getReviewCnt()
        getWatchDistribution()
        getWatchListCnt()
        getRatingDistribution()
    }, [])

    useEffect(() => {
        dispatch(setPageTitle({ title: "Profile Page" }))
    }, [])

    return (
        <>
            {token && (
                <div className="flex">
                    <div className="w-1/3 px-5 pt-5">
                        <TitleCard
                            title="Profile"
                            TopSideButtons={
                                <Link to="../settings-profile">
                                    <PencilSquareIcon className="w-6"></PencilSquareIcon>
                                </Link>
                            }
                        >
                            <div className="mb-2">Username : {profile.Username}</div>
                            <div className="mb-2">Email : {email.user_email}</div>
                            <div className="mb-2">Birthday : {profile.Birthday}</div>
                            <div className="">Gender : {profile.Gender}</div>
                        </TitleCard>
                        <div className="flex bg-base-100 shadow rounded-xl overflow-hidden mt-5">
                            <button
                                onClick={() => setCurrentPage("overview")}
                                className={`flex-1 p-2 font-bold ${currentPage === "overview" ? "bg-primary text-slate-50" : ""}`}
                            >
                                Overview
                            </button>
                        </div>
                        <div className="flex bg-base-100 shadow rounded-xl overflow-hidden mt-5">
                            <button
                                onClick={() => setCurrentPage("analysis")}
                                className={`flex-1 p-2 font-bold ${currentPage === "analysis" ? "bg-primary text-slate-50" : ""}`}
                            >
                                Recommendation
                            </button>
                        </div>
                        <div className="flex bg-base-100 shadow rounded-xl overflow-hidden mt-5">
                            <button
                                onClick={() => setCurrentPage("rating")}
                                className={`flex-1 p-2 font-bold ${currentPage === "rating" ? "bg-primary text-slate-50" : ""}`}
                            >
                                Rating
                            </button>
                            <button
                                onClick={() => setCurrentPage("watchList")}
                                className={`flex-1 p-2 font-bold  ${currentPage === "watchList" ? "bg-primary text-slate-50" : ""}`}
                            >
                                Watch List
                            </button>
                            <button
                                onClick={() => setCurrentPage("review")}
                                className={`flex-1 p-2 font-bold  ${currentPage === "review" ? "bg-primary text-slate-50" : ""}`}
                            >
                                Review
                            </button>
                        </div>
                    </div>
                    <div className="w-2/3 p-5">
                        {currentPage === "rating" ? <RatingPage token={token} /> : ""}
                        {currentPage === "watchList" ? <WatchListPage token={token} /> : ""}
                        {currentPage === "review" ? <ReviewPage token={token} /> : ""}
                        {currentPage === "analysis" ? <AnalysisPage token={token} /> : ""}
                        {currentPage === "overview" ? (
                            <div className="flex">
                                <div className="w-1/2">
                                    <PieChart cnt={watchListCnt} dataset={watchDistribution} />
                                </div>
                                <div className="w-1/2 pl-5">
                                    <BarChart dataset={ratingDistribution} />
                                    <div className="shadow rounded-xl bg-base-100 mt-5">
                                        <div className="p-5">Total ratings: {ratingCnt}</div>
                                    </div>
                                    <div className="shadow rounded-xl bg-base-100 mt-5">
                                        <div className="p-5">Total reviews: {reviewCnt}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default InternalPage
