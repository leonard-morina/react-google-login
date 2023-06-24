import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleLogin } from '../';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<div>
			<GoogleLogin
				clientId='demo'
				onSignIn={(res) => {
					console.log('res', res);
				}}
			/>
		</div>
		<hr />
	</React.StrictMode>,
);
