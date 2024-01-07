import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPageTitle } from "../../features/common/headerSlice"
import TitleCard from "../../components/Cards/TitleCard"
import { Link } from "react-router-dom"
import { openModal } from "../../features/common/modalSlice"
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil"
import axiosInstance from "../../app/axios"
import { setRefetch } from "../../features/common/headerSlice"

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
    const refetch = useSelector((state) => state.header.refetch)
    useEffect(() => {
        dispatch(setPageTitle({ title: "Popular By Gender" }))
    }, [])

    const [values, setValues] = useState([])
    const [params, setParams] = useState("Male")
    const [currentPage, setCurrentPage] = useState(1)
    const [inputPage, setInputPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [display, setDisplay] = useState("Default")
    const [token, setToken] = useState(localStorage.getItem("token"))
    const itemsPerPage = 50
    useEffect(() => {
        if (refetch) {
            fetchData()
            dispatch(setRefetch(false))
        }
    }, [refetch])
    const fetchData = () => {
        const startItem = (currentPage - 1) * itemsPerPage + 1
        const endItem = currentPage * itemsPerPage

        axiosInstance
            .get("/api/getTopAnimeByGender/" + params + "/" + startItem + "/" + endItem, display, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            })
            .then((res) => {
                setValues(res.data)
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
    }, [currentPage, params, display])

    const removeFilter = () => {
        setParams("Default")
    }

    const applyFilter = async (params) => {
        const paramsString = params.join("+")
        setParams(paramsString)
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

    const handleGenderChange = () => {
        if (params === "Male") {
            setParams("Female")
        } else {
            setParams("Male")
        }
    }
    return (
        <>
            <TitleCard
                title={
                    <div className="tooltip tooltip-right" data-tip="Order By: member, weighted_score, name">
                        {params + " Popular"}
                    </div>
                }
                topMargin="mt-2"
                TopSideButtons={
                    <>
                        <button className="outline outline-1 text-base  rounded-lg font-bold py-1 px-2 mx-2" onClick={handleDisplayChange}>
                            {display}
                        </button>
                        <button className="outline outline-1 text-base  rounded-lg font-bold py-1 px-2 mx-2" onClick={handleGenderChange}>
                            {params}
                        </button>
                    </>
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
                                                                {params === "Male" ? l["Male_cnt"] : l["Female_cnt"]}
                                                                {" " + params + " "} Members
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
