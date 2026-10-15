import { overviewActivity, overviewIndicators, overviewProgress } from '../../lib/data/overview';
import { OverviewContent } from './overview-content';

export default function OverviewPage() {
	return (
		<OverviewContent
			activity={overviewActivity}
			indicators={overviewIndicators}
			progress={overviewProgress}
		/>
	);
}
