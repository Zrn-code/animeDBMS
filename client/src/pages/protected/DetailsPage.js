import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import { useParams } from 'react-router-dom'

function Stat({ figureSvg, title, value, desc,addHash }) {
    return (
      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            {figureSvg}
          </svg>
        </div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{addHash ? `#${value}` : value}</div>
        <div className="stat-desc">{desc}</div>
      </div>
    );
}

function Overview({value}){
    return(
        <div className='container mx-auto'>
        <div className='flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center'>
            <div className='font-extrabold text-left text-2xl'>{value.Name}</div>
            <div className='font-extrabold text-right text-l ml-2'>{value["Premiered"]}</div>
        </div>
        <div className="stats shadow h-36 w-full">
            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>}
                title="Rank"
                value={value["Rank"]}
                desc="By mean score"
                addHash={true}
            />

            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>}
                title="Popularity"
                value={value["Popularity"]}
                desc="By members"
                addHash={true}
            />

            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />}
                title="Members"
                value={value["Members"]}
                desc="Total rating or status users"
            />

            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />}
                title="Mean Score"
                value={value["Score"] ? value["Score"] : 0}
                desc={`Scored by ${value["Scored By"]} users`}
            />
        </div>
        
        <div className='bg-base-100 rounded-xl p-4 mt-5 font-extrabold '>{value["Synopsis"]}</div>
    </div>
    )
}


function Details({value}){
    return(
        <div className='container mx-auto'>
        <div className='flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center'>
            <div className='font-extrabold text-left text-2xl'>{value.Name}</div>
            <div className='font-extrabold text-right text-l ml-2'>{value["Premiered"]}</div>
        </div>
        
        <div className='bg-base-100 rounded-xl p-4 mt-5 font-extrabold '>{value["Synopsis"]}</div>
    </div>
    )
}

function Statistics({value}){
    return(
        <div className='container mx-auto'>
        <div className='flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center'>
            <div className='font-extrabold text-left text-2xl'>{value.Name}</div>
            <div className='font-extrabold text-right text-l ml-2'>{value["Premiered"]}</div>
        </div>
        <div className="stats shadow h-36 w-full">

            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>}
                title="Popularity"
                value={value["Popularity"]}
                desc="By members"
                addHash={true}
            />

            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />}
                title="Members"
                value={value["Members"]}
                desc="Total rating or status users"
            />

            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />}
                title="Mean Score"
                value={value["Score"] ? value["Score"] : 0}
                desc={`Scored by ${value["Scored By"]} users`}
            />
        </div>
        
        <div className='bg-base-100 rounded-xl p-4 mt-5 font-extrabold '>{value["Synopsis"]}</div>
    </div>
    )
}


function InternalPage(){    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle({ title : "Details Page"}));
    }, []);

    const [currentPage, setCurrentPage] = useState('overview');
    const [value, setValue] = useState(null);
    const { id } = useParams();

    const handleButtonClick = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (!id) return; // Add a condition to prevent unnecessary fetch requests when id is null or undefined

        fetch(`/api/getAnimeDetails/id=${id}`).then(res => res.json()).then(data => setValue(data[0]));
    }, [id]);

    if (value === null) {
        return (
            <div className="loading loading-spinner">Loading...</div>
        );
    }

    return (
        <>
            <div className='flex mt-5'>
                {/* image and buttons */}
                <div className='min-w-max'>
                    {/* Your existing buttons */}
                    <img className='max-h-90 rounded-xl' src={value["Image URL"]} alt="img" />
                    <div className='flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center mt-4'>
                        <div className='text-left font-bold text-l'>watch status</div>
                        <div className='text-right text-l ml-2'>Unknown</div>
                    </div>
                    <div className='flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center mt-4'>
                        <div className='text-left font-bold text-l'>your score</div>
                        <div className='text-right text-l ml-2'>N/A ⭐</div>
                    </div>
                    <div className="flex bg-base-100 p-2 rounded-xl">
                        <button onClick={() => handleButtonClick('overview')} className="flex-1">
                            Overview
                        </button>
                        <button onClick={() => handleButtonClick('details')} className="flex-1">
                            Details
                        </button>
                        <button onClick={() => handleButtonClick('statistics')} className="flex-1">
                            Statistics
                        </button>
                    </div>
                </div>
                <div className="divider divider-horizontal"/>
    
                {/* Render components based on currentPage */}
                {currentPage === 'overview' && <Overview value={value}/>}
                {currentPage === 'details' && <Details value={value}/>}
                {currentPage === 'statistics' && <Statistics value={value}/>}
            </div> 
        </>
    );
}

export default InternalPage;
