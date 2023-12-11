import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ProfileSettings from '../../features/settings/profilesettings'
import { openModal } from '../../features/common/modalSlice'
import {  MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'

function InternalPage(){
    const dispatch = useDispatch()
    const token = localStorage.getItem('token')
    useEffect(() => {
        dispatch(setPageTitle({ title : "Settings"}))
      }, [])

    if(!token){
        dispatch(openModal({title : "You need to login", bodyType : MODAL_BODY_TYPES.REQUIRE_LOGIN}))}

    return(
        <ProfileSettings />
    )
}

export default InternalPage