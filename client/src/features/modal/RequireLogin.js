import { useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification } from "../common/headerSlice"

function RequireLoginModalBody({ closeModal, extraObject }) {
    const login = () => {
        localStorage.clear()
        closeModal()
        window.location.href = "/login"
    }

    const register = () => {
        localStorage.clear()
        closeModal()
        window.location.href = "/register"
    }

    return (
        <>
            <div className="modal-body mt-5">
                <div className="text-center">You need to login or register to use this feature</div>

                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={() => closeModal()}>
                        Cancel
                    </button>
                    <button className="btn btn-primary " onClick={() => login()}>
                        Login
                    </button>
                    <button className="btn btn-primary " onClick={() => register()}>
                        Register
                    </button>
                </div>
            </div>
        </>
    )
}

export default RequireLoginModalBody
