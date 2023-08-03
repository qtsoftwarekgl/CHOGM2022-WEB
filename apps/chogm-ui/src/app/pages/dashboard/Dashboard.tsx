import React, { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';
import WelcomeBanner from '../../components/WelcomeBanner';
import { useCmsStatsQuery } from '../../generated/graphql';
import Stat from './Stat';

export default function Dashboard() {
	const [ womenData, setWomen] = useState<any>(null);
	const [ businessData, setBusiness] = useState<any>(null);
	const [ peopleData, setPeople] = useState<any>(null);
	const [ youthData, setYouth] = useState<any>(null);
	const [ chogmData, setChogm] = useState<any>(null);

	const { data , loading } = useCmsStatsQuery();


	useEffect(() => {
		if (data?.cmsStats) {
			setChogm(data.cmsStats.chogm);
			setWomen(data.cmsStats.women)
			setBusiness(data.cmsStats.business)
			setPeople(data.cmsStats.people);
			setYouth(data.cmsStats.youth);
		}
	}, [data?.cmsStats]);

	if (loading) return <Loader loading={loading}/>

	return (
		<div className="flex flex-col">
			<WelcomeBanner />
			<Stat label={"CHOGM 2022"} data={chogmData} />
			<Stat label={"Women's Forum"} data={womenData} />
			<Stat label={"Youth's Forum"} data={youthData} />
			<Stat label={"Business Forum"} data={businessData} />
			<Stat label={"People's Forum"} data={peopleData} />
			
		</div>
	)
}