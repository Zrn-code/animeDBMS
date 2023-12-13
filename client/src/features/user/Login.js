import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import LandingIntro from "./LandingIntro"
import ErrorText from "../../components/Typography/ErrorText"
import InputText from "../../components/Input/InputText"
import axiosInstance from "../../app/axios"

function Login() {
    const INITIAL_LOGIN_OBJ = {
        password: "",
        email: "",
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)

    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (loginObj.email.trim() === "") return setErrorMessage("Email Id is required! (use any value)")
        if (loginObj.password.trim() === "") return setErrorMessage("Password is required! (use any value)")
        else {
            setLoading(true)
            try {
                const response = await axiosInstance.post("/api/login", loginObj, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                const data = response.data

                if (response.status === 200) {
                    // Assuming the API returns success message or token
                    localStorage.setItem("token", data.token || "DummyTokenHere")
                    localStorage.setItem("user_id", JSON.stringify(data.user_id))
                    //console.log(localStorage.getItem('token'));
                    setLoading(false)
                    window.location.href = "/app/welcome" // Redirect to the home page after successful login
                } else {
                    // Handling API error messages
                    setErrorMessage(data.message || "Login failed")
                    setLoading(false)
                }
            } catch (error) {
                console.error("Error:", error)

                setErrorMessage(error.response.data.message || "Something went wrong")
                setLoading(false)
            }
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setLoginObj({ ...loginObj, [updateType]: value })
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                    <div className="">
                        <LandingIntro />
                    </div>
                    <div className="py-24 px-10">
                        <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText
                                    type="email"
                                    defaultValue={loginObj.email}
                                    updateType="email"
                                    containerStyle="mt-4"
                                    labelTitle="Email"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    defaultValue={loginObj.password}
                                    type="password"
                                    updateType="password"
                                    containerStyle="mt-4"
                                    labelTitle="Password"
                                    updateFormValue={updateFormValue}
                                />
                            </div>

                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>
                                Login
                            </button>

                            <div className="text-center mt-4">
                                Don't have an account yet?{" "}
                                <Link to="/register">
                                    <span className="font-bold  inline-block hover:underline hover:cursor-pointer transition duration-200">
                                        Register
                                    </span>
                                </Link>
                            </div>
                            <div className="text-center mt-4">
                                <Link to="/app/welcome">
                                    <span className="font-bold  inline-block  hover:underline hover:cursor-pointer transition duration-200">
                                        Go to app without login
                                    </span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
