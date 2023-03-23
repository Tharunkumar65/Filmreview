import React, { useContext } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Appstate } from '../App';

const Header = () => {
 
  const useAppstate= useContext(Appstate);

  return (
    <div className='sticky z-10 top-0 header text-3xl flex justify-between items-center font-serif p-4'>
    <Link to={'/'}><span> Film<span className='text-red-700'>review</span></span></Link>  
    {useAppstate.login?
     <Link to={'/addmovie'}><h2 className='text-lg cursor-pointer flex items-center '>
     <Button><AddIcon className='mr-1'/>Add New</Button>
     </h2></Link> 
     :
     <Link to={'/login'}><h2 className='text-lg cursor-pointer bg-green-500 flex items-center '>
     <Button><span className='text-white font-medium capitalize'>login</span></Button>
     </h2></Link> 
    }
    </div>
  )
}

export default Header
