import { useNavigate } from "react-router-dom";
import AuditInfo from "../../components/AuditInfo";
import { Loader } from "../../components/Loader";
import NoData from "../../components/NoData";
import ReadMore from "../../components/ReadMore";
import Status from "../../components/Status";
import { ECMSTypes } from "../../enums";
import { useCmsByCategoryQuery } from "../../generated/graphql";
import { notifySuccess } from "../../utils";
import { useMutation } from '@apollo/client';
import { UPDATE_CMS } from "../update/mutation";
import { GET_CMS } from "../about/query";

export default function FAQ() {
	const navigate = useNavigate();
	const routeChange = (url: string) => {
		navigate(url);
	}

	const onEdit = (cat: string, id: string) => navigate(`${cat}/${id}`);

	const category: any = { category: ECMSTypes.QA }

	const { data, loading } = useCmsByCategoryQuery({ variables: { category } });

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
				query: GET_CMS, variables: { category }
			}
		],
		onCompleted: (data: any) => {
			notifySuccess('FAQ has been updated!');
		},
		onError(err) { console.log(err) }
	});

	if (loading) return <Loader loading={loading} />

	return (
		<div className="flex flex-col space-y-3">
			<div className="flex items-center justify-between">
				<h3>Frequently Asked Questions</h3>
				<div>
					<button className="text-white bg-indigo-500 btn hover:bg-indigo-600" onClick={() => routeChange('create')}>
						<svg className="w-4 h-4 opacity-50 fill-current shrink-0" viewBox="0 0 16 16">
								<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
						</svg>
						<span className="ml-2 xs:block">Add content</span>
					</button>     
				</div>
			</div>

			{!!data && data.cmsByCategory.length === 0 && (<NoData />)}

			{!!data && data.cmsByCategory.length > 0 && (
				<div className="md:grid md:grid-cols-3 md:gap-6">
					<div className="mt-5 md:mt-0 md:col-span-3">
						<div className="grid grid-cols-6 gap-6">
							{data.cmsByCategory?.length > 0 && data.cmsByCategory.map((qa, index) => (
								<div className="col-span-6 sm:col-span-2" key={index}>
									<div className="w-full p-6 mx-auto bg-white rounded-lg">
										<div className="flex justify-between">
											<h1 className="text-xl font-medium">{qa?.name}</h1>
											<div className="flex">
												<div className="cursor-pointer" role="img" aria-label="edit" onClick={() => onEdit(qa.category, qa.id)}>
													<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
														<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
														<path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
													</svg>
												</div>
												<div className="ml-2 cursor-pointer" onClick={() => toggleStatus(qa.id, qa.state)}>
													<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
														<path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
													</svg>
												</div>
											</div>
										</div>
										<p className="text-xs font-medium text-indigo-400 uppercase">
											{qa?.qaType?.replace(/_+/g, ' ')}
										</p>
										<div className="mt-1"><Status state={qa.state} /></div>
										<ReadMore text={qa?.description} size={300} />
										<AuditInfo createdBy={qa.createdBy} updatedBy={qa.updatedBy} />
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