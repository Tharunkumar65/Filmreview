import React, { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import app from '../firebase/firebase';
import swal from 'sweetalert';
import { addDoc } from 'firebase/firestore';
import { userRef } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
const Signup = () => {
   const navigate=useNavigate();
    const [form,setForm]=useState({
        Name:'',
        mobile:'',
        Password:''
    });
    const [loading,setLoading]=useState(false);
    const[otpSent,setOtpSent]=useState(false);
    const[OTP,setOTP]=useState('');
    const auth = getAuth(app);
    const generateRecaptcha=()=>{
     window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
     'size': 'invisible',
    'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    
      }
    }, auth);
    }
     const requestOtp=()=>{
      setLoading(true);
      generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth,`+91${form.mobile}`,appVerifier)
      .then(confirmationResult=>{
        window.confirmationResult = confirmationResult;
      swal({ 
        text:"OTP sent",
        icon:"success",
        buttons:false,
        timer:3000,
      });
      setOtpSent(true);
      setLoading(false);
      }).catch((error)=>{
        console.log(error)
      })
     }
     const uploadData= async()=>{
       const salt =bcrypt.genSaltSync(10);
       var hash = bcrypt.hashSync(form.Password,salt);  
      await addDoc(userRef,{
          name:form.Name,
          Password:hash,
          mobile:form.mobile 

        });
     }
     const verifyOTP =()=>{
        try {
          setLoading(true);
          window.confirmationResult.confirm(OTP).then((result)=>{
           uploadData();
            swal({
              text:'Successfully Registered',
              icon:'success',
              buttons:false,
              timer:3000,
            });
            navigate('/login');
            setLoading(false);
          })
        } catch (error) {
            console.log(error);
        }
     }
  return (
    <div className='w-full flex flex-col mt-6 justify-center items-center'>
       <h1 className='text-2xl font-bold'>Signup</h1>
       {otpSent? 
       <>
        <div className="p-2  w-full md:w-1/3">
        <div className="relative">
          <label htmlFor="email" className="leading-7 text-sm text-white">OTP</label>
          <input  id="email" name="email" value={OTP} onChange={(e)=>setOTP(e.target.value)}  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
        </div>
      </div> 
      <button onClick={verifyOTP} className="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg mt-4">{loading?<TailSpin height={25} color='white'/>:'Confirm OTP'}</button> 
       </>
        :
        <>
       <div className="p-2 w-full md:w-1/3">
          <div className="relative">
            <label htmlFor="email" className="leading-7 text-sm text-white">Name</label>
            <input type="text" id="email" name="email" value={form.Name} onChange={(e)=>setForm({...form,Name:e.target.value})}  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div> 
       <div className="p-2  w-full md:w-1/3">
          <div className="relative">
            <label htmlFor="email" className="leading-7 text-sm text-white">Mobile No.</label>
            <input type={Number} id="email" name="email" value={form.mobile} onChange={(e)=>setForm({...form,mobile:e.target.value})}  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div> 
       <div className="p-2 w-full md:w-1/3">
          <div className="relative">
            <label htmlFor="email" className="leading-7 text-sm text-white">Password</label>
            <input type={'password'} id="email" name="email" value={form.Password} onChange={(e)=>setForm({...form,Password:e.target.value})}  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div> 
       
        <button onClick={requestOtp} className="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg mt-4">{loading?<TailSpin height={25} color='white'/>:'Request OTP'}</button> 
        </>}
        <div className='mt-4'>
           <p> Already have an account?<Link to={'/login'}><span className='text-blue-500 ml-1'>Login</span></Link></p>
        </div>
        <div id='recaptcha-container'>

        </div>
    </div>
  )
}

export default Signup