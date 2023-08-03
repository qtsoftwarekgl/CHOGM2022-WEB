import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuditInfo from "../../components/AuditInfo";
import { Loader } from "../../components/Loader";
import NoData from "../../components/NoData";
import { ECMSTypes } from "../../enums";
import { useCmsByCategoryQuery } from "../../generated/graphql";
import { useMutation } from '@apollo/client';
import { UPDATE_CMS } from "../update/mutation";
import { GET_CMS } from "../about/query";
import { notifySuccess } from "../../utils";
import Status from "../../components/Status";

export default function VisitRwanda() {
	const navigate = useNavigate();
	const routeChange = () => {
		navigate('create');
	}

	const onEdit = (cat: string, id: string) => navigate(`${cat}/${id}`);

	const [data, setData] = useState<any[]>();
	const transitVisa: any = { category: ECMSTypes.TRANSIT_VISA };
	const visaOnArrival: any = { category: ECMSTypes.VISA_ON_ARRIVAL };
	const visitorsVisa: any = { category: ECMSTypes.VISITORS_VISA };

	const toggleStatus = (id: string, state: boolean) => {
		const content: any = {
			cmsId: id,
			state: !state
		}

		updateCms({ variables: { content } });
	}

	const [updateCms, { loading: updateLoading }] = useMutation(UPDATE_CMS, {
		refetchQueries: [
			{
				query: GET_CMS, variables: { category: transitVisa }
			},
			{
				query: GET_CMS, variables: { category: visaOnArrival }
			},
			{
				query: GET_CMS, variables: { category: visitorsVisa }
			},
		],
		onCompleted: (data: any) => {
			notifySuccess('information Centre has been updated!');
		},
		onError(err) { console.log(err) }
	});

	// eslint-disable-next-line prefer-const
	let { data: transitVisaData, loading: tl } = useCmsByCategoryQuery({
		variables: { category: transitVisa },
		onError(err: any) {console.log(err)}
	});
	const { data: visaOnArrivalData, loading: val } = useCmsByCategoryQuery({ variables: { category: visaOnArrival } });
	const { data: visitorsVisaData, loading: vvl } = useCmsByCategoryQuery({ variables: { category: visitorsVisa } });

	useEffect(() => {
		if (!!transitVisaData && !!visaOnArrivalData && !!visitorsVisaData) {
			const data: any = [...transitVisaData.cmsByCategory, ...visaOnArrivalData.cmsByCategory, ...visitorsVisaData.cmsByCategory];
			setData(data);
		};
	}, [tl, transitVisaData, val, visaOnArrivalData, visitorsVisaData, vvl]);

	if (tl || val || vvl) return <Loader loading={(tl || val || vvl)} />;

	return (
		<div className="flex flex-col space-y-3">
			<div className="flex items-center justify-between">
				<h3>Visit Rwanda</h3>
				<div>
					<button className="text-white bg-indigo-500 btn hover:bg-indigo-600" onClick={routeChange}>
						<svg className="w-4 h-4 opacity-50 fill-current shrink-0" viewBox="0 0 16 16">
								<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
						</svg>
						<span className="ml-2 xs:block">Add content</span>
					</button>     
				</div>
			</div>

			{!!data && data.length === 0 && (<NoData />)}

			{!!data && data.length > 0 && (
				<div className="mt-3 md:grid md:grid-cols-3 md:gap-6">
					<div className="mt-5 md:mt-0 md:col-span-3">
						<div className="grid grid-cols-6 gap-2">
							{data.map((info, index) => (
								<div className="col-span-6 sm:col-span-6" key={index}>
									<div className="flex flex-col-reverse p-4 bg-white rounded-lg shadow-md md:flex-col" key={index}>
										<div className="flex flex-row justify-between">
											<h3 className="text-xl font-bold">{info?.name}</h3>
											<div className="flex">
												<div className="cursor-pointer" role="img" aria-label="edit" onClick={() => onEdit(info.category, info.id)}>
													<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
														<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
														<path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
													</svg>
												</div>
							
												<div className="ml-2 cursor-pointer" onClick={() => toggleStatus(info.id, info.state)}>
													<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
														<path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
													</svg>
												</div>
											</div>
										</div>
										<div className="mt-1"><Status state={info.state} /></div>
										<div className="mt-2 mb-2 border border-gray-100"></div>
										<div className="text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: info?.description }}></div>
										<AuditInfo createdBy={info.createdBy} updatedBy={info.updatedBy} />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}