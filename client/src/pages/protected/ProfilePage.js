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

function BarChart() {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    }

    const labels = ["1", "2", "3", "4", "5"]

    const data = {
        labels,
        datasets: [
            {
                label: "Users",
                data: labels.map(() => {
                    return Math.random() * 1000 + 500
                }),
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

function PieChart() {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    }

    const labels = ["Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"]

    const data = {
        labels,
        datasets: [
            {
                label: "users",
                data: [122, 219, 30, 51, 82],
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

    return (
        <TitleCard title={"Watch Status"}>
            <Pie options={options} data={data} />
        </TitleCard>
    )
}

function InternalPage() {
    const dispatch = useDispatch()
    const [profile, setProfile] = useState([])
    const [email, setEmail] = useState([])
    const [WatchList, setWatchList] = useState([])
    const [Rating, setRating] = useState([])
    const token = localStorage.getItem("token")
    const [WatchListPage, setWatchListPage] = useState(1)
    const [totalWatchListPages, setTotalWatchListPages] = useState(1)
    const [RatingPage, setRatingPage] = useState(1)
    const [totalRatingPages, setTotalRatingPages] = useState(1)
    const startIndexWatchList = (WatchListPage - 1) * 10
    const endIndexWatchList = WatchListPage * 10
    const startIndexRating = (RatingPage - 1) * 10
    const endIndexRating = RatingPage * 10
    const itemsPerPage = 10

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
                    localStorage.removeItem("token")
                    window.location.href = "/app/welcome"
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
                    window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }

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
                    window.location.href = "/app/welcome"
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
                    window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }

    useEffect(() => {
        getProfile()
        getEmail()
        getWatchList()
        getRating()
    }, [])

    useEffect(() => {
        dispatch(setPageTitle({ title: "Profile Page" }))
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
                    window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }

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
                        <TitleCard title="Statics">
                            <div className="mb-2">Watching : {profile.Watching}</div>
                            <div className="mb-2">Completed : {profile.Completed}</div>
                            <div className="mb-2">On Hold : {profile.OnHold}</div>
                            <div className="mb-2">Dropped : {profile.Dropped}</div>
                            <div className="mb-2">Plan to Watch : {profile.PlanToWatch}</div>
                            <div className="mb-2">Rated : {profile.rated}</div>
                        </TitleCard>
                    </div>

                    <div className="w-1/3 p-5">
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
                        <BarChart />
                    </div>
                    <div className="w-1/3 p-5">
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
                        <PieChart />
                    </div>
                </div>
            )}
        </>
    )
}

export default InternalPage
