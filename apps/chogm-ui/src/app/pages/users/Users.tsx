/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../../../assets/img/avatar-placeholder.webp';
import { Loader } from '../../components/Loader';
import NoData from '../../components/NoData';
// import Reviews from '../../components/Reviews';
// import Stars from '../../components/Stars';
import Status from '../../components/Status';
import { useUserSearchLazyQuery, useUsersQuery } from '../../generated/graphql';
import { humanRole, notifySuccess, paginate } from '../../utils';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from './mutation';
import { QUERY_USERS, SEARCH_USER } from './query';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import classNames from "classnames";
import { Pagination as PaginationHeadLess } from 'react-headless-pagination';
// import AuditInfo from '../../components/AuditInfo';

function Users() {
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

	const [limit, setLimit] = useState(10);
	const [skip, setSkip] = useState(0);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [query, setQuery] = useState<string>('');
	const [users, setUsers] = useState<any[]>([]);

	const handlePageChange = (page: number) => {
		setSkip(page);
	};

	const { data, error, loading } = useUsersQuery({
		variables: {
			limit,
			skip
	 	}
	});

	useEffect(() => {
		if (data) {
			setTotalPages(paginate(data.usersCount).totalPages);
		}
	}, [data?.usersCount]);
	
	const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
		refetchQueries: query?.trim() !== '' ? [
			{ query: SEARCH_USER, variables: { query } }
		] : [
			{
				query: QUERY_USERS, variables: { limit: 10, skip }
			}
		],
		onCompleted: (data) => {
			if (data) notifySuccess("User has been updated!");
		},
		onError(err) {
			console.log(err);
		}
	});

	const toggleStatus = (id: string, state: boolean) => {
		const user = {
			userId: id,
			state: !state
		};

		updateUser({ variables: { user } });
	}

	const [getUsers, { data: usersData }] = useUserSearchLazyQuery({ variables: { query } });

	const onSearch = (e: any) => {
		setQuery(e.target.value);
		getUsers();
	}

	useEffect(() => {
		if (query.trim() === '') {
			if (data?.users) setUsers(data.users);
		} else {
			if (usersData?.usersSearch) setUsers(usersData.usersSearch);
		}
	}, [data?.users, query, usersData?.usersSearch]);
	
	if (loading) {
		return <Loader loading={loading}/>
	}
	
	return (
		<div className="flex flex-col space-y-3">
			<div className="flex items-center justify-between">
				<h3>Users</h3>
				<div className="flex space-x-2">
					<div className="relative text-gray-600">
							<span className="absolute inset-y-0 left-0 flex items-center pl-2">
								<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
									viewBox="0 0 24 24" className="w-6 h-6 text-gray-300">
									<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
								</svg>
							</span>
							<input
								type="search"
								className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm md:w-64 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								name="search"
								placeholder="Search"
								required
								value={query}
								onChange={onSearch}
							/>
						</div>
					<div>
						<button className="text-white bg-indigo-500 btn hover:bg-indigo-600" onClick={() => routeChange('create')}>
							<svg className="w-4 h-4 opacity-50 fill-current shrink-0" viewBox="0 0 16 16">
									<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
							</svg>
							<span className="ml-2 xs:block">Create user</span>
						</button>     
					</div>
				</div>
			</div>

			{!!users && users?.length === 0 && (<NoData />)}

			{!!users && users?.length > 0 && (
				<div className="overflow-x-auto">
					<div className="inline-block min-w-full">
						<div className="overflow-hidden border-b border-gray-200 rounded-md shadow-md">
							<table className="min-w-full overflow-x-scroll divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
											Name
										</th>
										<th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
											Role
										</th>
										<th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
											Status
										</th>
										{/* <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
											Audit
										</th> */}
										<th scope="col" className="relative px-6 py-3">
											<span className="sr-only">Edit</span>
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{users.map((user, index) => (
										<tr className="transition-all hover:bg-gray-100 hover:shadow-lg" key={index}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="flex-shrink-0 w-10 h-10">
														<img className="w-10 h-10 rounded-full" src={user.avatar !== '' && user.avatar !== null ? user.avatar : avatar} alt="Avatar" />
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-900">{ user.lastName } { user.firstName}</div>
														<div className="text-sm text-gray-500">{user.email}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{humanRole(user.role[0])}</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<Status state={user.state}/>
											</td>
											{/* <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
												<Stars rate={user?.rating?.rate} reviews={user?.rating?.rating} />
											
												{user?.rating?.rate > 0 && (
													<>
														<div className="mt-2">
															<p onClick={() => showReviews(user?.rating?.rating)} className="text-sm text-blue-400 cursor-pointer hover:underline">See all reviews</p>
														</div>
														<Reviews isOpen={isOpen} closeModal={closeModal} ratings={ratings}/>
													</>
												)}
												<AuditInfo createdBy={user.createdBy} updatedBy={user.updatedBy}/>
											</td> */}
											<td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
												<div className="flex">
													<div className="cursor-pointer" role="img" aria-label="edit" onClick={() => onEdit(user.id)}>
														<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
															<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
															<path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
														</svg>
													</div>
													<div className="ml-2 cursor-pointer" onClick={() => toggleStatus(user.id, user.state)}>
														<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
															<path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
														</svg>
													</div>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{query === '' && (
							<div className="flex items-center px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
								<PaginationHeadLess
									currentPage={skip}
									setCurrentPage={handlePageChange}
									totalPages={totalPages}
									edgePageCount={2}
									middlePagesSiblingCount={2}
									className="flex items-center w-full h-10 text-sm select-none"
									truncableText="..."
									truncableClassName="w-10 px-0.5 text-center"
									>
									<PaginationHeadLess.PrevButton
										className={classNames(
											"h-10 font-medium flex items-center mr-2 text-gray-500 hover:text-indigo-600 focus:outline-none", {
												"cursor-pointer": skip !== 0,
												"opacity-50": skip === 0
											}
										)}
									>
										<FiArrowLeft size={20} className="mr-3" />
										Previous
									</PaginationHeadLess.PrevButton>

									<div className="flex items-center justify-center flex-grow">
										<PaginationHeadLess.PageButton
										activeClassName="text-indigo-600 border-indigo-500 bg-indigo-50 p-2"
										inactiveClassName="text-gray-500"
										className="flex items-center justify-center w-10 h-10 font-medium rounded-full cursor-pointer"
										/>
									</div>

									<PaginationHeadLess.NextButton
										className={classNames(
											"h-10 font-medium flex items-center mr-2 text-gray-500 hover:text-indigo-600 focus:outline-none", {
												"cursor-pointer": skip !== totalPages - 1,
												"opacity-50": skip === totalPages - 1
											}
										)}
									>
										Next
										<FiArrowRight size={20} className="ml-3" />
									</PaginationHeadLess.NextButton>
								</PaginationHeadLess>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default Users