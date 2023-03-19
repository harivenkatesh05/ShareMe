import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  IoMdAdd, IoMdSearch } from "react-icons/io";

function Navbar({searchTerm, setSearchTerm, user}) {
    const navigate = useNavigate();
    // if(!user) return null;

    return (
        <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7 px-3'>
            <div className='flex justify-start item-center w-full px-2 bg-white border-none rounded-md outline-none focus-within:shadow-lg'>
                <IoMdSearch fontSize={21} className="ml-1 my-3"></IoMdSearch>
                <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    value={searchTerm}
                    onFocus={() => navigate('/search')}
                    className="w-full p-2 bg-white outline-none"
                />
            </div>
            {user && (
                <div className='flex gap-3'>
                    <Link to={`user-profile/${user._id}`} className="hidden md:block">
                        <img src={user.image} className="w-14 h-12 rounded-lg"></img>
                    </Link>
                    <Link to="create-pin" className='bg-black text-white rounded-lg w-14 h-12 md:w-14 md:h-12 flex justify-center items-center'>
                        <IoMdAdd></IoMdAdd>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Navbar