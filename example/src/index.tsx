import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleLogin } from '@leonardmorina/react-google-login';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<div>
			<GoogleLogin clientId='demo' />
		</div>
		<hr />
	</React.StrictMode>,
);
