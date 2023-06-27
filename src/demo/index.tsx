import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoForm from './Form';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<div>
			<DemoForm />
		</div>
		<hr />
	</React.StrictMode>,
);
