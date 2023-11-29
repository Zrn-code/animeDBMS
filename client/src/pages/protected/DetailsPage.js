import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import { useParams } from 'react-router-dom'
import TitleCard from '../../components/Cards/TitleCard';
import { Pie } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement,
    Filler,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import axiosInstance from '../../app/axios';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  ChartJS.register(ArcElement, Tooltip, Legend, Tooltip,Filler,Legend);

  function BarChart(){
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
      };
      
      const labels = ['1', '2', '3', '4', '5', '6', '7','8','9','10'];
      
      const data = {
        labels,
        datasets: [
          {
            label: 'Users',
            data: labels.map(() => { return Math.random() * 1000 + 500 }),
            backgroundColor: 'grey',
          },

        ],
      };

    return(
      <TitleCard title={"Score Stats"} >
            <Bar options={options} data={data} />
      </TitleCard>
    )
}

function PieChart(){
  
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      };
      
      const labels = ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'];
      
      const data = {
        labels,
        datasets: [
            {
                label: 'users',
                data: [122, 219, 30, 51, 82],
                backgroundColor: [
                  'rgba(255, 99, 255, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 255, 0.8)',
                  'rgba(75, 192, 255, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                  'rgba(255, 99, 255, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 255, 1)',
                  'rgba(75, 192, 255, 1)',
                  'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
              }
        ],
      };

    return(
        <TitleCard title={"Watch Status"}>
                <Pie options={options} data={data} />
        </TitleCard>
    )
}




function Stat({ figureSvg, title, value, desc,addHash }) {
    return (
      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            {figureSvg}
          </svg>
        </div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value === undefined ?-1:addHash ? `#${value}` : value}</div>
        <div className="stat-desc">{desc}</div>
      </div>
    );
}

function Overview({value,detail}){
    return(
        <div className='container mx-auto'>
        <div className='flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center'>
            <div className='font-extrabold text-left text-2xl'>{value.Name}</div>
            <div className='font-extrabold text-right text-l ml-2 tooltip tooltip-left' data-tip={detail["Aired"]}>{value["Premiered"]}</div>
        </div>
        <div className="stats shadow h-36 w-full">
            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>}
                title="Rank"
                value={detail["Rank"]}
                desc="By mean score"
                addHash={true}
            />

            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>}
                title="Popularity"
                value={detail["Popularity"]}
                desc="By members"
                addHash={true}
            />

            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />}
                title="Members"
                value={detail["Members"]}
                desc="Total rating or status users"
            />

            <Stat
                figureSvg={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />}
                title="Mean Score"
                value={detail["Score"] ? detail["Score"] : 0}
                desc={`Scored by ${detail["Scored By"]} users`}
            />
        </div>
        <div className='bg-base-100 rounded-xl p-4 mt-5 font-extrabold '>{detail["Synopsis"]}</div>
        <div className='flex w-full mt-5'>
            <div className='grow-0 bg-base-100 rounded-xl p-4 mx-2 font-extrabold'>genres</div>
            {"Award Winning, Drama, Fantasy, Suspense".split(',').map((genre,idx) => <div key={idx}  className='grow bg-base-100 rounded-xl p-4 mx-2 font-extrabold tooltip' data-tip={genre}>{genre}</div>)}
        </div>

    </div>
    )
}


function Details({value,detail}){
    return(
        <div className='container mx-auto'>
        <div className='flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center'>
            <div className='font-extrabold text-left text-2xl'>{value.Name}</div>
            <div className='font-extrabold text-right text-l ml-2 tooltip tooltip-left' data-tip={detail["Aired"]}>{value["Premiered"]}</div>
        </div>
        <div className='flex w-full mt-5'>
            <div className='grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip' data-tip="Rating">{detail["Rating"]}</div>
            <div className='grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip' data-tip="Source">{detail["Source"]}</div>
            <div className='grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip' data-tip={detail["Duration"]}>{detail["Episodes"]} eps</div>
        </div>
        <div className='flex w-full mt-5'>
            <div className='grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip' data-tip="Producers">{detail["Producers"]}</div>
            <div className='grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip' data-tip="Licensors">{detail["Licensors"]}</div>
            <div className='grow bg-base-100 shadow rounded-xl p-4 mx-2 font-extrabold tooltip' data-tip="Studios">{detail["Studios"]}</div>
        </div>
        <TitleCard className='flex w-full mt-5' title={"user"}>
            content
        </TitleCard>


        <div className="btn-group grid grid-cols-2 mt-5">
            <button className="btn btn-outline">Previous page</button>
            <button className="btn btn-outline">Next</button>
        </div>
    </div>
    )
}

function Statistics({value,detail}){
    return(
        <div className='container'>
            <div className='flex bg-base-100 rounded-xl p-4 justify-between items-center'>
                <div className='font-extrabold text-left text-2xl'>{value.Name}</div>
                <div className='font-extrabold text-right text-l ml-2 tooltip tooltip-left' data-tip={detail["Aired"]}>{value["Premiered"]}</div>
                
            </div>
            <div className='flex'>
                <div className='mx-2 grow'>
                    <BarChart />
                    <div className='flex mt-5 bg-base-100 rounded-xl p-4 justify-between items-center '>
                        Mean Score 100
                    </div>
                </div>

                <div className='mx-2'><PieChart /></div>
            </div>
    </div>
    )
}


function InternalPage(){    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle({ title : "Details Page"}));
    }, []);

    const [currentPage, setCurrentPage] = useState('overview');
    const [detail, setDetail] = useState(null);
    const [value, setValue] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axiosInstance.get(`/api/getAnimeDetails/${id}`).then(res => res.data).then(data => setDetail(data[0]));
        axiosInstance.get(`/api/getAnime/${id}`).then(res => res.data).then(data => setValue(data[0]));
    },[] );

    if (detail === null || value === null) {
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
                    <img className='max-h-90 rounded-xl' src={value["Image_URL"]} alt="img" />
                    <div className='flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center mt-4'>
                        <div className='text-left font-bold'>watch status</div>
                        <div className='text-right ml-2'>Unknown</div>
                    </div>
                    <div className='flex bg-base-100 rounded-xl p-4 mb-5 justify-between items-center mt-4'>
                        <div className='text-left font-bold '>your score</div>
                        <div className='text-right  ml-2'>N/A ⭐</div>
                    </div>


                    
                    <div className="flex bg-base-100 rounded-xl overflow-hidden">
                        <button onClick={() => setCurrentPage('overview')}
                            className={`flex-1 p-2 font-bold ${
                            currentPage === 'overview' ? 'bg-primary text-slate-50' : ''
                            }`}
                        >
                            Overview
                        </button>
                        <button onClick={() => setCurrentPage('details')}
                            className={`flex-1 p-2 font-bold ${
                            currentPage === 'details' ? 'bg-primary text-slate-50' : ''
                            }`}
                        >
                            Details
                        </button>
                        <button onClick={() => setCurrentPage('statistics')}
                                className={`flex-1 p-2 font-bold  ${
                                currentPage === 'statistics' ? 'bg-primary text-slate-50' : ''
                                }`}
                            >
                            Statistics
                        </button>
                    </div>
                </div>
                <div className="divider divider-horizontal"/>
    
                {/* Render components based on currentPage */}
                {currentPage === 'overview' && <Overview value={value} detail={detail}/>}
                {currentPage === 'details' && <Details value={value} detail={detail} />}
                {currentPage === 'statistics' && <Statistics value={value} detail={detail}/>}
            </div> 
        </>
    );
}

export default InternalPage;
