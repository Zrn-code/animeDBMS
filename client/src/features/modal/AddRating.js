import { useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification, setRefetch } from "../common/headerSlice"
import axiosInstance from "../../app/axios"

const INITIAL_RATING = {
    id: "",
    name: "",
    img: "",
    score: "",
}

const ratingOptions = [
    { value: 10, label: "10 - Masterpiece" },
    { value: 9, label: "9 - Great" },
    { value: 8, label: "8 - Very Good" },
    { value: 7, label: "7 - Good" },
    { value: 6, label: "6 - Fine" },
    { value: 5, label: "5 - Average" },
    { value: 4, label: "4 - Bad" },
    { value: 3, label: "3 - Very Bad" },
    { value: 2, label: "2 - Horrible" },
    { value: 1, label: "1 - Appalling" },
]

function AddRatingModalBody({ closeModal, extraObject }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [Rating, setRating] = useState(extraObject || INITIAL_RATING)
    const token = localStorage.getItem("token")
    const saveWatchList = () => {
        if (Rating["score"] === "") {
            console.log("no rating selected")
            return
        }
        const requestBody = {
            anime_id: Rating["id"],
            score: Rating["score"],
        }
        console.log(requestBody)
        axiosInstance
            .get(`/api/getRating/${Rating["id"]}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            .then((res) => res.data)
            .then((data) => {
                if (data.length > 0) {
                    axiosInstance
                        .put("/api/updateRating", requestBody, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `${token}`,
                            },
                        })
                        .then((response) => {
                            console.log(response)
                            dispatch(setRefetch(true))
                            dispatch(showNotification({ message: "Watch List Saved", status: 1 }))
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                } else {
                    axiosInstance
                        .post("/api/addRating", requestBody, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `${token}`,
                            },
                        })
                        .then((response) => {
                            console.log(response)
                            dispatch(setRefetch(true))
                            dispatch(showNotification({ message: "Watch List Saved", status: 1 }))
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            })
            .catch((error) => {
                console.log(error)
            })

        closeModal()
    }

    return (
        <>
            <div className="modal-body mt-5">
                <div className="flex">
                    <img className="flex-1" src={Rating["img"]} alt={Rating["name"] + "imgURL"}></img>
                    <div className="ml-5 flex-1">
                        <div className="text-2xl font-bold mb-5">{Rating["name"]}</div>
                        <div className="divider font-bold">Rating</div>
                        <select
                            className="select w-full max-w-xs select-bordered"
                            value={Rating["score"]}
                            onChange={(e) => setRating({ ...Rating, score: e.target.value })}
                        >
                            {ratingOptions.map((state) => {
                                return (
                                    <option key={state.value} value={state.value}>
                                        {state.label}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={() => closeModal()}>
                        Cancel
                    </button>
                    <button className="btn btn-primary px-6" onClick={() => saveWatchList()}>
                        Save
                    </button>
                </div>
            </div>
        </>
    )
}

export default AddRatingModalBody
