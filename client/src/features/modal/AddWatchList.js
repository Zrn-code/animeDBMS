import { useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification } from "../common/headerSlice"
import InputText from "../../components/Input/InputText"
import ErrorText from "../../components/Typography/ErrorText"
import axios from "axios"
import axiosInstance from "../../app/axios"

const INITIAL_WATCH_STATE = {
    id: "",
    name: "",
    img: "",
    state: "",
}

const stateOptions = [
    { value: "Watching", label: "Watching", id: 1 },
    { value: "Completed", label: "Completed", id: 2 },
    { value: "On Hold", label: "On Hold", id: 3 },
    { value: "Dropped", label: "Dropped", id: 4 },
    { value: "Plan to Watch", label: "Plan to Watch", id: 6 },
]

function AddWatchListModalBody({ closeModal, extraObject }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [watchList, setWatchList] = useState(extraObject || INITIAL_WATCH_STATE)

    const saveWatchList = () => {
        setLoading(true)
        const token = localStorage.getItem("token")

        dispatch(showNotification({ message: "Watch List Saved", status: 1 }))
        closeModal()
    }

    return (
        <>
            <div className="modal-body mt-5">
                <div className="flex">
                    <img className="flex-1" src={watchList["img"]} alt={watchList["name"] + "imgURL"}></img>
                    <div className="flex-1 ml-5">
                        <div className="text-2xl font-bold mb-5">{watchList["name"]}</div>
                        {stateOptions.map((state) => {
                            return (
                                <div key={state.id} className="form-control">
                                    <label className="cursor-pointer label">
                                        <span className="ml-2 ">{state.label}</span>
                                        <input
                                            type="radio"
                                            checked={watchList["state"] === state.value}
                                            onChange={() => setWatchList({ ...watchList, state: state.value })}
                                            className="radio"
                                        />
                                    </label>
                                </div>
                            )
                        })}
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

export default AddWatchListModalBody
