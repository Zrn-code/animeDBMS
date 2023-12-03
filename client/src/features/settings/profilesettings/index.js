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
    const [birthday, setBirthday] = useState("")
    const [gender,setGender] = useState("")
    // Call API to update profile settings changes
    const updateProfile = () => {
        dispatch(showNotification({message : "Profile Updated", status : 1}))    
    }

const getProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/getProfile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
  
      const profileData = response.data;
      profileData.Birthday = moment(profileData.Birthday).format('YYYY-MM-DD')
      setProfile(profileData)
      setBirthday(profileData.Birthday)
      setGender(profileData.Gender)
      //console.log(profileData)
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


    const handleGenderChange = (event) => {
      // 处理性别的变化
      const genderValue = event.target.value;
      // 更新 React 组件的状态
      setProfile({ ...profile, Gender: genderValue });
    };
  
    const handleBirthdayChange = (event) => {
      // 处理生日的变化
      const birthdayValue = event.target.value;
      // 更新 React 组件的状态
      setProfile({ ...profile, Birthday: birthdayValue });
    };
  
    return (
      <>
      {profile && profile.Username && (
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
              className="select block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            </div>
          </div>
          <div className="mt-16">
            <button className="btn btn-primary float-right" onClick={updateProfile}>
              Update
            </button>
          </div>
        </TitleCard>
      )}
      </>
    );
  }


export default ProfileSettings