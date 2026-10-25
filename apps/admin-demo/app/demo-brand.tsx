import Image from 'next/image';

/** Official symbol; the text supplies its accessible name. */
export function DemoBrand({ compact = false }: { compact?: boolean }) {
	return (
		<div
			className={compact ? 'demo-brand-heading demo-brand-heading--compact' : 'demo-brand-heading'}
		>
			<Image
				src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icon.svg`}
				alt=""
				width={30}
				height={30}
				priority
			/>
			<strong className="ads-admin-shell-sidebar-label">Admin DS</strong>
		</div>
	);
}
