import { useState } from "react"
import { useDispatch } from "react-redux"
import { setRefetch, showNotification } from "../common/headerSlice"
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
    const [watchList, setWatchList] = useState(extraObject || INITIAL_WATCH_STATE)
    const token = localStorage.getItem("token")
    const saveWatchList = () => {
        if (!watchList["state"]) {
            console.log("no state selected")
            return
        }
        const selectedState = stateOptions.find((option) => option.value === watchList["state"])
        const requestBody = {
            anime_id: watchList["id"],
            status: selectedState["id"],
        }

        axiosInstance
            .get(`/api/getWatchList/${watchList["id"]}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            .then((res) => res.data)
            .then((data) => {
                if (data.length > 0) {
                    axiosInstance
                        .put("/api/updateStatus", requestBody, {
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
                        .post("/api/addStatus", requestBody, {
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
