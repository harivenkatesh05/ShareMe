import React, { useEffect, useState } from 'react'
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonaryLayout from './MasonaryLayout';
import Spinner from './Spinner';

function Search({searchTerm}) {
	const [pins, setPins] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (searchTerm !== '') {
			setLoading(true);
			const query = searchQuery(searchTerm.toLowerCase());
			client.fetch(query).then((data) => {
				setPins(data);
				setLoading(false);
			});
		} else {
			const query = feedQuery();
			client.fetch(query).then((data) => {
				setPins(data);
				setLoading(false);
			});
		}
	}, [searchTerm]);

	return (
		<div>
			{loading && <Spinner message={"Searching pins"}/>}
			{pins?.length > 0 && <MasonaryLayout pins={pins} />}
			{pins?.length == 0 && searchTerm !== '' && !loading && (
				<div className="mt-10 text-center text-xl ">No Pins Found!</div>
			)}
		</div>
	)	
}

export default Search