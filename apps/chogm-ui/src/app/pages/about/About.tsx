import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { ECMSTypes, EUserRole } from '../../enums';
import { useCmsByCategoryQuery } from '../../generated/graphql';
import NoData from '../../components/NoData';
import AuditInfo from '../../components/AuditInfo';

export default function About() {
	const tabs = ['About', 'ComSec', 'Privacy Policy', 'Toll Number'];
	const [selectedTab, setSelectedTab] = useState<string>('About');
	const [role, setRole] = useState<any>(null);
	const navigate = useNavigate();
	const routeChange = (url: string) => {
		navigate(url);
	}
	
	useEffect(() => {
		if (localStorage.getItem('role')) {
			setRole(localStorage.getItem('role'));
		}
	}, []);
	
	const onEdit = (cat: string, id: string) => navigate(`${cat}/${id}`);

	const [data, setData] = useState<any[]>();
	const [filtered, setFiltered] = useState<any[]>();

	const about: any = { category: ECMSTypes.ABOUT_CONFERENCE };
	const comsec: any = { category: ECMSTypes.COMSEC };
	const privacy: any = { category: ECMSTypes.PRIVACY_POLICY };
	const toll: any = { category: ECMSTypes.TOLL_NUMBER };

	const { data: aboutData, loading: al } = useCmsByCategoryQuery({ variables: { category: about }});
	const { data: comsecData, loading: cl } = useCmsByCategoryQuery({ variables: { category: comsec }});
	const { data: privacyData, loading: pl } = useCmsByCategoryQuery({ variables: { category: privacy } });
	const { data: tollData } = useCmsByCategoryQuery({ variables: { category: toll } });

	useEffect(() => {
		if (!aboutData) return;
		if (!comsecData) return;
		if (!privacyData) return;
		if (!tollData) return;
		const data: any = [...aboutData.cmsByCategory, ...comsecData.cmsByCategory, ...privacyData.cmsByCategory, ...tollData.cmsByCategory];
		setData(data);

		let x;
		if (data.length > 0) {
			if (selectedTab === 'About') {
				x = data.filter((d: any) => d.category === ECMSTypes.ABOUT_CONFERENCE);
			}

			if (selectedTab === 'ComSec') {
				x = data.filter((d: any) => d.category === ECMSTypes.COMSEC);
			}

			if (selectedTab === 'Privacy Policy') {
				x = data.filter((d: any) => d.category === ECMSTypes.PRIVACY_POLICY);
			}

			if (selectedTab === 'Toll Number') {
				x = data.filter((d: any) => d.category === ECMSTypes.TOLL_NUMBER);
			}

			setFiltered(x);
		}
	}, [aboutData, comsecData, privacyData, tollData, selectedTab]);

	if (al || cl || pl) return <Loader loading={(al || cl || pl)} />

	return (
		<div className="flex flex-col space-y-3">
			{(!!data && data.length === 0 || !data || filtered?.length === 0) && (
				<div className="flex items-center justify-between">
					<h3>About</h3>
					{(role && role === EUserRole.ADMIN || role === EUserRole.COMS) && (	
						<div>
							<button className="text-white bg-indigo-500 btn hover:bg-indigo-600" onClick={() => routeChange('create')}>
								<svg className="w-4 h-4 opacity-50 fill-current shrink-0" viewBox="0 0 16 16">
										<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
								</svg>
								<span className="ml-2 xs:block">Add Content</span>
							</button>
						</div>
					)}
				</div>
			)}

			{data && data.length > 0 && (
				<div className="inline-flex mx-auto my-3 bg-gray-100 rounded-lg bg-opacity-30">
					{tabs.map((tab: any, index: number) => (
						<button
							onClick={() => setSelectedTab(tab)}
							key={index}
							className={`py-[10px] sm:py-2 my-1 px-[12px] sm:px-6 inline-flex items-center justify-center font-medium border border-gray-50 text-center focus:bg-primary text-sm sm:text-base capitalize bg-white ${(index === tabs.length - 1) && '!rounded-r-lg'} ${(index === 0) && '!rounded-l-lg'} ${tab === selectedTab && 'border-slate-800 bg-slate-800 text-white'}`}
						>
							{tab}
						</button>
					))}
				</div>
			)}

			{(data?.length === 0 || filtered?.length === 0) && (<NoData/>)}

			<div className="flex flex-col">
				{!!filtered && filtered?.map((content, index) => (
					<div className="flex flex-col px-4 py-6 space-y-3 bg-white rounded-md" key={index}>
						<div className="flex flex-row justify-between">
							<h3 className="font-semibold">{content?.name}</h3>
							{(role && role === EUserRole.ADMIN || role === EUserRole.COMS) && (
								<div className="cursor-pointer" role="img" aria-label="edit" onClick={() => onEdit(content.category, content.id)}>
									<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
										<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
										<path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
									</svg>
								</div>
							)}
						</div>
						<div className="border border-gray-100"></div>
						<div className="text-sm" dangerouslySetInnerHTML={{ __html: content?.description }}></div>
						<AuditInfo createdBy={content.createdBy} updatedBy={content.updatedBy} />
					</div>
				))}
			</div>
		</div>
	)
}