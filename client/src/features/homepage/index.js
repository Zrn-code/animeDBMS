import { useEffect, useState } from 'react';
import DashboardTopBar from './components/DashboardTopBar';
import TitleCard from '../../components/Cards/TitleCard';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import axiosInstance from '../../app/axios';

function HomePage() {
    const [animeList, setAnimeList] = useState();
    useEffect(() => {
        axiosInstance.get('/api/getAnimes').then(response => {
            setAnimeList(response.data);
        });
    }, []);


  const [currentIndex, setCurrentIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false); // State to manage arrow visibility
  const dispatch = useDispatch();

  const handleNotification = () => {
    dispatch(showNotification('Notification clicked!'));
  };

  const goToNextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex + 3 >= animeList.length ? 0 : prevIndex + 3));
  };

  const goToPrevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex - 3 < 0 ? animeList.length - 3 : prevIndex - 3));
  };

  return (
    <>


      <div className="container mx-auto py-8">
        <div className="flex">
          <div className="w-2/3 pr-8 relative" onMouseEnter={() => setShowArrows(true)} onMouseLeave={() => setShowArrows(false)}>
            <h1 className="text-2xl font-bold mb-4">Popular Anime</h1>
        {animeList && (
            <div className="relative overflow-hidden">
              {showArrows && (
                <>
                  <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-md z-10"
                    onClick={goToPrevSlide}
                  >
                    &lt;
                  </button>
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-md z-10"
                    onClick={goToNextSlide}
                  >
                    &gt;
                  </button>
                </>
              )}

              <div className="flex space-x-4">
                {animeList.slice(currentIndex, currentIndex + 3).map(anime => (
                  <div key={anime.anime_id} className="w-full">
                    <div>
                        <img src={anime.Image_URL} alt={anime.Name} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
        )}
        <div className='divider'></div>
        
          </div>


          <div className="w-1/3">
            <TitleCard title="Top Anime" TopSideButtons={<button>more</button>}>fff</TitleCard>
            <TitleCard title="Top Anime" TopSideButtons={<button>more</button>}>fff</TitleCard>
            <TitleCard title="Top Anime" TopSideButtons={<button>more</button>}>fff</TitleCard>
            <TitleCard title="Top Anime" TopSideButtons={<button>more</button>}>fff</TitleCard>
            
            {/* Add your table or content for top anime here */}
            {/* ... */}
          </div>
          
        </div>
      </div>
    </>
  );
}

export default HomePage;
