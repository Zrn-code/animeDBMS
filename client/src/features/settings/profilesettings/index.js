import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import InputText from '../../../components/Input/InputText'
import TextAreaInput from '../../../components/Input/TextAreaInput'
import ToogleInput from '../../../components/Input/ToogleInput'

function ProfileSettings(){


    const dispatch = useDispatch()
    const token = localStorage.getItem('token')
    const [profile, setProfile] = useState({})
    // Call API to update profile settings changes
    const updateProfile = () => {
        dispatch(showNotification({message : "Profile Updated", status : 1}))    
    }
    useEffect(() => {
        fetch("/api/getProfile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    console.log(data);
                    setProfile(data);
                }
            );
            } else {
                res.json().then((data) => {
                    console.log(data);
                }
            );
            }
        });
    }, []);


    const updateFormValue = ({updateType, value}) => {
        console.log(updateType)
        console.log(value)
    }



    return(
        <> 
            <TitleCard title="Profile Settings" topMargin="mt-2">
            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Username</span>
                            </label>
                        <input type="text" placeholder={profile["Username"]} className="input input-bordered w-full max-w-xs" />
                        
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Email</span>
                            </label>
                        <input type="text" placeholder={profile["Email"]} className="input input-bordered w-full max-w-xs" disabled/>
                        
                    </div>
                </div>
                <div className="divider" ></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                </div>

                <div className="mt-16"><button className="btn btn-primary float-right" onClick={() => updateProfile()}>Update</button></div>
            </TitleCard>   
        </>

    )
}


export default ProfileSettings