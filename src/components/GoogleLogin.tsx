import React, { useEffect, FC, useState, useRef, useMemo, useCallback } from 'react';
import PropType from 'prop-types';
import useWindowSize from '../hooks/useWindowSize';

type SignInResponse = {
	credential: string;
	clientId: string;
	client_id: string;
	select_by: 'btn' | 'user';
};
interface IGoogleLoginProps {
	className?: string;
	clientId: string;
	onSignIn: (response: SignInResponse) => void;
	options?: RenderButtonOptions;
	setLoading?: (loading: boolean) => void;
	showOneTapDialog?: boolean;
}

type RenderButtonOptions = {
	width?: number;
	size?: 'small' | 'medium' | 'large';
	theme?: 'outline' | 'filled' | 'filled_blue' | 'standard';
	height?: number;
};

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

	const divRef = useRef<HTMLDivElement>(null);

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
			reconciledOptions.width = divRef.current?.clientWidth;
		}

		return reconciledOptions;
	}, [options, divRef.current?.clientWidth]);

	const promptOneTapDialog = useCallback((google: any) => {
		google?.accounts.id.prompt((notification: any) => {
			if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
				document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
				google.accounts.id.prompt();
			}
		});
	}, []);

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

			google?.accounts.id.renderButton(divRef.current, googleOptions);

			setLoading?.(true);

			if (showOneTapDialog) promptOneTapDialog(google);
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
	}, [
		googleOptions,
		clientId,
		scriptLoaded,
		onSignIn,
		setLoading,
		showOneTapDialog,
		promptOneTapDialog,
	]);

	useEffect(() => {
		if (!scriptLoaded || !windowSize?.width) return;
		const google = (window as any)?.google;
		if (!google) return;

		google?.accounts.id.renderButton(divRef.current, googleOptions);

		if (showOneTapDialog) promptOneTapDialog(google);
	}, [
		scriptLoaded,
		windowSize,
		googleOptions,
		showOneTapDialog,
		divRef.current,
		promptOneTapDialog,
	]);

	return <div ref={divRef} className={className} />;
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
