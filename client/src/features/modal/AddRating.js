import { useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification } from "../common/headerSlice"

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

    const saveWatchList = () => {
        setLoading(true)

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
