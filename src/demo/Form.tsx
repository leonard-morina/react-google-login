import React, { useState } from 'react';
import GoogleLogin from '../components/GoogleLogin';

const DemoForm = () => {
	const [value, setValue] = useState<string>('');
	return (
		<>
			<input type='text' value={value} onChange={(e) => setValue(e.target.value)} />
			<GoogleLogin
				className='md:w-4/6 w-full mb-4 mx-auto' // flex justif-y-center items-center //
				clientId='demo'
				options={{
					height: 55,
					theme: 'outline',
				}}
				showOneTapDialog
				onSignIn={(res) => {
					console.log('here', res);
				}}
			/>
		</>
	);
};

export default DemoForm;
