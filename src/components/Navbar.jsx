import React from 'react'
import logo from './../../public/logo3.jpg';

const Navbar = () => {
  return (
    <div className='w-full h-[15vh] flex justify-between px-10 bg-gray-500'>
        <div className='logo h-[15vh] flex items-center gap-3 '>
            <img className='w-[5vw] rounded-full' src={logo} alt="" />
            <h1 className='text-2xl font-black'>THE ULTIMATE SONGS</h1>
        </div>
        <div className='search gap-3 w-[30%] h-[15vh] flex items-center justify-center '>
        <i className="  text-white text-2xl ri-search-2-line"></i>
            <input className=' bg-black rounded-md p-3 text-white border-none outline-none w-[80%] h-[10vh]' placeholder='Search Song' type="search" name="" id=""  />
        </div>
    </div>
  )
}

export default Navbar