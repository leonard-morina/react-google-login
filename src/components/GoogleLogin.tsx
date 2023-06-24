import React, { useEffect, FC, useState } from 'react';
import PropType from 'prop-types';

interface IGoogleLoginProps {
	className?: string;
	clientId: string;
	onSignIn: (googleUser: any) => void;
}
const GoogleLogin: FC<IGoogleLoginProps> = ({ className, clientId, onSignIn }) => {
	const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (scriptLoaded) return;
		const google = (window as any).google;

		const initializeGsi = () => {
			if (!google || scriptLoaded || !google.accounts) return;

			setScriptLoaded(true);
			google?.accounts?.id.initialize({
				client_id: clientId,
				callback: onSignIn,
			});

			google?.accounts.id.renderButton(
				document.getElementById('id2'),
				{
					theme: 'outline',
					size: 'large',
					text: 'haha',
					buttonText: 'haha',
					longtitle: true,
				}, // customization attributes
			);

			google?.accounts.id.prompt(); // also display the One Tap dialog
		};

		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.onload = initializeGsi;
		script.async = true;
		script.id = 'google-client-script';
		document.querySelector('body')?.appendChild(script);

		return () => {
			// Cleanup function that runs when component unmounts
			if (google && google?.accounts) {
				google?.accounts?.id?.cancel();
				document.getElementById('google-client-script')?.remove();
			}
		};
	}, [clientId, scriptLoaded, onSignIn]);

	return <button type='button' className={className} />;
};

GoogleLogin.defaultProps = {
	className: '',
};

GoogleLogin.propTypes = {
	className: PropType.string,
};

export default GoogleLogin;
