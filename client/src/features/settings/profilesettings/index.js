import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from "../../common/headerSlice"
import axiosInstance from "../../../app/axios"

function ProfileSettings() {
    const dispatch = useDispatch()
    const token = localStorage.getItem("token")
    const [profile, setProfile] = useState({})

    const getProfile = async () => {
        try {
            const response = await axiosInstance.get("/api/getProfile", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            const profileData = response.data
            profileData.Birthday = moment(profileData.Birthday).format("YYYY-MM-DD")
            setProfile(profileData)
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
        }
    }

    useEffect(() => {
        getProfile()
    }, [])

    const handleGenderChange = (event) => {
        const genderValue = event.target.value
        setProfile({ ...profile, Gender: genderValue })
    }

    const handleBirthdayChange = (event) => {
        const birthdayValue = event.target.value
        setProfile({ ...profile, Birthday: birthdayValue })
    }

    const updateProfile = async () => {
        const updateProfile = {
            gender: profile["Gender"],
            birthday: profile["Birthday"],
        }
        //console.log(updateProfile)
        try {
            await axiosInstance.post("/api/updateProfile", updateProfile, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })
            dispatch(showNotification({ message: "Profile updated", status: 1 }))
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
            dispatch(showNotification({ message: "Error updating profile", status: 0 }))
        }
    }
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [password, setPassword] = useState("")

    const handlePasswordChange = (event) => {
        const { name, value } = event.target
        setPasswordData({ ...passwordData, [name]: value })
    }

    const changePassword = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwordData

        if (newPassword !== confirmPassword) {
            dispatch(showNotification({ message: "New passwords do not match", status: 0 }))
            return
        }

        try {
            await axiosInstance.put(
                "/api/updatePassword",
                {
                    old_password: oldPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                }
            )

            dispatch(showNotification({ message: "Password changed successfully", status: 1 }))
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
            dispatch(showNotification({ message: "Error changing password", status: 0 }))
        }
    }

    const DeleteAccount = async () => {
        console.log(password)
        try {
            await axiosInstance.delete("/api/deleteAccount", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                    password: password,
                },
            })

            window.location.href = "/app/welcome"
            localStorage.removeItem("token")
            dispatch(showNotification({ message: "Account deleted", status: 1 }))
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessage = error.response.data
                if (errorMessage === "Token expired") {
                    console.log("Token expired. Logging out...")
                    localStorage.removeItem("token")
                    dispatch(showNotification({ message: "Token expired. Logging out...", status: 0 }))
                    //window.location.href = "/app/welcome"
                } else {
                    console.log("Other 401 error:", errorMessage)
                }
            } else {
                console.error("Error:", error)
            }
            dispatch(showNotification({ message: "Error deleting account", status: 0 }))
        }
    }

    const handlePassword = (event) => {
        const { value } = event.target
        setPassword(value)
    }

    return (
        <>
            {profile && profile.Username && (
                <div>
                    <TitleCard title={`${profile.Username}'s Profile Settings`} topMargin="mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span>Gender</span>
                                </label>
                                <select
                                    value={profile.Gender}
                                    onChange={handleGenderChange}
                                    className="select block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span>Birthday</span>
                                </label>
                                <input
                                    type="date"
                                    value={profile.Birthday}
                                    onChange={handleBirthdayChange}
                                    className="select block w-full  border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-5">
                            <button className="btn btn-primary float-right" onClick={updateProfile}>
                                Update
                            </button>
                        </div>
                    </TitleCard>
                    <TitleCard title="Change Password" topMargin="mt-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span>Old Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Old Password"
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span>New Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="New Password"
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span>Check Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Double Check"
                                    className="input input-bordered"
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <button className="btn btn-primary float-right" onClick={changePassword}>
                                Change
                            </button>
                        </div>
                    </TitleCard>
                    <TitleCard title="Delete Account" topMargin="mt-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span>Confirm Password</span>
                                </label>
                                <input type="password" placeholder="Password" onChange={handlePassword} className="input input-bordered" />
                            </div>
                        </div>

                        <div className="mt-5">
                            <button className="btn btn-primary float-right" onClick={DeleteAccount}>
                                Delete
                            </button>
                        </div>
                    </TitleCard>
                </div>
            )}
        </>
    )
}

export default ProfileSettings
