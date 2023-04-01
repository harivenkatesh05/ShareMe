import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import  Spinner from './Spinner'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import { client, urlFor } from '../client'
import { MdDownloadForOffline } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid';
import MasonaryLayout from './MasonaryLayout'

function PinDetail({user}) {
	const [pinDetail, setPinDetail] = useState(null);
	const [comment, setComment] = useState('');
	const [pins, setPins] = useState(null);
	const [addingComment, setAddingComment] = useState(false);


	const { pinId } = useParams();
	const fetchPinDetails = () => {
		const query = pinDetailQuery(pinId)
		client.fetch(`${query}`)
			.then((data) => {
				console.log(data);

				if(data.length > 0) {
					const pin = data[0]
					setPinDetail(pin)
					const recommendation = pinDetailMorePinQuery(pin);

					client.fetch(recommendation)
						.then((res) => setPins(res))
				}
			})
	}

	const addComment = () => {
		if (comment) {
			setAddingComment(true);
	  
			client
				.patch(pinId)
				.setIfMissing({ comments: [] })
				.insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
				.commit()
				.then(() => {
					fetchPinDetails();
					setComment('');
					setAddingComment(false);
				});
		  }
	}

	useEffect(() => {
		fetchPinDetails()
	}, [pinId])

	if(!pinDetail) return <Spinner message={"Loading pin details..."}></Spinner>

	return (
		<>
			{
				pinDetail && (
					<div className='flex flex-col xl:flex-row bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
						<div className='flex justify-center items-center md:items-start flex-initial pt-3'>
							<img className='rounded-t-3xl rounded-b-lg w-full xl:max-h-fit xl:object-fill' style={{height: "-webkit-fill-available"}} src={(urlFor(pinDetail.image.assets.url).width(250).url())}></img>
						</div>
						<div className='w-full p-5 flex-1 xl:min-w-620'>
							<div className='flex flex-row justify-between'>
								<a
									href={`${pinDetail?.image?.assets?.url}?dl=`}
									download
									onClick={(e) => e.stopPropagation()}
									className='bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100'	
								>
									<MdDownloadForOffline></MdDownloadForOffline>
								</a>
								<a
									href={pinDetail.destination}
									target="_blank"
									rel="noreferrer"
									className='bg-secondaryColor flex items-center gap-2 text-black font-blod p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
								>
									<div className='overflow-hidden text-ellipsis max-w-xs'>{pinDetail.destination}</div>
								</a>
							</div>
							<div className='gap-4 flex flex-col mt-3'>
								<h1 className='text-4xl font-bold break-words mt-3'>
									{pinDetail.title}
								</h1>
								<p className='text-mg'>{pinDetail.about}</p>
								<Link
									to={`/user-profile/${pinDetail.postedBy?._id}`}
									className="flex gap-2 mt-2 items-center"
								>
									<img
										className="w-8 h-8 rounded-full object-cover"
										src={pinDetail.postedBy?.image}
										alt="user-profile"
									/>
									<p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
								</Link>
							</div>
							<h3 className='mt-5 text-xl'>Comments</h3>
							<div className="max-h-370 overflow-y-auto">
								{pinDetail?.comments?.map((item) => (
									<div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.comment}>
										<img
											src={item.postedBy?.image}
											className="w-10 h-10 rounded-full cursor-pointer"
											alt="user-profile"
										/>
										<div className="flex flex-col">
											<p className="font-bold">{item.postedBy?.userName}</p>
											<p>{item.comment}</p>
										</div>
									</div>
								))}
							</div>
							<div className="flex flex-wrap mt-6 gap-3">
								<Link to={`/user-profile/${user._id}`}>
									<img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
								</Link>
								<input
									className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
									type="text"
									placeholder="Add a comment"
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>
								<button
									type="button"
									className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
									onClick={addComment}
								>
									{addingComment ? 'Doing...' : 'Done'}
								</button>
							</div>
						</div>
					</div>
				)
			}
			{pins?.length > 0 && (
				<h2 className="text-center font-bold text-2xl mt-8 mb-4">
				More like this
				</h2>
			)}
			{pins ? (
				<MasonaryLayout pins={pins} />
			) : (
				<Spinner message="Loading more pins" />
			)}
		</>
  	);
}

export default PinDetail