import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../../features/common/headerSlice"
import { useParams } from "react-router-dom"
import TitleCard from "../../components/Cards/TitleCard"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Filler, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import axiosInstance from "../../app/axios"
import { Link } from "react-router-dom"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement, Tooltip, Legend, Tooltip, Filler, Legend)

function BarChart(dataset) {
    dataset = dataset["dataset"]
    //console.log(dataset)
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    }
    //console.log(dataset)
    const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

    const data = {
        labels,
        datasets: [
            {
                label: "Users",
                data: dataset.map((item) => item["cnt"]),
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

function PieChart(dataset) {
    dataset = dataset["dataset"]
    const cntArray = Array(5).fill(0)

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

    return (
        <TitleCard title={"Watch Status"}>
            <Pie options={options} data={data} />
        </TitleCard>
    )
}

function Stat({ figureSvg, title, value, desc, addHash }) {
    return (
        <div className="stat">
            <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    {figureSvg}
                </svg>
            </div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">
                {value === undefined ? (
                    <div className="flex justify-center items-center h-20 mt-10">
                        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
                    </div>
                ) : addHash ? (
                    `#${value}`
                ) : (
                    value
                )}
            </div>
            <div className="stat-desc">{desc}</div>
        </div>
    )
}

function Overview({ value, detail, id }) {
    const [Rank, setRank] = useState(-1)
    const [Popularity, setPopularity] = useState(-1)
    const [Score, setScore] = useState(-1)
    const [ScoredBy, setScoredBy] = useState(-1)
    const [Members, setMembers] = useState(-1)
    const [Genres, setGenres] = useState([])

    useEffect(() => {
        axiosInstance
            .get(`/api/getRank/${id}`)
            .then((res) => res.data)
            .then((data) => setRank(data[0]["ranking"]))
            .catch((error) => {
                console.error("Error fetching data:", error)
                setRank(-1)
            })
        axiosInstance
            .get(`/api/getPopularity/${id}`)
            .then((res) => res.data)
            .then((data) => {
                setPopularity(data[0]["popularity"])
                setMembers(data[0]["members"])
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setPopularity(-1)
                setMembers(-1)
            })
        axiosInstance
            .get(`/api/getMeanScore/${id}`)
            .then((res) => res.data)
            .then((data) => {
                setScore(data[0]["mean_score"])
                setScoredBy(data[0]["scored_by"])
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setScore(-1)
                setScoredBy(-1)
            })
        axiosInstance
            .get(`/api/getAnimeGenres/${id}`)
            .then((res) => res.data)
            .then((data) => setGenres(data))
            .catch((error) => {
                console.error("Error fetching data:", error)
                setGenres([])
            })
    }, [])

    return (
        <div className="container mx-auto">
            <div className="flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center">
                <div className="font-extrabold text-left text-2xl">{value.Name}</div>
                <div className="font-extrabold text-right text-l ml-2 tooltip tooltip-left" data-tip={detail["Aired"]}>
                    {value["Premiered"]}
                </div>
            </div>
            <div className="stats shadow h-36 w-full">
                <Stat
                    figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>}
                    title="Rank"
                    value={Rank}
                    desc="By weighted score"
                    addHash={true}
                />

                <Stat
                    figureSvg={
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        ></path>
                    }
                    title="Popularity"
                    value={Popularity}
                    desc="By members"
                    addHash={true}
                />

                <Stat
                    figureSvg={
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                        />
                    }
                    title="Members"
                    value={Members}
                    desc="numbers of interact users"
                />

                <Stat
                    figureSvg={
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                    }
                    title="Mean Score"
                    value={Score ? Score : 0}
                    desc={`Scored by ${ScoredBy} users`}
                />
            </div>
            <div className="bg-base-100 rounded-xl p-4 mt-5 font-extrabold ">{detail["Synopsis"]}</div>
            <div className="flex w-full mt-5">
                <div className="grow-0 bg-base-100 rounded-xl p-4 mx-2 font-extrabold">genres</div>
                {Genres &&
                    Genres.map((genre, idx) => (
                        <Link
                            to={"../genre/" + genre["genre_id"]}
                            key={idx}
                            className="grow bg-base-100 rounded-xl p-4 mx-2 font-extrabold text-center"
                        >
                            {genre["genre_name"]}
                        </Link>
                    ))}
            </div>
        </div>
    )
}

function Details({ value, detail, id }) {
    const [review, setReview] = useState([])
    const [reviewPage, setReviewPage] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosInstance
            .get(`/api/getReviews/${id}`)
            .then((res) => res.data)
            .then((data) => {
                setReview(data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setReview([])
                setLoading(false)
            })
    }, [id])

    function handleNext() {
        if (reviewPage === review.length) return
        setReviewPage(reviewPage + 1)
    }

    function handlePrevious() {
        if (reviewPage === 1) return
        setReviewPage(reviewPage - 1)
    }

    return (
        <div className="container mx-auto">
            <div className="flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center">
                <div className="font-extrabold text-left text-2xl">{value.Name}</div>
                <div className="font-extrabold text-right text-l ml-2 tooltip tooltip-left" data-tip={detail["Aired"]}>
                    {value["Premiered"]}
                </div>
            </div>
            <div className="flex w-full mt-5">
                <div className="grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip" data-tip="Rating">
                    {detail["Rating"]}
                </div>
                <div className="grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip" data-tip="Source">
                    {detail["Source"]}
                </div>
                <div className="grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip" data-tip={detail["Duration"]}>
                    {detail["Episodes"]} eps
                </div>
            </div>
            <div className="flex w-full mt-5">
                <div className="grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip" data-tip="Producers">
                    {detail["Producers"]}
                </div>
                <div className="grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip" data-tip="Licensors">
                    {detail["Licensors"]}
                </div>
                <div className="grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip" data-tip="Studios">
                    {detail["Studios"]}
                </div>
            </div>
            {review.length > 0 ? (
                <>
                    <div className="w-full h-56 overflow-y-auto mt-5 bg-base-100 rounded-xl p-5 shadow">
                        <div className="flex">
                            <div className="font-bold text-xl">{review[reviewPage - 1]["username"]}</div>
                            <div className="flex-grow"></div>
                            <div>{review[reviewPage - 1]["score"] ? review[reviewPage - 1]["score"] : "no score record"} </div>
                        </div>
                        <div className="divider my-0"></div>
                        {review[reviewPage - 1]["review"]}
                    </div>

                    <div className="btn-group grid grid-cols-2 mt-5">
                        <button className="btn btn-outline " onClick={handlePrevious}>
                            Previous
                        </button>
                        <button className="btn btn-outline" onClick={handleNext}>
                            Next
                        </button>
                    </div>
                </>
            ) : loading ? (
                <div className="flex justify-center items-center h-20 mt-10">
                    <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
                </div>
            ) : (
                <div className="rounded p-5 mt-5 bg-base-100 text-center font-bold"> No reviews found</div>
            )}
        </div>
    )
}

function Statistics({ value, detail, id }) {
    const [ScoreDistribution, setScoreDistribution] = useState([])
    const [WatchStatus, setWatchList] = useState([])
    const [meanScore, setMeanScore] = useState(0)
    const [ScoredBy, setScoredBy] = useState(0)

    useEffect(() => {
        axiosInstance
            .get(`/api/getMeanScore/${id}`)
            .then((res) => res.data)
            .then((data) => {
                setMeanScore(data[0]["mean_score"])
                setScoredBy(data[0]["scored_by"])
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setMeanScore(0)
                setScoredBy(0)
            })

        axiosInstance
            .get(`/api/getScoreDistrubtion/${id}`)
            .then((res) => res.data)
            .then((data) => setScoreDistribution(data))
            .catch((error) => {
                console.error("Error fetching data:", error)
                setScoreDistribution([])
            })
        axiosInstance
            .get(`/api/getWatchStatus/${id}`)
            .then((res) => res.data)
            .then((data) => setWatchList(data))
            .catch((error) => {
                console.error("Error fetching data:", error)
                setWatchList([])
            })
    }, [])

    return (
        <div className="container">
            <div className="flex bg-base-100 rounded-xl p-4 justify-between items-center">
                <div className="font-extrabold text-left text-2xl">{value.Name}</div>
                <div className="font-extrabold text-right text-l ml-2 tooltip tooltip-left" data-tip={detail["Aired"]}>
                    {value["Premiered"]}
                </div>
            </div>
            <div className="flex">
                <div className="mx-2">
                    {ScoreDistribution.length ? (
                        <BarChart dataset={ScoreDistribution} />
                    ) : (
                        <div className="rounded p-5 mt-5 bg-base-100 text-center font-bold"> No data found</div>
                    )}
                    <div className="flex mt-5 bg-base-100 rounded-xl p-4 justify-between items-center ">
                        <div className="text-left">Mean Score : {meanScore}</div>
                        <div className="divider divider-horizontal"></div>
                        <div className="text-right ml-2">Scored By : {ScoredBy}</div>
                    </div>
                </div>
                <div className="mx-2">
                    {WatchStatus.length ? (
                        <PieChart dataset={WatchStatus} />
                    ) : (
                        <div className="rounded p-5 mt-5 bg-base-100 text-center font-bold"> No data found</div>
                    )}
                </div>
            </div>
        </div>
    )
}

function InternalPage() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle({ title: "Details Page" }))
    }, [])

    const [currentPage, setCurrentPage] = useState("overview")
    const [detail, setDetail] = useState(null)
    const [value, setValue] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        axiosInstance
            .get(`/api/getAnimeDetails/${id}`)
            .then((res) => res.data)
            .then((data) => setDetail(data[0]))
        axiosInstance
            .get(`/api/getAnime/${id}`)
            .then((res) => res.data)
            .then((data) => setValue(data[0]))
    }, [])

    if (detail === null || value === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex justify-center items-center border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600"></div>
            </div>
        )
    }

    return (
        <>
            <div className="flex mt-5">
                {/* image and buttons */}
                <div className="min-w-max">
                    {/* Your existing buttons */}
                    <img className="max-h-90 rounded-xl" src={value["Image_URL"]} alt="img" />
                    <div className="flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center mt-4">
                        <div className="text-left font-bold">watch status</div>
                        <div className="text-right ml-2">Unknown</div>
                    </div>
                    <div className="flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center mt-4">
                        <div className="text-left font-bold ">your score</div>
                        <div className="text-right  ml-2">N/A ⭐</div>
                    </div>

                    <div className="flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center mt-4">
                        <div className="text-left font-bold ">your review</div>
                        <div className="text-right ml-2">N/A</div>
                    </div>

                    <div className="flex bg-base-100 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setCurrentPage("overview")}
                            className={`flex-1 p-2 font-bold ${currentPage === "overview" ? "bg-primary text-slate-50" : ""}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setCurrentPage("details")}
                            className={`flex-1 p-2 font-bold ${currentPage === "details" ? "bg-primary text-slate-50" : ""}`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setCurrentPage("statistics")}
                            className={`flex-1 p-2 font-bold  ${currentPage === "statistics" ? "bg-primary text-slate-50" : ""}`}
                        >
                            Statistics
                        </button>
                    </div>
                </div>
                <div className="divider divider-horizontal" />

                {/* Render components based on currentPage */}
                {currentPage === "overview" && <Overview value={value} detail={detail} id={id} />}
                {currentPage === "details" && <Details value={value} detail={detail} id={id} />}
                {currentPage === "statistics" && <Statistics value={value} detail={detail} id={id} />}
            </div>
        </>
    )
}

export default InternalPage
