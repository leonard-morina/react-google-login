import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleLogin } from '../';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<div>
			<GoogleLogin
				clientId='752116776790-i10f3c209g0p86k1om6lug7hiskp6ap1.apps.googleusercontent.com'
				onSignIn={(res) => {
					console.log('res', res);
				}}
			/>
		</div>
		<hr />
	</React.StrictMode>,
);
