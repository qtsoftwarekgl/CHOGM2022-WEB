import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { venueCategories } from '../../@data';
import AuditInfo from '../../components/AuditInfo';
import { Loader } from '../../components/Loader';
import NoData from '../../components/NoData';
import Reviews from '../../components/Reviews';
import Select from '../../components/Select';
import Stars from '../../components/Stars';
import Status from '../../components/Status';
import { useVenuesQuery } from '../../generated/graphql';
import { useMutation } from '@apollo/client';
import { UPDATE_VENUE } from './mutation';
import { QUERY_VENUES } from './query';
import { notifySuccess } from '../../utils';
import { EVenueType } from '../../enums';

export default function Venues() {
	const [venues, setVenues] = useState<any[]>([]);
	const [filteredVenues, setFilteredVenues] = useState<any[]>([]);
	const [ratings, setRatings] = useState<any>();
	const [selectedVenue, setSelectecVenue] = useState<any>(null);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const showReviews = (e: any) => {
		setIsOpen(true);
		setRatings(e);
	}
	const closeModal = (e: boolean) => setIsOpen(e);

	const navigate = useNavigate();
	const routeChange = (url: string) => {
		navigate(url);
	}

	const onEdit = (id: string) => navigate(id);

	const toggleStatus = (id: string, state: boolean) => {
		const venue = {
			venueId: id,
			state: !state
		};

		updateVenue({ variables: { venue } });
	}

	const [updateVenue, { loading: updateLoading }] = useMutation(UPDATE_VENUE, {
		refetchQueries: [
			{
				query: QUERY_VENUES
			}
		],
		onCompleted: (data) => {
			if (data) notifySuccess("Venue has been updated!");
		},
		onError(err) {
			console.log(err);
		}
	});

	const { data, error, loading } = useVenuesQuery();

	useEffect(() => {
		if (data) {
			setVenues(data.venues);
			setFilteredVenues(data.venues);
		}
	}, [data]);

	const receiveVenue = (e: any) => {
		setSelectecVenue(e);
		const filtered: any[] = venues.filter((vn: any) => vn.venueCategory === e.value);
		setFilteredVenues(filtered);
	};

	const showRanking = (e: EVenueType): boolean => {
		return e === EVenueType.HOTEL_APARTMENT_VENUE || 
		e === EVenueType.EVENT_VENUE || 
		e === EVenueType.RESTAURANT_VENUE || 
		e === EVenueType.COFFEE_SHOP_VENUE
	}

	if (loading) {
		return <Loader loading={loading} />;
	}
	
	return (
		<div className="flex flex-col space-y-3">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold">Venues</h3>
				<div>
					<button className="text-white bg-indigo-500 btn hover:bg-indigo-600" onClick={() => routeChange('create')}>
						<svg className="w-4 h-4 opacity-50 fill-current shrink-0" viewBox="0 0 16 16">
							<path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
						</svg>
						<span className="ml-2 xs:block">Create venue</span>
					</button>     
				</div>
			</div>

			<div className="flex mb-3">
				<div className="w-1/4">
					<Select presetValue={selectedVenue} label="Filter:" items={venueCategories} sendData={receiveVenue} />
				</div>
			</div>

			{(filteredVenues.length === 0) && (<NoData />)}

			{(filteredVenues?.length > 0) && (
				<div className="md:grid md:grid-cols-3 md:gap-6">
					<div className="mt-5 md:mt-0 md:col-span-3">
						<div className="grid grid-cols-6 gap-6">
							{filteredVenues.map((venue, index) => (
								<div className="col-span-6 sm:col-span-2" key={index}>
									<div className="overflow-hidden bg-white border rounded-lg">
										<img src={venue.thumbnail} alt="venue" style={{ height: '250px', width: '100%' }}/>
										<div className="p-4">
											<div className="flex justify-between">
												<div className="text-lg font-semibold leading-tight truncate">
													{ venue.name }
													{ showRanking(venue.venueCategory) && venue?.venueInfo?.hotelRanking && (` (${venue.venueInfo.hotelRanking !== 11 ? venue.venueInfo.hotelRanking : 'Other' })`)}
												</div>
												<div className="flex">
													<div className="cursor-pointer" role="img" aria-label="edit" onClick={() => onEdit(venue.id)}>
														<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
															<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
															<path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
														</svg>
													</div>
													<div className="ml-2 cursor-pointer" onClick={() => toggleStatus(venue.id, venue.state)}>
														<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
															<path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
														</svg>
													</div>
												</div>
											</div>
											<div className="mt-1"><Status state={venue.state} /></div>
											{venue.shortDescription && (	
												<div className="mt-2 text-xs tracking-wide text-gray-600 font-regular">
													{ venue.shortDescription}
												</div>
											)}
											{venue?.venueInfo?.locationLink ? (
												<div className="mt-1">
													<a target="_blank" className="text-sm text-blue-400" href={venue?.venueInfo?.locationLink} rel="noreferrer">See directions</a>
												</div>
											) : (<div><p className="text-sm text-blue-400">No direction link</p></div> )}
											
											<Stars rate={venue?.rating?.rate} reviews={venue?.rating?.rating} />
											
											{venue?.rating?.rate > 0 && (
												<>
													<div className="mt-2">
														<p onClick={() => showReviews(venue?.rating?.rating)} className="text-sm text-blue-400 cursor-pointer hover:underline">See all reviews</p>
													</div>
													<Reviews isOpen={isOpen} closeModal={closeModal} ratings={ratings}/>
												</>
											)}

											<AuditInfo createdBy={venue.createdBy} updatedBy={venue.updatedBy} />
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	)
};