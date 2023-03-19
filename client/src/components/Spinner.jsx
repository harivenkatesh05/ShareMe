import React from 'react'
import {Circles} from 'react-loader-spinner';

function Spinner({message}) {
	return (
		<div className='flex flex-col justify-center items-center w-full h-full'>
			<Circles
				width={200}
				height={50}
				className="m-5"
				color='#00BFFF'
			/>
			{message && <p className='text-lg p-3 text-center'>{message}</p>}
		</div>
	)
}

export default Spinner 