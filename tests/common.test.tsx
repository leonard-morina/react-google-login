import * as React from 'react';
import { render } from '@testing-library/react';

import 'jest-canvas-mock';

import { GoogleLogin } from '../src';

describe('Common render', () => {
	it('renders without crashing', () => {
		render(
			<GoogleLogin
				clientId='demo'
				onSignIn={(user) => {
					console.log('user', user);
				}}
			/>,
		);
	});
});
