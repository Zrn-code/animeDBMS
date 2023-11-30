import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import InputText from '../../../components/Input/InputText'
import TextAreaInput from '../../../components/Input/TextAreaInput'
import ToogleInput from '../../../components/Input/ToogleInput'
import axiosInstance from "../../../app/axios"

function ProfileSettings(){


    const dispatch = useDispatch()
    const token = localStorage.getItem('token')
    const [profile, setProfile] = useState({})
    // Call API to update profile settings changes
    const updateProfile = () => {
        dispatch(showNotification({message : "Profile Updated", status : 1}))    
    }

    // 假设这段代码是用于获取用户资料的地方
// 在某个合适的地方，比如一个专门的函数、组件或者拦截器中发送请求，接收响应，并处理 401 错误
const getProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/getProfile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
  
      // 处理成功获取用户资料的情况
      const profileData = response.data;
      setProfile(profileData)
      // 进行进一步处理...
  
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data;
        if (errorMessage === 'Token expired') {
          console.log('Token expired. Logging out...');
          localStorage.removeItem('token');
          window.location.href = '/app/welcome';
        } else {
          console.log('Other 401 error:', errorMessage);
        }
      } else {
        console.error('Error:', error);
        // 处理其他错误
      }
    }
  };
  


    useEffect(() => {
        getProfile()    
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