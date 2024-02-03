import React, { useEffect } from 'react'
import { useState } from 'react'
import {ThreeDots} from 'react-loader-spinner';
import ReactStars from 'react-stars';
import { getDocs } from 'firebase/firestore';
import { movieRef } from '../firebase/firebase';
import { Link } from 'react-router-dom';


const Cards = () => {
    const[data,setData]=useState([]);
    const[loading,setLoading]=useState(false);


    useEffect(()=>{
      async function getData(){
        setLoading(true);
        const _data = await getDocs(movieRef);
       _data.forEach((doc)=>{
          setData((prv)=>[...prv,{...(doc.data()),id:doc.id}])
       })
        setLoading(false);
      }
      getData();
    },[])
  
  return (
    <div className='flex flex-wrap p-3 mt-2'>
        {loading?<div className='w-full flex justify-center items-center h-96'><ThreeDots height={40} color='white'/></div>:
        data.map((e,i)=>{
            return(
              <div className=' w-1/2 md:w-1/5 flex justify-evenly'>
           <Link to={`/detail/${e.id}`}><div key={i} className='card p-2 font-medium shadow-lg hover:-translate-y-3 cursor-pointer transition-all duration-500 mt-5'>
           <img className='h-72 ' src={e.image} alt=''/>
           <h1><span className='text-gray-500'></span>{e.title}</h1>
           <h1 className='flex items-center'><span className='text-gray-500 mr-1'>Rating : </span>
           <ReactStars
               size={20}  
               half={true}
               value={e.rating/e.rated}
               edit={false}
           />
           </h1>
           <h1><span className='text-gray-500'>Year : </span>{e.year}</h1>
       </div></Link> 
       </div>
      ) }) }
    </div>
  )
}

export default Cards
