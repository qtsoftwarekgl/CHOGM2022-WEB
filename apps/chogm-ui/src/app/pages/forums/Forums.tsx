import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import { useForumsQuery } from '../../generated/graphql';
import { Loader } from '../../components/Loader';
import Stars from '../../components/Stars';
import Reviews from '../../components/Reviews';
import NoData from '../../components/NoData';
import AuditInfo from '../../components/AuditInfo';
import Status from '../../components/Status';
import { useMutation } from '@apollo/client';
import { UPDATE_FORUM } from './mutation';
import { QUERY_FORUMS } from './query';
import { notifySuccess } from '../../utils';

export default function Forums() {
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

	const { data, error, loading } = useForumsQuery();

	const [updateForum, { loading: updateLoading }] = useMutation(UPDATE_FORUM, {
		refetchQueries: [
			{
				query: QUERY_FORUMS
			}
		],
		onCompleted: (data) => {
			if (data) notifySuccess("Forum has been updated!");
		},
		onError(err) {
			console.log(err);
		}
	});

	const toggleStatus = (id: string, state: boolean) => {
		const forum = {
			forumId: id,
			state: !state
		};

		updateForum({ variables: { forum } });
	}

	if (loading) return <Loader loading={loading}/>

	return (
		<div className="flex flex-col space-y-3">
			<div className="flex items-center justify-between">
				<h3>Events</h3>
				<div>
					<button className="text-white bg-indigo-500 btn hover:bg-indigo-600" onClick={() => routeChange('create')}>
						<svg className="w-4 h-4 opacity-50 fill-current shrink-0" viewBox="0 0 16 16">
							<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
						</svg>
						<span className="ml-2 xs:block">Create Event</span>
					</button>     
				</div>
			</div>

			{!!data && data.forums.length === 0 && (<NoData />)}

			{!!data && data.forums.length > 0 && (
				<div className="w-full">
					<div className="w-full p-2 mx-auto bg-white rounded-2xl">
						{data.forums.map((forum, index) => (
							<Disclosure key={index}>
								{({ open }) => (
									<>
										<Disclosure.Button className="flex justify-between w-full px-4 py-6 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg forum-item hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
											<span className="flex flex-col">
												<span className="flex items-center gap-3 text-2xl font-semibold">
													{forum.name}
													<span className="flex">
														<span className="cursor-pointer" role="img" aria-label="edit" onClick={() => onEdit(forum.id)}>
															<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
																<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
																<path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
															</svg>
														</span>

														<span className="cursor-pointer" onClick={() => toggleStatus(forum.id, forum.state)}>
															<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
																<path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
															</svg>
														</span>
													</span>
												</span>
												<span className=""><Status state={forum.state} /></span>
											</span>
											<ChevronUpIcon
												className={`${
													open ? 'rotate-180 transform' : ''
												} h-5 w-5 text-purple-500`}
											/>
										</Disclosure.Button>
										<Disclosure.Panel className="pt-4 pb-2 text-sm text-gray-500">
											<div className="flex flex-col space-y-2">
												<div className="md:shrink-0">
													<img src={forum.thumbnail} alt="Forum thumbnail" style={{ width: '300px', height: 'auto'}} />
												</div>
												<div dangerouslySetInnerHTML={{ __html: forum.description }}></div>
												<Stars rate={forum?.rating?.rate} reviews={forum?.rating?.rating} />
												{forum?.rating?.rating?.length > 0 && (
													<>
														<div className="mt-2">
															<p onClick={() => showReviews(forum?.rating?.rating)} className="text-sm text-blue-400 cursor-pointer hover:underline">See all reviews</p>
														</div>
														<Reviews isOpen={isOpen} closeModal={closeModal} ratings={ratings}/>
													</>
												)}

												<AuditInfo createdBy={forum.createdBy} updatedBy={forum.updatedBy} />
											</div>
										</Disclosure.Panel>
									</>
								)}
							</Disclosure>
						))}
					</div>
				</div>
			)}
		</div>
	)
}