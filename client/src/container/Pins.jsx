import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CreatePin, Feed, Navbar } from '../components'

function Pins({user}) {
	const [searchTerm, setSearchTerm] = useState("")
	return (
		<div className='px-2 md:px-5'>
			<div className='bg-gray-50'>
				<Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>
			</div>
			<div className='h-full'>
				<Routes>
					<Route path="/" element={<Feed />}></Route>
					<Route path="/category/:categoryId" element={<Feed />} />
					<Route path="/create-pin" element={<CreatePin user={user}/>}></Route>
				</Routes>
			</div>
		</div>
	)
}

export default Pins