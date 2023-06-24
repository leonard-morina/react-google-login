import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleLogin } from '@leonard-morina/react-google-login';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<div>
			<h2>Default counter</h2>
			<GoogleLogin clientId='demo' />
		</div>
		<hr />
	</React.StrictMode>,
);
