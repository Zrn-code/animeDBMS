import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../../features/common/headerSlice"
import TitleCard from "../../components/Cards/TitleCard"
import { Link } from "react-router-dom"
import { openModal } from "../../features/common/modalSlice"
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil"
import axiosInstance from "../../app/axios"

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
    const [selectedFilters, setSelectedFilters] = useState([])
    //const [searchText, setSearchText] = useState('');
    const typeFilters = ["TV", "Movie", "OVA", "Special", "ONA", "Music", "Unknown"]

    const addOrRemoveFilter = (filter) => {
        const index = selectedFilters.indexOf(filter)
        let updatedFilters = [...selectedFilters]

        if (index === -1) {
            updatedFilters.push(filter)
        } else {
            updatedFilters.splice(index, 1)
        }

        setSelectedFilters(updatedFilters)
    }

    const applyFilters = () => {
        applyFilter(selectedFilters)
    }

    const removeAppliedFilter = () => {
        removeFilter()
        setSelectedFilters([])
        //setSearchText('');
    }

    return (
        <div className="inline-block float-right">
            {selectedFilters.length > 0 && (
                <button onClick={removeAppliedFilter} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">
                    {selectedFilters.join(", ")}
                    <span className="ml-2">×</span>
                </button>
            )}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                    Filter
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {typeFilters.map((filter, index) => (
                        <li key={index}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.includes(filter)}
                                    onChange={() => addOrRemoveFilter(filter)}
                                    className="mr-2"
                                />
                                {filter}
                            </label>
                        </li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    <li>
                        <button onClick={applyFilters}>Apply</button>
                    </li>
                </ul>
            </div>

            {/*
            <button onClick={handleApplySearch} className="btn btn-secondary ml-2">
                Apply Search
            </button>
            */}
        </div>
    )
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
                ⭐ <div className="mr-2 font-bold underline">{score ? score : "N/A"}</div>
            </div>
        </div>
    )
}

function InternalPage() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle({ title: "Top Anime Series" }))
    }, [])

    const [values, setValues] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [inputPage, setInputPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [year, setYear] = useState(2000)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem("token"))
    const itemsPerPage = 50
    const [display, setDisplay] = useState("Default")

    const fetchData = () => {
        const startItem = (currentPage - 1) * itemsPerPage + 1
        const endItem = currentPage * itemsPerPage

        axiosInstance
            .get("/api/getTopAnimeByYear/" + year + "/" + startItem + "/" + endItem, display, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            })
            .then((res) => {
                setValues(res.data)
                console.log(res.data)
                setLoading(false)
            })
            .catch((err) => {
                if (err.response.data === "Token expired" || err.response.data === "Token is invalid") {
                    localStorage
                        .removeItem("token")
                        .then(setToken(localStorage.getItem("token")))
                        .then(window.location.reload())
                }
            })
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    useEffect(() => {
        setLoading(true)
        fetchData()
    }, [currentPage, year, display])

    const handleYearChange = (event) => {
        const selectedYear = parseInt(event.target.value)
        setYear(selectedYear)
    }

    const handleDisplayChange = () => {
        if (display === "Default") {
            setDisplay("Seen")
        } else if (display === "Seen") {
            setDisplay("NotSeen")
        } else {
            setDisplay("Default")
        }
    }

    return (
        <>
            <div className="bg-base-100 rounded-xl py-4 px-5 mb-5">
                <div className="w-full flex justify-between text-xs ">
                    {[...Array(14)].map((_, index) => (
                        <span key={index}>{1960 + index * 5}</span>
                    ))}
                </div>
                <input type="range" min={1960} max={2025} value={year} className="range mt-2" step={1} onChange={handleYearChange} />
                <div className="w-full flex justify-between text-xs pl-2">
                    {[...Array(14)].map((_, index) => (
                        <span key={index}>|</span>
                    ))}
                </div>
            </div>
            <TitleCard
                title={
                    <div className="tooltip tooltip-right" data-tip="Order By: weight_score,mean_score, members,anime_id">
                        Top Animes in {year}
                    </div>
                }
                topMargin="mt-2"
                TopSideButtons={
                    <button className=" outline outline-1 text-base rounded-lg font-bold py-1 px-2 mx-2" onClick={handleDisplayChange}>
                        {display}
                    </button>
                }
            >
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Title</th>
                                    <th>Score</th>
                                    <th>Your Score</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {values &&
                                    values.map((l, k) => {
                                        return (
                                            <tr key={k}>
                                                <td>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="font-bold text-5xl">{l["ranking"] ? l["ranking"] : -1}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex">
                                                        <Link to={"../details/" + l.anime_id} className="flex">
                                                            <img className="flex h-24" src={l["Image_URL"]} alt="img" />
                                                        </Link>
                                                        <div className="flex mx-5 flex-col ">
                                                            <Link
                                                                to={"../details/" + l.anime_id}
                                                                className="flex text-ellipsis overflow-hidden"
                                                            >
                                                                <div
                                                                    className="font-bold text-lg hover:underline"
                                                                    style={{ whiteSpace: "normal" }}
                                                                >
                                                                    {l.Name}
                                                                </div>
                                                            </Link>
                                                            <div className="mt-2 font-extralight text-sm">
                                                                {l.type} ( {l.Premiered !== -1 ? l.Premiered : "n/a"} )
                                                            </div>
                                                            <div className="mt-2 font-extralight text-sm">
                                                                {l.members_cnt ? l.members_cnt : 0} Members
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="font-bold">⭐{l.score ? l.score : "NaN"}</div>
                                                </td>
                                                <td>
                                                    <RatingButtons
                                                        id={l["anime_id"]}
                                                        img={l["Image_URL"]}
                                                        name={l["Name"]}
                                                        score={l["user_score"]}
                                                    />
                                                </td>
                                                <td>
                                                    <WatchListButtons
                                                        id={l["anime_id"]}
                                                        name={l["Name"]}
                                                        img={l["Image_URL"]}
                                                        state={l["user_status"]}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </TitleCard>
            <div className="flex justify-center mt-4">
                <div className="btn-group">
                    <button className="btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        «
                    </button>

                    <button className="btn" onClick={() => setInputPage(currentPage)}>
                        Page {currentPage}
                    </button>

                    <button className="btn" onClick={() => handlePageChange(currentPage + 1)}>
                        »
                    </button>
                </div>
            </div>
        </>
    )
}

export default InternalPage
