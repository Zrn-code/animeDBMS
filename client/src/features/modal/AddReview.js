import { useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification, setRefetch } from "../common/headerSlice"
import axiosInstance from "../../app/axios"

const INITIAL_REVIEW = {
    id: "",
    name: "",
    img: "",
    review: "",
}

function AddReviewModalBody({ closeModal, extraObject }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [Review, setReview] = useState(extraObject || INITIAL_REVIEW)
    const token = localStorage.getItem("token")
    const saveWatchList = () => {
        setLoading(true)
        const requestBody = {
            anime_id: Review["id"],
            review: Review["review"],
        }
        axiosInstance
            .get(`/api/getReview/${Review["id"]}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            .then((res) => res.data)
            .then((data) => {
                if (data.length > 0) {
                    axiosInstance
                        .put("/api/updateReview", requestBody, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `${token}`,
                            },
                        })
                        .then((response) => {
                            console.log(response)
                            dispatch(showNotification({ message: "Review Updated", status: 1 }))
                            dispatch(setRefetch(true))
                            setLoading(false)
                            closeModal()
                        })
                } else {
                    axiosInstance
                        .post("/api/addReview", requestBody, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `${token}`,
                            },
                        })
                        .then((response) => {
                            console.log(response)
                            dispatch(showNotification({ message: "Review Added", status: 1 }))
                            dispatch(setRefetch(true))
                            setLoading(false)
                            closeModal()
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
                    <img className="flex-1" src={Review["img"]} alt={Review["name"] + "imgURL"}></img>
                    <div className="ml-5 flex-1">
                        <div className="divider font-bold mt-5">Review</div>

                        <textarea
                            className="textarea w-full h-48 textarea-bordered"
                            placeholder="You can write review here..."
                            value={Review["review"]}
                            onChange={(e) => setReview({ ...Review, review: e.target.value })}
                        ></textarea>
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

export default AddReviewModalBody
