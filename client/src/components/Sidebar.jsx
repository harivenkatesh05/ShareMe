import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import { RiHomeFill } from 'react-icons/ri';

const isActiveClassName = 'flex flex-row item-center px-5 gap-3 font-extrabold border-back  border-r-2 border-black transition-all duration-200 ease-in-out capitalize'
const isNotActiveClassName = 'flex flex-row item-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
const categories = [
    {name: "Animals"},
    {name: "Wallapapers"},
    {name: "Photography"},
    {name: "Gaming"},
    {name: "Coding"}
]

function Sidebar({user, closeToggle}) {
    const handleCloseSidebar = () => { 
        if(closeToggle) {
            closeToggle(false)
        }
    }

  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
        <div className='flex flex-col'>
            <Link
                to="/"
                onClick={handleCloseSidebar}
                className="flex px-5 gap-2 items-center w-190 pt-1 my-6"
            >
                <img src={logo} alt="logo" className='w-28'></img>
            </Link>
            <div className='flex flex-col gap-3'>
                <NavLink 
                    to="/"
                    className={({isActive}) => isActive ? isActiveClassName : isNotActiveClassName}
                    onClick={handleCloseSidebar}
                >
                    <RiHomeFill/>Home
                </NavLink>
                <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover cateogries</h3>
                {categories.map((category) => (
                    <NavLink
                        to={`/category/${category.name}`}
                        className={({isActive}) => isActive ? isActiveClassName : isNotActiveClassName}
                        key={category.name}
                        onClick={handleCloseSidebar}
                    >
                        {category.name}
                    </NavLink>
                ))}
            </div>
        </div>
        {user && (
            <Link
                to={`user-profile/${user._id}`}
                className="flex flex-row my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
                onClick={handleCloseSidebar}
            >
                <img src={user.image}></img>
                <p>{user.userName}</p>
            </Link>
        )}
    </div>
  )
}

export default Sidebar