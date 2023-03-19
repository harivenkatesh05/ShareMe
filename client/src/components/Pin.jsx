import React, { useState } from 'react'
import { client, urlFor } from '../client'
import { Link, useNavigate } from 'react-router-dom'
import { MdDownloadForOffline } from 'react-icons/md';
import { fetchUser } from '../utils/fetchUser';
import { v4 as uuidv4 } from 'uuid';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { AiTwotoneDelete } from 'react-icons/ai';

function Pin({ pin : {postedBy, image, _id, destination, save}}) {
	const [postHover, setPostHover] = useState(false)
	// const [savingPost, setSavingPost]

	const user = fetchUser()
	const navigate = useNavigate();

	const alreadySaved = !!save?.filter((item) => item.postedBy._id === user.sub)?.length

	const savePin = (id) => {
		if(!alreadySaved) {
			client
				.patch(id)
				.setIfMissing({save: []})
				.insert('after', 'save[-1]', [{
					_key: uuidv4(),
					userID: user.sub,
					postedBy: {
						_type: 'postedBy',
						_ref: user.sub
					}
				}])
				.commit()
				.then(() => {
					window.location.reload()
				})
		}
	}

	const deletePost = (id) => {
		client
			.delete(id)
			.then(() => {
				window.location.reload();
			});
	}

    return (
        <div className='m-2'>
			<div 
				onMouseEnter={() => setPostHover(true)}
				onMouseLeave={() => setPostHover(false)}
				onClick={() => navigate(`/pin-detail/${_id}`)}
				className=" relative cursor-zoom-in w-auto hover:shadow-xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
			>
				<img className='rounded-lg w-full' src={(urlFor(image.assets.url).width(250).url())}></img>
				{postHover && (
					<div className='absolute top-0 w-full flex flex-col justify-between p-2 z-5 h-full'> 
						<div className='flex items-center justify-between'>
							<div className='flex gap-2'>
								<a
									href={`${image?.assets?.url}?dl=`}
									download
									onClick={(e) => e.stopPropagation()}
									className='bg-white w-9 h-9 rounded-full p-2 flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'	
								>
									<MdDownloadForOffline></MdDownloadForOffline>
								</a>
							</div>
							{alreadySaved ? (
								<button className='bg-red-500 rounded-3xl text-white opcaity-70 hover:opacity-100 font-bold px-5 py-1 text-base hover:shadow-md outline-none'>
									{save?.length} Saved
								</button>
							): (
								<button 
									className='bg-red-500 rounded-3xl text-white opcaity-70 hover:opacity-100 font-bold px-5 py-1 text-base hover:shadow-md outline-none'
									onClick={(e) => {
										savePin(_id)
										e.stopPropagation();
									}}
								>
									Save
								</button>
							)}
						</div>
						<div className=' flex justify-between items-center gap-2'>
							{destination && (
								<a
									href={destination}
									target="_blank"
									rel="noreferrer"
									className='bg-white flex items-center gap-2 text-black font-blod p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md w-2/3'
								>
									<BsFillArrowUpRightCircleFill className='w-1/5 h-5'/>	
									<div className='overflow-hidden text-ellipsis'>{destination}</div>
								</a>
							)}
							{postedBy?._id === user.sub && (
								<button
									onClick={(e) => {
										e.stopPropagation()
										deletePost(_id)
									}}
									className='bg-white rounded-full cursor-pointer p-2 opacity-70 hover:opacity-100 hover:shadow-md items-center justify-center text-dark'
								>
									<AiTwotoneDelete />
								</button>
							)}
						</div>


					</div>
				)}
			</div>
			<Link
				to={`/user-profile/${postedBy?._id}`}
				className="flex gap-2 mt-2 items-center"
			>
				<img
					className="w-8 h-8 rounded-full object-cover"
					src={postedBy?.image}
					alt="user-profile"
				/>
				<p className="font-semibold capitalize">{postedBy?.userName}</p>
			</Link>
        </div>
    )
}

export default Pin