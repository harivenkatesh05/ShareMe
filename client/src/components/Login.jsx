import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logowhite.png'
import shareVideo from '../assets/share.mp4'
import useScript from '../hooks/UseScript';
import {client} from '../client.js'

function decodeJwtResponse(token) {
	let base64Url = token.split('.')[1]
	let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	return JSON.parse(jsonPayload)
}


export const Login = () => {
	const [isScriptLoaded, setLoaded] = useState(true);
	useScript("https://accounts.google.com/gsi/client", true, (res) => setLoaded(true), () => setLoaded(false))
	const navigate = useNavigate();

	window.HandleCredentialResponse = (response) => {
		// decodeJwtResponse() is a custom function defined by you
		// to decode the credential response.
	
		const responsePayload = decodeJwtResponse(response.credential);
		localStorage.setItem('user', JSON.stringify(responsePayload));
	
		const doc = {
			_id: responsePayload.sub,
			_type: 'user',
			userName: responsePayload.given_name,
			image: responsePayload.picture
		}
	
		client.createIfNotExists(doc)
			.then(() => {
				navigate('/', {replace: true});
			})
	}
	
	return (
		<div className='flex justify-start items-center flex-col h-screen'>
			<div className='relative w-full h-full'>
				<video
					src={shareVideo}
					type="video/mp4"
					loop
					controls={false}
					muted
					autoPlay
					className='w-full h-full object-cover'
				/>		

				<div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
					<div className='p-5'>
						<img src={logo} width="130px" alt="logo"/>
					</div>

				{isScriptLoaded ?
					<div>
						<div id="g_id_onload"
							data-client_id={process.env.REACT_APP_GOOGLE_API_TOKEN}
							data-callback="HandleCredentialResponse">
						</div>
						<div className="g_id_signin" data-type="standard"></div>
					</div>
					:
					<div className='text-red-600'>
						Unable to download Google script 
					</div>
				}
				</div>	
			</div>
		</div>
	)
}
