import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import LandingIntro from "./LandingIntro"
import ErrorText from "../../components/Typography/ErrorText"
import InputText from "../../components/Input/InputText"
import axiosInstance from "../../app/axios"

function Register() {
    const INITIAL_REGISTER_OBJ = {
        name: "",
        password: "",
        email: "",
        check_password: "",
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ)

    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (registerObj.name.trim() === "") return setErrorMessage("Name is required!")
        if (registerObj.email.trim() === "") return setErrorMessage("Email is required!")
        if (registerObj.password.trim() === "") return setErrorMessage("Password is required!")
        if (registerObj.email && !registerObj.email.includes("@")) return setErrorMessage("Invalid email address")
        if (registerObj.password && registerObj.password.length < 6) return setErrorMessage("Password must be at least 6 characters long")
        if (registerObj.password.length > 50) return setErrorMessage("Password must be less than 50 characters long")
        if (registerObj.name.length > 50) return setErrorMessage("Name must be less than 50 characters long")
        if (registerObj.email.length > 200) return setErrorMessage("Email must be less than 200 characters long")
        if (registerObj.password !== registerObj.check_password) return setErrorMessage("Passwords do not match")
        setLoading(true)
        try {
            const response = await axiosInstance.post("/api/register", registerObj, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            })

            const data = response.data

            if (response.status === 200) {
                // Assuming the API returns success message or token
                localStorage.setItem("token", data.token)
                //console.log(localStorage.getItem('token'));
                setLoading(false)
                window.location.href = "/app/welcome" // Redirect to the home page after successful login
            } else {
                setErrorMessage(data.message || "Register failed")
                setLoading(false)
            }
        } catch (error) {
            console.error("Error:", error)
            setErrorMessage(error.response.data.message || "Something went wrong")
            setLoading(false)
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setRegisterObj({ ...registerObj, [updateType]: value })
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                    <div className="">
                        <LandingIntro />
                    </div>
                    <div className="py-24 px-10">
                        <h2 className="text-2xl font-semibold mb-2 text-center">Register</h2>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText
                                    defaultValue={registerObj.name}
                                    updateType="name"
                                    containerStyle="mt-4"
                                    labelTitle="Username"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    defaultValue={registerObj.email}
                                    updateType="email"
                                    containerStyle="mt-4"
                                    labelTitle="Email"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    defaultValue={registerObj.password}
                                    type="password"
                                    updateType="password"
                                    containerStyle="mt-4"
                                    labelTitle="Password"
                                    updateFormValue={updateFormValue}
                                />
                                <InputText
                                    defaultValue={registerObj.check_password}
                                    type="password"
                                    updateType="password"
                                    containerStyle="mt-4"
                                    labelTitle="Double check password"
                                    updateFormValue={updateFormValue}
                                />
                            </div>

                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>
                                Register
                            </button>

                            <div className="text-center mt-4">
                                Already have an account?{" "}
                                <Link to="/login">
                                    <span className="font-bold  inline-block hover:underline hover:cursor-pointer transition duration-200">
                                        Login
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

export default Register
