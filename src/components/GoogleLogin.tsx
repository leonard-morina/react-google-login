import React, { useEffect, FC, useState, useRef } from 'react';
import PropType from 'prop-types';

interface IGoogleLoginProps {
	className?: string;
	clientId: string;
	onSignIn: (googleUser: any) => void;
}

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

const GoogleLogin: FC<IGoogleLoginProps> = ({ className, clientId, onSignIn }) => {
	const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!window || scriptLoaded) return;
		const google = (window as any).google;

		const initializeGsi = () => {
			const google = (window as any).google;
			if (!google?.accounts || scriptLoaded) return;

			setScriptLoaded(true);
			google?.accounts?.id.initialize({
				client_id: clientId,
				callback: onSignIn,
			});

			google?.accounts.id.renderButton(
				buttonRef.current,
				{
					theme: 'outline',
					size: 'large',
				}, // customization attributes
			);

			// google?.accounts.id.prompt(); // also display the One Tap dialog
		};

		const scriptExists = document.querySelector(`script[src="${SCRIPT_SRC}"]`);

		if (!scriptExists) {
			const script = document.createElement('script');
			script.src = SCRIPT_SRC;
			script.onload = initializeGsi;
			script.async = true;
			script.id = 'google-client-script';
			document.querySelector('body')?.appendChild(script);
		}

		return () => {
			// Cleanup function that runs when component unmounts
			if (google && google?.accounts) {
				google?.accounts?.id?.cancel();
				document.getElementById('google-client-script')?.remove();
			}
		};
	}, [window, clientId, scriptLoaded, onSignIn]);

	return <button ref={buttonRef} type='button' className={className} />;
};

GoogleLogin.defaultProps = {
	className: '',
};

GoogleLogin.propTypes = {
	className: PropType.string,
};

export default GoogleLogin;
