import { useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification } from "../common/headerSlice"

const INITIAL_WATCH_STATE = {
    id: "",
    name: "",
    img: "",
    state: "",
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
    const [Rating, setRating] = useState(extraObject || INITIAL_WATCH_STATE)
    const [showReview, setShowReview] = useState(false)

    const saveWatchList = () => {
        setLoading(true)
        // Call API to save watch list
        // If success, dispatch notification
        // If fail, show error message
        dispatch(showNotification({ message: "Rating", status: 1 }))
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
                            value={Rating["state"]}
                            onChange={(e) => setRating({ ...Rating, state: e.target.value })}
                        >
                            {ratingOptions.map((state) => {
                                return (
                                    <option key={state.value} value={state.value}>
                                        {state.label}
                                    </option>
                                )
                            })}
                        </select>
                        <div className="divider font-bold mt-5">Review</div>

                        {showReview && (
                            <textarea
                                className="textarea w-full h-24 textarea-bordered"
                                placeholder="You can write review here..."
                                value={Rating["comment"]}
                                onChange={(e) => setRating({ ...Rating, comment: e.target.value })}
                            ></textarea>
                        )}

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Add Review</span>
                                <input
                                    type="checkbox"
                                    className="toggle"
                                    checked={showReview}
                                    onChange={() => setShowReview(!showReview)}
                                />
                            </label>
                        </div>
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
