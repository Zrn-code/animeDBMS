import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TitleCard from '../../components/Cards/TitleCard'
import { Link, useParams } from 'react-router-dom'
import SearchBar from "../../components/Input/SearchBar"
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'


const TopSideButtons = ({removeFilter, applyFilter, applySearch}) => {

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const locationFilters = ["TV", "London", "Canada", "Peru", "Tokyo"]

    const showFiltersAndApply = (params) => {
        applyFilter(params)
        setFilterParam(params)
    }

    const removeAppliedFilter = () => {
        removeFilter()
        setFilterParam("")
        setSearchText("")
    }

    useEffect(() => {
        if(searchText == ""){
            removeAppliedFilter()
        }else{
            applySearch(searchText)
        }
    }, [searchText])

    return(
        <div className="inline-block float-right">
            {/*<SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>*/}
            {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {
                        locationFilters.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div>
        </div>
    )
}


function InternalPage(){    

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle({ title : "Home Page"}))
      }, [])
    
    const [values, setValues] = useState()

    useEffect(() => {
        fetch('/api/getAnimes').then(res => res.json()).then(data => setValues(data));
    }, [])
    
    const removeFilter = () => {
        fetch('/api/getAnimes').then(res => res.json()).then(data => setValues(data));
    }

    const applyFilter = (params) => {
        let filteredTransactions = values.filter((t) => {return t.location == params})
        setValues(filteredTransactions)
    }

    // Search according to name
    const applySearch = (value) => {
        let filteredTransactions = values.filter((t) => {return t.email.toLowerCase().includes(value.toLowerCase()) ||  t.email.toLowerCase().includes(value.toLowerCase())})
        setValues(filteredTransactions)
    }


    return(
        <TitleCard title="Top 10 Anime" topMargin="mt-2" TopSideButtons={<TopSideButtons applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter}/>}>
        <div className="overflow-x-auto w-full">
        <table className="table w-full">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th colSpan="2">Title</th>
                    <th>Score</th>
                    <th>Your Score</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                { values &&
                    values.map((l, k) => {
                        return(
                            <tr key={k}>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className='font-bold text-7xl'>{k+1}</div>
                                    </div>
                                </td>
                                <td>
                                <div className='max-h-48'>
                                    <Link to={"../details/" + l.anime_id}>
                                        <img className='max-h-36' src={l["Image_URL"]} alt='img' />
                                    </Link>
                                </div></td>
                                <td><div className="font-bold">{l.Name}</div></td>
                                <td><div className="font-bold">⭐{0}</div></td>
                                <td><div className="font-bold">⭐N/A</div></td> 
                                <td><button className="btn glass">Watch List</button></td>                               
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </div>
    </TitleCard>
    )
}

export default InternalPage