import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import { useState } from 'react'
import { Link } from 'react-router-dom' 


function InternalPage(){

    const dispatch = useDispatch()
    const [genres, setGenres] = useState([])
    const [genre_cnt, setGenre_cnt] = useState([])
    useEffect(() => {
        dispatch(setPageTitle({ title : "Page Title"}))
        fetch(`/api/getGenres`).then(res => res.json()).then(data => setGenres(data));  
    }, [])

    useEffect(() => {
        fetch(`/api/getGenresCnt`).then(res => res.json()).then(data => setGenre_cnt(data));
    },[])

    return(
        <>
            <div className='divider'> Genres </div>
            <div className='flex flex-wrap'>
                {genres && genres.map((genre) => (
                    <div key={genre.genre_id} className='flex bg-base-100 rounded-xl m-4 p-4'>
                        <Link className='font-bold' to={`../genre/${genre["Genre_id"]}`}>
                            {genre["Genre_name"]} {genre_cnt && genre_cnt.map((genre_cnt) => (genre_cnt["Genre_id"] === genre["Genre_id"] ? `(${genre_cnt["cnt"]})` : null))} 
                        </Link>
                    </div>
                ))}
            </div>

        </>
    )
}

export default InternalPage