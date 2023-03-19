import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { client } from '../client.js';
import { feedQuery, searchQuery } from '../utils/data.js';
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
				console.log(data)
				setPins(data)
				setLoading(false);
			})
		}
		else {
			const query = feedQuery()
			client.fetch(query).then((data) => {
				console.log(data)
				setPins(data)	
				setLoading(false);
			})
		}
	}, [categoryId])

	if(loading) return (<Spinner message={`We are adding new ideas to your feed!`}/>)

	return (
		<div></div>
	)
}

export default Feed