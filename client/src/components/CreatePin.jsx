import React, { useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { client } from '../client';
import Spinner from './Spinner'
import {MdDelete} from 'react-icons/md'
import { categories } from '../utils/data';
import { useNavigate } from 'react-router-dom';

function CreatePin({user}) {
	const [loading, setLoading] = useState(false)
	const [imageAsset, setImageAsset] = useState(null);
	const [title, setTitle] = useState('');
	const [about, setAbout] = useState('');
	const [destination, setDestination] = useState('');
	const [category, setCategory] = useState('')
	const [errorIndicator, setErrorIndicator] = useState(false);

	const navigate = useNavigate();

	const uploadImage = (e) => {
		if(!e.target.files.length) return
		
		console.log(e.target.files[0])
		const {name, type} = e.target.files[0]
		
		setLoading(true);
		client.assets
			.upload('image', e.target.files[0], {contentType: type, filename:name})
			.then((document) => {
				console.log(document);
				setLoading(false);
				setImageAsset(document)
			})
			.catch((e) => {
				console.log("Something went wrong :", e);
			})
		console.log(name, type);
	}

	const savePin = () => {
		if(title && about && destination && imageAsset?._id && category) {
			const doc = {
				_type: 'pin',
				title,
				about,
				destination,
				image: {
					_type: 'image',
					assets: {
						_type: 'reference',
						_ref: imageAsset?._id
					}
				},
				userId: user._id,
				postedBy: {
					_type: 'postedBy',
					_ref: user._id
				},
				category
			}

			client.create(doc)
				.then((document) => {
					console.log(document);
					navigate('/');
				})
		}
		else {
			setErrorIndicator(true);

			setTimeout(() => {
				setErrorIndicator(false)
			}, 3000)
		}
	}

	return (
		<div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
			{errorIndicator && <p className='text-red-400 mb-3 absolute top-20 transition-all duration-250 ease-in text-xl'>Please fill all the fields</p>}
			<div className='w-full p-3 bg-secondaryColor'>
				<div className='border-gray-300 border-dotted border-2 justify-center items-center flex flex-col w-full h-420'>
					{loading ? <Spinner message={"Uploading..."}/> :
						!imageAsset ? (
							<label>
								<div className='flex flex-col items-center justify-center h-full'>
									<div className='flex flex-col justify-center items-center'>
										<p className='text-2xl font-bold'>
											<AiOutlineCloudUpload />
										</p>
										<p className='text-lg'>Click to Upload</p>
									</div>
									<p className='text-gray-400 mt-24'>Use high quality JPG, SVG, PNG, GIF less than 20MB</p>
								</div>
								<input
									type="file"
									className='w-0 h-0'
									name="upload-image"
									accept="image/*"
									onChange={uploadImage}
								/>
							</label>
						) : (
							<div className='h-full relative p-3'>
								<img src={imageAsset.url} alt="uploaded image" className='w-full h-full'/>
								<button
									type="button"
									onClick={() => setImageAsset(null)}
									className="absolute bottom-6 right-6 p-3 rounded-full bg-white cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
								>
									<MdDelete></MdDelete>
								</button>
							</div>
					)}
				</div>
			</div>
			<div className='flex flex-col flex-1 gap-6 w-full lg:pl-5 mt-10'>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Add your title here"
					className='outline-none text-base sm:text-lg border-b-2 p-2 border-gray-200'
				/>
				<input
					type="text"
					value={about}
					onChange={(e) => setAbout(e.target.value)}
					placeholder="What is your pin about"
					className='outline-none text-base sm:text-lg border-b-2 p-2 border-gray-200'
				/>
				<input
					type="text"
					value={destination}
					onChange={(e) => setDestination(e.target.value)}
					placeholder="Add a destination here"
					className='outline-none text-base sm:text-lg border-b-2 p-2 border-gray-200'
				/>
				<div>
					<p className='text-base mb-2 font-semibold text:lg sm:text-xl'>Choose Pin Category</p>
					<select
						onChange={(e) => {
							setCategory(e.target.value);
						}}
						className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
					>
						<option value="other" className='text-gray-400 sm:text-bg bg-white'>Select Category</option>
						{categories.map((item) => (
							<option value={item.name} key={item.name}>
								{item.name}
							</option>
						))}
					</select>
				</div>

				<div className='flex justify-end items-end mt-1'>
					<button
						onClick={savePin}
						className="bg-red-500 text-white rounded-full p-2 w-28 outline-none"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	)
}

export default CreatePin