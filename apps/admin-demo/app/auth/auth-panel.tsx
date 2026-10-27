import Image from 'next/image';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Decorative split panel: abstract SVG shapes follow semantic tokens; the official mark uses the
 * same asset as the rest of the demo.
 */
export function AuthPanel() {
	return (
		<div aria-hidden="true" className="demo-auth-panel">
			<svg
				className="demo-auth-panel__canvas"
				preserveAspectRatio="xMidYMid slice"
				viewBox="0 0 400 480"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<linearGradient id="demo-auth-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
						<stop offset="0%" stopColor="var(--ads-color-primary)" stopOpacity="0.35" />
						<stop offset="100%" stopColor="var(--ads-color-primary)" stopOpacity="0.08" />
					</linearGradient>
				</defs>
				<rect fill="url(#demo-auth-gradient)" height="480" width="400" />
				<circle className="demo-auth-panel__orb demo-auth-panel__orb--one" cx="88" cy="96" r="72" />
				<circle
					className="demo-auth-panel__orb demo-auth-panel__orb--two"
					cx="312"
					cy="360"
					r="96"
				/>
				<path
					className="demo-auth-panel__wave"
					d="M0 320 C120 260 200 380 400 300 L400 480 L0 480 Z"
				/>
			</svg>
			<div className="demo-auth-panel__brand">
				<Image alt="" height={64} priority src={`${basePath}/icon.svg`} width={64} />
				<p className="demo-auth-panel__tagline">Admin Design System</p>
			</div>
		</div>
	);
}
