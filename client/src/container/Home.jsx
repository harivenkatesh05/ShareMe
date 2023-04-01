import React, { useEffect, useState } from 'react'
import { Sidebar, UserProfile } from '../components'
import { HiMenu } from 'react-icons/hi'
import { Link, Route, Routes } from 'react-router-dom'
import logo from '../assets/logo.png'
import { userQuery } from '../utils/data'
import { client } from '../client'
import { AiFillCloseCircle } from 'react-icons/ai'
import Pins from './Pins'
import { fetchUser } from '../utils/fetchUser'


function Home() {
	const [toggleSidebar, setToggleSidebar] = useState(false)
	const [user, setUser] = useState({})

	const userInfo = fetchUser()

	useEffect(() => {
		const query = userQuery(userInfo?.sub)

		client.fetch(query).then((data) => {
			console.log(data)
			setUser(data[0]);
		})
	}, [])

	return (
		<div className='flex bg-gray-50 md:flex-row flex-col h-screen'>
			<div className='hidden md:flex h-screen flex-initial'>
				<Sidebar user={user}/>
			</div>
			<div className='flex flex-row md:hidden'>
				<div className='p-2 flex justify-between w-full flex-row item-center shadow-md'>
					<HiMenu onClick={() => setToggleSidebar(true)}></HiMenu>
					<Link to="/">
						<img src={logo} alt="logo" className='w-28'></img>
					</Link>
					<Link to={`user-profile/${user?._id}`}>
						<img src={user?.image} className='w-8 h-8 rounded-xl'></img>
					</Link>
				</div>
			</div>
			{toggleSidebar && (
				<div className='fixed w-3/4 bg-white h-screen overflow-y-auto shadow-md animate-slide-in'>
					<div className='absolute w-full flex justify-end item-center p-2'>
						<AiFillCloseCircle fontSize={20} className='cursor-pointer' onClick={() => setToggleSidebar(false)}></AiFillCloseCircle>
					</div>
					<Sidebar user={user} closeToggle={setToggleSidebar}></Sidebar>
				</div>
			)}
			<div className='h-screen overflow-y-scroll pb-2 flex-1'>
				<Routes>
					<Route path="/user-profile/:userId" element={<UserProfile></UserProfile>}></Route>
					<Route path="/*" element={<Pins user={user && user}></Pins>}></Route>
				</Routes>
			</div>
		</div>
	)
}

export default Home