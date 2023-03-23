import { addDoc ,doc,updateDoc,query, where,getDocs} from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { db, reviewRef } from '../firebase/firebase';
import swal from 'sweetalert';
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import { Appstate } from '../App';
import { useNavigate } from 'react-router-dom';
const Reviews = ({id,prevRating,userRated}) => {
    const[rating,setRating]=useState(0);
    const[loading,setLoading]=useState(false);
    const[reviewloading,setReviewloading]=useState(false);
    const[form,setform]=useState('');
    const[data,setData]=useState([]);
    const useAppstate = useContext(Appstate);
    const navigate = useNavigate();
    const[newAdded,setNewAdded]=useState(0);
    const sendReview= async()=>{
        setLoading(true);
        try{
          if(useAppstate.login){
            await addDoc(reviewRef,{
                movieid:id,
                name:useAppstate.userName,
                rating: rating,
                thought: form,
                timestamp: new Date().getTime()
            })
            const ref= doc(db,'movies',id);
            await updateDoc(ref,{
                rating:prevRating+rating,
                rated:userRated+1,
            })
            setRating(0);
            setform(''); 
            setNewAdded(newAdded+1);
 
         swal({
                title: "Review sent",
                icon:'success',
                buttons:false,
                timer:3000
               })
             
            }else{
                 navigate('/login');
            }
          }
        
            catch(error){
                swal({
                    title: error.message,
                    icon:'error',
                    buttons:false,
                    timer:3000
                   })

            }
            setLoading(false);
      }

      useEffect(()=>{
        async function getData(){
            setReviewloading(true);
            setData([]);
            let quer = query(reviewRef,where('movieid','==',id))
            const querysnapshot = await getDocs(quer);
            querysnapshot.forEach((doc)=>{
                setData((prev)=>[...prev,doc.data()])
            })
            setReviewloading(false);
        }
        getData();
      },[newAdded])

  return (
    <div className='w-full border-t-2 border-gray-700 mt-4'>
       <ReactStars
          size={30}
          half={true}
          value={rating}
          onChange={(rate)=>setRating(rate)}
         />  
    <input
       value={form}
       onChange={(e)=>setform(e.target.value)}
       placeholder='share your thoughts...'
       className='w-full p-2 header outline-none'
    
    
    />
     <button onClick={sendReview} className='bg-green-500 p-1 flex justify-center w-full'>
       {loading?<TailSpin height={25} color='white'/>: 'Share'}
        </button>
      {reviewloading?<div className='w-full flex justify-center mt-6'><ThreeDots height={10} color='white'/></div>:
      <div className='mt-6  '>
       {data.map((e,i)=>{
           return(
             <div key={i} className='w-full border-b border-gray-700 header p-2 mt-2 '>
             <div className='flex items-center'>
               <p className='text-blue-500 '>{e.name}</p> 
               <p className=' ml-4 text-xs'>({new Date(e.timestamp).toLocaleString()})</p> 
               </div>  
             <ReactStars
                size={15}
                half={true}
                value={e.rating}
                edit={false}
             /> 
             <p>{e.thought}</p> 
             </div>
                
           )
       }) }
      </div>
    }
  </div>
  )
}

export default Reviews

