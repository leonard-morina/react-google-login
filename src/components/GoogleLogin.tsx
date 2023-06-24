import React, { useEffect, FC, useState, useRef, useMemo } from 'react';
import PropType from 'prop-types';
import useWindowSize from '../hooks/useWindowSize';

interface IGoogleLoginProps {
	className?: string;
	clientId: string;
	onSignIn: (googleUser: any) => void;
	options?: object;
	setLoading?: (loading: boolean) => void;
	showOneTapDialog?: boolean;
}

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

const GoogleLogin: FC<IGoogleLoginProps> = ({
	className,
	clientId,
	onSignIn,
	options,
	setLoading,
	showOneTapDialog,
}) => {
	const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
	const windowSize = useWindowSize();

	const buttonRef = useRef<HTMLButtonElement>(null);

	const googleOptions = useMemo(() => {
		let reconciledOptions = {} as any;
		if (options) {
			reconciledOptions = { ...options };
		} else {
			reconciledOptions = {
				size: 'large',
			};
		}

		if (!reconciledOptions?.width) {
			reconciledOptions.width = buttonRef.current?.clientWidth;
		}

		return reconciledOptions;
	}, [options, buttonRef.current?.clientWidth]);

	useEffect(() => {
		if (!window || scriptLoaded) return;
		const google = (window as any)?.google;

		const initializeGsi = () => {
			const google = (window as any)?.google;
			if (!google?.accounts || scriptLoaded) return;

			setScriptLoaded(true);

			google?.accounts?.id.initialize({
				client_id: clientId,
				callback: onSignIn,
			});

			google?.accounts.id.renderButton(buttonRef.current, googleOptions);

			setLoading?.(true);

			if (showOneTapDialog) google?.accounts.id.prompt(); // also display the One Tap dialog
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
	}, [googleOptions, clientId, scriptLoaded, onSignIn, setLoading, showOneTapDialog]);

	useEffect(() => {
		if (!scriptLoaded || !windowSize?.width) return;
		const google = (window as any)?.google;
		if (!google) return;

		google?.accounts.id.renderButton(buttonRef.current, googleOptions);
	}, [scriptLoaded, windowSize, googleOptions]);

	return <button ref={buttonRef} type='button' className={className} />;
};

GoogleLogin.defaultProps = {
	className: '',
	clientId: '',
	options: undefined,
	setLoading: undefined,
	showOneTapDialog: false,
};

GoogleLogin.propTypes = {
	clientId: PropType.string.isRequired,
	className: PropType.string,
	options: PropType.object,
	setLoading: PropType.func,
	showOneTapDialog: PropType.bool,
};

export default GoogleLogin;
