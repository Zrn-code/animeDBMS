import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import { useState } from 'react'
import { Link } from 'react-router-dom' 


function InternalPage(){

    const dispatch = useDispatch()
    const [genres, setGenres] = useState([])
    const [genre_cnt, setGenre_cnt] = useState([])
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

    useEffect(() => {
        dispatch(setPageTitle({ title : "Page Title"}))
        fetch(`/api/getGenres`).then(res => res.json()).then(data => setGenres(data));  
    }, [])

    useEffect(() => {
        fetch(`/api/getGenresCnt`).then(res => res.json()).then(data => setGenre_cnt(data));
    },[])

    return(
        <>
            <div className='flex'>
            {alphabet.map((letter, index) => (
                <button className='bg-base-100 rounded mx-2 flex-auto' key={index} onClick={() => console.log(letter)}>
                    {letter}
                </button>
            ))}
            </div>
            <div className='divider'> Genres </div>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {genres && genres.map((genre,idx) => (
                    <Link className='flex font-bold bg-base-100 rounded-xl m-4 p-4 justify-between items-center' key={idx}  to={`../genre/${genre["Genre_id"]}/1`}>
                        <div className='text-left font-bold'>{genre["Genre_name"]}</div>
                        <div className='text-right ml-2'>{genre_cnt && genre_cnt.map((genre_cnt) => (genre_cnt["Genre_id"] === genre["Genre_id"] ? `(${genre_cnt["cnt"]})` : null))} </div>
                         
                    </Link>
                ))}
            </div>

        </>
    )
}

export default InternalPage