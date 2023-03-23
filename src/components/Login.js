import React, { useContext, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { query,where,getDocs} from 'firebase/firestore';
import { userRef } from '../firebase/firebase';
import bcrypt from 'bcryptjs';
import {Appstate} from '../App';
const Login = () => {
  const navigate = useNavigate();
  const useAppstate = useContext(Appstate);  
  const [form,setForm]=useState({
        mobile:'',
        Password:''
    });
    const [loading,setLoading]=useState(false);
    const login = async ()=>{
      setLoading(true);
      try {
        const quer = query(userRef,where('mobile','==',form.mobile)) 
        const querySnapshot= await getDocs(quer);
        querySnapshot.forEach((doc)=>{
         const _data = doc.data();
         const isUser = bcrypt.compareSync(form.Password,_data.Password);
         if(isUser){
           useAppstate.setLogin(true);
           useAppstate.setuserName(_data.name);
           swal({
            title: "Logged In",
            icon:'success',
            buttons:false,
            timer:3000
           })
           navigate('/')
         }else{
          swal({
            title: 'Invalid Credentials',
            icon:'error',
            buttons:false,
            timer:3000
           })
         }
      })
      
      } catch (error) {
        swal({
          title: error.message,
          icon:'error',
          buttons:false,
          timer:3000
         })
        
      }
      setLoading(false);
     }
    return (
    <div className='w-full flex flex-col mt-6 justify-center items-center'>  
       <h1 className='text-2xl font-bold'>Login</h1>
       <div className="p-2  w-full md:w-1/3">
          <div className="relative">
            <label htmlFor="email" className="leading-7 text-sm text-white">Mobile No.</label>
            <input type={Number} id="email" name="email" value={form.mobile} onChange={(e)=>setForm({...form,mobile:e.target.value})}  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div> 
       <div className="p-2 w-full md:w-1/3">
          <div className="relative">
            <label htmlFor="email" className="leading-7 text-sm text-white">Password</label>
            <input type="text" id="email" name="email" value={form.Password} onChange={(e)=>setForm({...form,Password:e.target.value})}  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div> 
       
        <button onClick={login} className="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg mt-4">{loading?<TailSpin height={25} color='white'/>:'Login'}</button> 
        <div className='mt-4'>
           <p>Do not have account?<Link to={'/signup'}><span className='text-blue-500 ml-1'>Signup</span></Link></p>
        </div>
    </div>
  )
}

export default Login
