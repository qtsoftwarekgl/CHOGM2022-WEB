import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuditInfo from '../../components/AuditInfo';
import { Loader } from '../../components/Loader';
import NoData from '../../components/NoData';
import ReadMore from '../../components/ReadMore';
import Reviews from '../../components/Reviews';
import Stars from '../../components/Stars';
import Status from '../../components/Status';
import { formatDate, notifySuccess, getTime } from '../../utils';
import { useMutation } from '@apollo/client';
import { UPDATE_PROGRAMME } from './mutation';
import { QUERY_PROGRAMMES } from './query';
import { useProgrammesQuery } from '../../generated/graphql';

function Programmes() {
	const navigate = useNavigate();
	const routeChange = (url: string) => {
		navigate(url);
	}

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [ratings, setRatings] = useState<any>();
		const showReviews = (e: any) => {
		setIsOpen(true);
		setRatings(e);
	}
	const closeModal = (e: boolean) => setIsOpen(e);

	const onEdit = (id: string) => navigate(id);

	const { data, error, loading } = useProgrammesQuery();
	
	const [updateProgram, { loading: updateLoading }] = useMutation(UPDATE_PROGRAMME, {
		refetchQueries: [
			{
				query: QUERY_PROGRAMMES
			}
		],
		onCompleted: (data) => {
			if (data) notifySuccess("Programme has been updated!");
		},
		onError(err) {
			console.log(err);
		}
	});

	const toggleStatus = (id: string, state: boolean) => {
		const program = {
			programmeId: id,
			state: !state
		}

		updateProgram({ variables: { program } });
	}

	if (loading) {
		return <Loader loading={loading}/>
	}

	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between">
				<h3>Programmes</h3>
				<div>
					<button className="text-white bg-indigo-500 btn hover:bg-indigo-600" onClick={() => routeChange('create')}>
						<svg className="w-4 h-4 opacity-50 fill-current shrink-0" viewBox="0 0 16 16">
								<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
						</svg>
						<span className="ml-2 xs:block">Add program</span>
					</button>
				</div>
			</div>

			{!!data && data.programmes?.length === 0 && (<NoData />)}

			{!!data?.programmes && data.programmes?.length > 0 && (
				<div className="mt-3 md:grid md:grid-cols-3 md:gap-6">
					<div className="mt-5 md:mt-0 md:col-span-3">
						<div className="grid grid-cols-6 gap-3">
							{data.programmes?.map((pg, index) => (
								<div className="col-span-6 sm:col-span-2" key={index}>
									<div aria-label="card" className="w-full px-6 pt-6 pb-3 bg-white rounded shadow focus:outline-none lg:mr-7 lg:mb-0 mb-7" key={index}>
										<div className="pb-2 border-b border-gray-200">
											<div className="flex items-center">
												<div className="flex items-start justify-between w-full">
													<div className="w-full">
														<p className="text-lg font-medium leading-5 text-gray-800 focus:outline-none">{pg.title}</p>
														{pg.broadcastLink && <a rel="noopener noreferrer external" href={pg.broadcastLink} className="pt-2 text-sm leading-normal text-blue-500 cursor-pointer hover:underline" target="_blank">Broadcast link</a>}
													</div>
													<div className="flex">
														<div className="cursor-pointer" role="img" aria-label="edit" onClick={() => onEdit(pg.id)}>
															<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
																<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
																<path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
															</svg>
														</div>
														<div className="ml-2 cursor-pointer" onClick={() => toggleStatus(pg.id, pg.state)}>
															<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
																<path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
															</svg>
														</div>
													</div>
												</div>
											</div>
											<div className="mt-1"><Status state={pg.state} /></div>
										</div>

										<div className="flex flex-col mt-2 focus:outline-none">
											<div className="flex flex-row mb-2">
												<p className="mr-2 text-sm font-medium">Forum:</p> { pg.forum.name ? (<p className="text-sm">{pg.forum.name}</p>) : 'N/A' }
											</div>
											<div className="flex flex-row mb-2">
												<p className="mr-2 text-sm font-medium">Room:</p> { pg?.room?.name ? (<p className="text-sm">{pg?.room?.name}, {pg.room?.venue?.name}</p>) : 'N/A' }
											</div>
											<div className="flex flex-row mb-2">
												<p className="mr-2 text-sm font-medium">Date:</p> { pg.startDate && pg.endDate ? (<p className="text-sm">{`${formatDate.format(new Date(pg.startDate))} - ${getTime.format(new Date(pg.endDate))}`}</p>) : 'N/A' }
											</div>
										</div>
										
										<div className="">
											<ReadMore text={pg.description} />
										</div>

										<Stars rate={pg?.rating?.rate} reviews={pg?.rating?.rating} />
										{pg?.rating?.rating?.length > 0 && (
											<>
												<div className="mt-2">
													<p onClick={() => showReviews(pg?.rating?.rating)} className="text-sm text-blue-400 cursor-pointer hover:underline">See all reviews</p>
												</div>
												<Reviews isOpen={isOpen} closeModal={closeModal} ratings={ratings}/>
											</>
										)}

										<AuditInfo createdBy={pg.createdBy} updatedBy={pg.updatedBy}/>
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

export default Programmes;