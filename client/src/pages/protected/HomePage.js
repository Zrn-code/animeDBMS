import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../../features/common/headerSlice"
import HomePage from "../../features/homepage/index"

function InternalPage() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title: "HomePage" }))
    }, [])

    return <HomePage />
}

export default InternalPage
