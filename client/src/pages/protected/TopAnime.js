import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TitleCard from '../../components/Cards/TitleCard'
import { Link, useParams } from 'react-router-dom'
import { openModal } from '../../features/common/modalSlice'
import {  MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import axiosInstance from '../../app/axios'

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
    const [selectedFilters, setSelectedFilters] = useState([]);
    //const [searchText, setSearchText] = useState('');
    const typeFilters = ["TV", "Movie", "OVA", "Special", "ONA", "Music", "Unknown"];

    const addOrRemoveFilter = (filter) => {
        const index = selectedFilters.indexOf(filter);
        let updatedFilters = [...selectedFilters];

        if (index === -1) {
            updatedFilters.push(filter);
        } else {
            updatedFilters.splice(index, 1);
        }

        setSelectedFilters(updatedFilters);
    };

    const applyFilters = () => {
        applyFilter(selectedFilters);
    };

    const removeAppliedFilter = () => {
        removeFilter();
        setSelectedFilters([]);
        //setSearchText('');
    };

    return (
        <div className="inline-block float-right">
           
            {selectedFilters.length > 0 && (
                <button onClick={removeAppliedFilter} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">
                    {selectedFilters.join(', ')}<span className="ml-2">×</span>
                </button>
            )}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                    Filter
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {typeFilters.map((filter, index) => (
                        <li key={index}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.includes(filter)}
                                    onChange={() => addOrRemoveFilter(filter)}
                                    className="mr-2"
                                />
                                {filter}
                            </label>
                        </li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    <li>
                        <button onClick={applyFilters} >Apply</button>
                    </li>
                </ul>
            </div>
            
            {/*
            <button onClick={handleApplySearch} className="btn btn-secondary ml-2">
                Apply Search
            </button>
            */}
        </div>
    );
};

const WatchListButtons = ({id,name,img,state}) => {

    const dispatch = useDispatch()
    const token = localStorage.getItem('token')
    const openAddWatchListModal = () => {
        if(!token){
            dispatch(openModal({title : "You need to login", bodyType : MODAL_BODY_TYPES.REQUIRE_LOGIN}))
        }else{
            dispatch(openModal({title : "Update Watch Status", bodyType : MODAL_BODY_TYPES.WATCHLIST_ADD_NEW,extraObject:{"id":id,"name":name,"img":img,"state":state}}))
        }
    }

    return(
        <div className="inline-block ">
            <button className="btn btn-sm normal-case btn-primary" onClick={() => openAddWatchListModal()}>Add Status</button>
        </div>
    )
}

const RatingButtons = ({id,name,img,state}) => {

    const dispatch = useDispatch()
    const token = localStorage.getItem('token')
    const openAddWatchListModal = () => {
        if(!token){
            dispatch(openModal({title : "You need to login", bodyType : MODAL_BODY_TYPES.REQUIRE_LOGIN}))
        } else {
            dispatch(openModal({title : "Update Rating Score", bodyType : MODAL_BODY_TYPES.RATING_ADD_NEW,extraObject:{"id":id,"name":name,"img":img,"state":state}}))
        }
    }
        
    return(
        <div className="inline-block cursor-pointer" onClick={openAddWatchListModal}>
            <div className='flex items-center'>⭐ <div className='mr-2 font-bold underline'>N/A</div></div>
        </div>
    )
}


function InternalPage(){    

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle({ title : "Top Anime Series"}))
      }, [])
    
    const [values, setValues] = useState([])
    const [params, setParams] = useState('default')
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 50; 

    const fetchData = async () => {
        const startItem = (currentPage - 1) * itemsPerPage +1;
        const endItem = currentPage * itemsPerPage;
        try{
            const response = await axiosInstance.get(`/api/getTopAnime/${params}/${startItem}/${endItem}`).then(res => res.data).then(data => setValues(data));
            const data = response.data;
            setValues(data);
        }catch(err){
            console.log("error:" + err);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, params]);


    

    useEffect(() => {
        if (inputPage < 1 || inputPage > totalPages) {
            setInputPage(currentPage);
            return;
        }
        setCurrentPage(inputPage);
    }, [inputPage, currentPage, totalPages]);

    useEffect(() => {
        axiosInstance.get('/api/getAnimes').then(res => res.data).then(data => setValues(data));
        setTotalPages(Math.ceil(values.length / itemsPerPage));
    }, [])
    
    const removeFilter = () => {
        setParams('default');
    }

    const applyFilter = async(params) => {
        const paramsString = params.join('+');
        setParams(paramsString);
    }
    

    return(
    <>
        <TitleCard title="Top Anime Series" topMargin="mt-2" TopSideButtons={<TopSideButtons applyFilter={applyFilter} removeFilter={removeFilter}/>}>
        <div className="overflow-x-auto w-full">
        <table className="table w-full">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Title</th>
                    <th>Score</th>
                    <th>Your Review</th>
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
                                        <div className='font-bold text-5xl'>{k+1}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className='flex'>
                                        <Link to={"../details/" + l.anime_id} className='flex'>
                                            <img className='max-h-24 flex' src={l["Image_URL"]} alt='img' />
                                        </Link>
                                        <div className='flex mx-5 flex-col'>
                                            <Link to={"../details/" + l.anime_id} className='flex'>
                                                <div className="font-bold  text-lg hover:underline">{l.Name}</div>
                                            </Link>
                                            <div className='mt-2 font-extralight text-sm'>{l.type} ( {l.Premiered!==-1?l.Premiered:'n/a'} )</div>
                                            <div className='mt-2 font-extralight text-sm'>{l.members?l.members:0} Members</div>
                                        </div>
                                    </div>
                                </td>
                                <td><div className="font-bold">⭐{0}</div></td>
                                <td><RatingButtons id={l["anime_id"]} img={l["Image_URL"]}  name={l["Name"]} /></td> 
                                <td><WatchListButtons id={l["anime_id"]} name={l["Name"]} img={l["Image_URL"]} state={l["state"]} /></td>                               
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </div>
    </TitleCard>
        <div className="flex justify-center mt-4">
        <div className="btn-group">
                    <button
                    className="btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    >
                    «
                    </button>
                    
                    <button className="btn" onClick={() => setInputPage(currentPage)}>
                        Page {currentPage}
                    </button>
                    
                    <button
                    className="btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    >
                    »
                    </button>
                </div>
        </div>
    </>
    )
}

export default InternalPage