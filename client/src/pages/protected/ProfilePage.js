import { useDebugValue, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPageTitle, setRefetch } from "../../features/common/headerSlice"
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

const RatingButtons = ({ id, name, img, score }) => {
    const dispatch = useDispatch()
    const token = localStorage.getItem("token")
    const openAddRatingModal = () => {
        if (!token) {
            dispatch(
                openModal({
                    title: "You need to login",
                    bodyType: MODAL_BODY_TYPES.REQUIRE_LOGIN,
                })
            )
        } else {
            dispatch(
                openModal({
                    title: "Update Rating Score",
                    bodyType: MODAL_BODY_TYPES.RATING_ADD_NEW,
                    extraObject: { id: id, name: name, img: img, score: score },
                })
            )
        }
    }

    return (
        <div className="inline-block cursor-pointer" onClick={openAddRatingModal}>
            <div className="flex items-center">
                ⭐ <div className="mr-2 font-bold">{score ? score : "N/A"}</div>
            </div>
        </div>
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
const WatchListButtons = ({ id, name, img, state }) => {
    const dispatch = useDispatch()
    const token = localStorage.getItem("token")

    const openAddWatchListModal = () => {
        if (!token) {
            dispatch(
                openModal({
                    title: "You need to login",
                    bodyType: MODAL_BODY_TYPES.REQUIRE_LOGIN,
                })
            )
        } else {
            dispatch(
                openModal({
                    title: "Update Watch Status",
                    bodyType: MODAL_BODY_TYPES.WATCHLIST_ADD_NEW,
                    extraObject: { id: id, name: name, img: img, state: state },
                })
            )
        }
    }

    return (
        <div className="inline-block ">
            <button className="btn btn-sm normal-case btn-primary" onClick={() => openAddWatchListModal()}>
                {state ? state : "Add to Watch List"}
            </button>
        </div>
    )
}

function RatingPage({ token }) {
    const dispatch = useDispatch()
    const [Loading, setLoading] = useState(true)
    const [Rating, setRating] = useState([])
    const [RatingPage, setRatingPage] = useState(1)
    const [totalRatingPages, setTotalRatingPages] = useState(1)
    const startIndexRating = (RatingPage - 1) * 5
    const endIndexRating = RatingPage * 5
    const itemsPerPage = 5
    const refetch = useSelector((state) => state.header.refetch)
    useEffect(() => {
        getRating()
    }, [])

    useEffect(() => {
        if (refetch) {
            getRating()
            dispatch(setRefetch(false))
        }
    }, [refetch])

    const deleteRating = (anime_id) => async () => {
        try {
            //console.log(anime_id)
            const response = await axiosInstance.delete(`/api/deleteRating`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                    anime_id: anime_id,
                },
            })
            dispatch(showNotification({ message: response.data.message, status: 1 }))
            getRating()
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
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
            setLoading(false)
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

    if (Loading)
        return (
            <div className="flex justify-center items-center h-full">
                <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
            </div>
        )
    return (
        <TitleCard title="Rating List" className="overflow-x-auto w-full">
            {Rating.length > 0 ? (
                <>
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
                                        <tr key={index}>
                                            <td>
                                                <Link to={"../details/" + rating.anime_id}>
                                                    <img className="h-16 " src={rating.Image_URL} alt={rating.name}></img>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    to={"../details/" + rating.anime_id}
                                                    style={{ whiteSpace: "normal" }}
                                                    className="text-wrap text-lg font-bold"
                                                >
                                                    {rating.name}
                                                </Link>
                                            </td>
                                            <td>
                                                <div className="flex font-bold">
                                                    <RatingButtons
                                                        id={rating.anime_id}
                                                        name={rating.name}
                                                        img={rating.Image_URL}
                                                        score={rating.rating}
                                                    />
                                                    <TrashIcon
                                                        className="ml-2 w-4 cursor-pointer"
                                                        onClick={deleteRating(rating.anime_id)}
                                                    />{" "}
                                                </div>
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
                </>
            ) : (
                <div className="flex justify-center">no rating found</div>
            )}
        </TitleCard>
    )
}

function WatchListPage({ token }) {
    const dispatch = useDispatch()
    const [WatchList, setWatchList] = useState([])
    const [Loading, setLoading] = useState(true)
    const [WatchListPage, setWatchListPage] = useState(1)
    const [totalWatchListPages, setTotalWatchListPages] = useState(1)
    const startIndexWatchList = (WatchListPage - 1) * 5
    const endIndexWatchList = WatchListPage * 5
    const itemsPerPage = 5
    const refetch = useSelector((state) => state.header.refetch)
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
            setLoading(false)
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

    const deleteWatchList = (anime_id) => async () => {
        try {
            //console.log(anime_id)
            const response = await axiosInstance.delete(`/api/deleteWatchStatus`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                    anime_id: anime_id,
                },
            })
            dispatch(showNotification({ message: response.data.message, status: 1 }))
            getWatchList()
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
    useEffect(() => {
        if (refetch) {
            getWatchList()
            dispatch(setRefetch(false))
        }
    }, [refetch])

    if (Loading)
        return (
            <div className="flex justify-center items-center h-full">
                <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
            </div>
        )

    return (
        <TitleCard title="WatchList" className="overflow-x-auto w-full">
            {WatchList.length > 0 ? (
                <>
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
                                WatchList.slice(startIndexWatchList, endIndexWatchList).map((rating, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <Link to={"../details/" + rating.anime_id}>
                                                    <img className="h-16 " src={rating.Image_URL} alt={rating.name}></img>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    to={"../details/" + rating.anime_id}
                                                    style={{ whiteSpace: "normal" }}
                                                    className="text-wrap text-lg font-bold"
                                                >
                                                    {rating.name}
                                                </Link>
                                            </td>
                                            <td>
                                                <div className="flex font-bold  justify-end">
                                                    <WatchListButtons
                                                        id={rating.anime_id}
                                                        name={rating.name}
                                                        img={rating.Image_URL}
                                                        state={rating.status}
                                                    />
                                                    <TrashIcon
                                                        className="ml-2 w-4 cursor-pointer float-right"
                                                        onClick={deleteWatchList(rating.anime_id)}
                                                    />{" "}
                                                </div>
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
                </>
            ) : (
                <div className="flex justify-center">no watch list found</div>
            )}
        </TitleCard>
    )
}

const ReviewButtons = ({ id, name, img, review }) => {
    const dispatch = useDispatch()
    const token = localStorage.getItem("token")
    const openAddReviewModal = () => {
        if (!token) {
            dispatch(
                openModal({
                    title: "You need to login",
                    bodyType: MODAL_BODY_TYPES.REQUIRE_LOGIN,
                })
            )
        } else {
            dispatch(
                openModal({
                    title: "Update Review",
                    bodyType: MODAL_BODY_TYPES.REVIEW_ADD_NEW,
                    extraObject: { id: id, name: name, img: img, review: review },
                })
            )
        }
    }

    return (
        <div className="flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center mt-4" onClick={openAddReviewModal}>
            <button className="text-right ml-2 font-bold ">{review ? "show" : "N/A"}</button>
        </div>
    )
}
function ReviewPage({ token }) {
    const dispatch = useDispatch()
    const [Review, setReview] = useState([])
    const [Loading, setLoading] = useState(true)
    const [ReviewPage, setReviewPage] = useState(1)
    const [totalReviewPages, setTotalReviewPages] = useState(1)
    const startIndexReview = (ReviewPage - 1) * 5
    const endIndexReview = ReviewPage * 5
    const itemsPerPage = 5
    const refetch = useSelector((state) => state.header.refetch)
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
            setLoading(false)
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

    useEffect(() => {
        if (refetch) {
            getReview()
            dispatch(setRefetch(false))
        }
    }, [refetch])

    const deleteReview = (anime_id) => async () => {
        try {
            //console.log(anime_id)
            const response = await axiosInstance.delete(`/api/deleteReview`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                    anime_id: anime_id,
                },
            })
            dispatch(showNotification({ message: response.data.message, status: 1 }))
            getReview()
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
    if (Loading)
        return (
            <div className="flex justify-center items-center h-full">
                <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
            </div>
        )
    return (
        <TitleCard title="Review" className="overflow-x-auto w-full">
            {Review.length > 0 ? (
                <>
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Anime</th>
                                <th>Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Review &&
                                Review.slice(startIndexReview, endIndexReview).map((rating, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <Link to={"../details/" + rating.anime_id}>
                                                    <img className="h-16 " src={rating.Image_URL} alt={rating.name}></img>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    to={"../details/" + rating.anime_id}
                                                    style={{ whiteSpace: "normal" }}
                                                    className="text-wrap text-lg font-bold"
                                                >
                                                    {rating.name}
                                                </Link>
                                            </td>
                                            <td>
                                                <div className="flex font-bold float-right">
                                                    <ReviewButtons
                                                        id={rating.anime_id}
                                                        name={rating.name}
                                                        img={rating.Image_URL}
                                                        review={rating.review}
                                                    />
                                                    <TrashIcon
                                                        className="ml-2 w-4 cursor-pointer"
                                                        onClick={deleteReview(rating.anime_id)}
                                                    />{" "}
                                                </div>
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
                </>
            ) : (
                <div className="flex justify-center">no review found</div>
            )}
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
            const response = await axiosInstance.get(`/api/getAnimesByGenre/${genre_id}/${sortedBy}/1/10`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                    display: display,
                },
            })
            const animeData = response.data
            //console.log(animeData)
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

                    <div className="flex justify-between mt-5 ">
                        <button className="btn" onClick={switchSortBy}>
                            {sortedBy}
                        </button>
                        <div className="flex btn-group">
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
            <div className="bg-base-100 rounded-xl my-5 text-xl p-5 font-bold">Guess What You Like</div>
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
                <div className="flex mt-5 bg-base-100 rounded-xl items-center justify-center h-72">
                    <div className="flex items-center justify-center">
                        <p className="text-center leading-8">
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
            //console.log(ratingDistributionData)
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
            //console.log(watchDistributionData)
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
                            <div className="flex font-bold mb-2 justify-between">
                                <div>Username :</div>
                                <div>{profile.Username}</div>
                            </div>
                            <div className="flex font-bold mb-2 justify-between">
                                <div>Email :</div>
                                <div>{email.user_email}</div>
                            </div>{" "}
                            <div className="flex font-bold mb-2 justify-between">
                                <div>Birthday :</div>
                                <div>{profile.Birthday}</div>
                            </div>
                            <div className="flex font-bold  justify-between">
                                <div>Gender :</div>
                                <div>{profile.Gender}</div>
                            </div>
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
                                        <div className="flex p-5 font-bold justify-between">
                                            <div className="">Total ratings:</div>
                                            <div className="mr-2">{ratingCnt}</div>
                                        </div>
                                    </div>
                                    <div className="shadow rounded-xl bg-base-100 mt-5">
                                        <div className="flex p-5 font-bold justify-between">
                                            <div className="">Total Reviews:</div>
                                            <div className="mr-2">{reviewCnt}</div>
                                        </div>
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
