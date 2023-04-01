import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { client } from '../client.js';
import { feedQuery, searchQuery } from '../utils/data.js';
import MasonaryLayout from './MasonaryLayout.jsx';
import Spinner from './Spinner.jsx';

function Feed() {
	const [loading, setLoading] = useState(false);
	const [pins, setPins] = useState(null);
	const { categoryId } = useParams();

	useEffect(() => {
		setLoading(true);

		if(categoryId) {
			const query = searchQuery(categoryId)

			client.fetch(query).then((data) => {
				setPins(data)
				setLoading(false);
			})
		}
		else {
			const query = feedQuery()
			client.fetch(query).then((data) => {
				setPins(data)	
				setLoading(false);
			})
		}
	}, [categoryId])

	const content = categoryId || 'new'
	if(loading) return (<Spinner message={`We are adding ${content} ideas to your feed!`}/>)

	console.log("ada", pins)
	return (
		<div>
			{pins && !!pins.length ? <MasonaryLayout pins={pins}/> : 
				<p className='p-5 py-10 text-bold text-gray-500 w-full justify-center items-center flex'>
					No Pins are in this category. Sorry!!!
				</p>}
		</div>
	)
}

export default Feed