import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../../features/common/headerSlice"
import TitleCard from "../../components/Cards/TitleCard"
import { Link, useParams } from "react-router-dom"
import SearchBar from "../../components/Input/SearchBar"
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"

function InternalPage() {
    return (
        <div className="grid grid-cols-2 gap-5">
            <TitleCard />
            <TitleCard />
            <TitleCard />
            <TitleCard />
        </div>
    )
}

export default InternalPage
