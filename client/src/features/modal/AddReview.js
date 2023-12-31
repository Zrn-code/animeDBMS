import { useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification } from "../common/headerSlice"
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

    const saveWatchList = () => {
        setLoading(true)
        // Call API to save watch list
        // If success, dispatch notification
        // If fail, show error message
        dispatch(showNotification({ message: "Review", status: 1 }))

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
                            className="textarea w-full h-24 textarea-bordered"
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
