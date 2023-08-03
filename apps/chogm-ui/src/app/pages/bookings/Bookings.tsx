import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import conditionerIcon from "../../../assets/img/air-conditioner.svg";
import microphoneIcon from "../../../assets/img/microphone.svg";
import projectorIcon from "../../../assets/img/projector.svg";
import { Loader } from "../../components/Loader";
import NoData from "../../components/NoData";
import Select from "../../components/Select";
import { EStatus } from "../../enums";
import { useAvailableRoomsByDateRangeLazyQuery, useBookingsQuery, useRoomsQuery } from "../../generated/graphql";
import { humanRole, notifySuccess } from "../../utils";
import { APPROVE_BOOKING } from "./mutation";
import { QUERY_BOOKINGS } from "./query";
import { BOOKING_REQUEST } from "./subscription";
import roomThumbnail from '../../../assets/img/room.jpg';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { statuses } from '../../@data';

interface ISubData {
	data: IData
}

interface IData {
	bookings: any;
	bookingRequestEvent?: any;
}

export default function Bookings() {
	const [bookings, setBookings] = useState<any[]>([]);
	const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
	const [expandedRows, setExpandedRows] = useState<any[]>([]);
	const [message, setMessage] = useState<string>('');
	const [isDeclined, setIsDeclined] = useState<boolean>(false);
	const [isReassign, setIsReassign] = useState<boolean>(false);
	const [room, setRoom] = useState<any>(null);

	const [updateLoading, setUpdateLoading] = useState<boolean>(false);
	const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
	const [date, setDate] = useState<any>(null);
	const [selectedRoom, setSelectedRoom] = useState<any>(null);
	const [selectedStatus, setSelectedStatus] = useState<any>(null);

	const search = useLocation().search;
  const notificationId = new URLSearchParams(search).get('notification_id');

	const { data, loading, subscribeToMore } = useBookingsQuery();

	const { data: rooms, error } = useRoomsQuery();

	useEffect(() => {
		if (data?.bookings) {
			setBookings(data.bookings);
			setFilteredBookings(data.bookings);
		}
	}, [data?.bookings]);

	// listening to booking requests
	useEffect(() => {
		subscribeToMore({
			document: BOOKING_REQUEST,
			updateQuery: (prev, { subscriptionData }: { subscriptionData: ISubData }) => {
				if (!subscriptionData.data) return prev;

				const newBooking = subscriptionData.data['bookingRequestEvent'];

				return {
					bookings: [...prev.bookings, newBooking].reverse(),
					__typename: prev.__typename
				}
			}
		});
	}, [subscribeToMore]);

	const isExpanded = (row: any) => {
    const idx = expandedRows.find((id: any) => {
      return id === row?.id;
		});
		
    return parseInt(idx) > -1;
	};
	
	const handleExpand = (row: any) => {
		const newExpandedRows = [...expandedRows];
		const idxFound = newExpandedRows?.findIndex(id => id === row?.id);

		if (idxFound > -1) {
			// collapse row details
			setDateRange({ startDate: '', endDate: '' });
			newExpandedRows?.splice(idxFound, 1);
		} else {
			// expanding row details
			setDateRange({ startDate: row?.startDate, endDate: row?.endDate });
			newExpandedRows?.push(row?.id);
		}
		setExpandedRows([...newExpandedRows]);
	};

	useEffect(() => {
		if (notificationId && data?.bookings) {
			const book = data?.bookings?.find(it => it?.id === notificationId);
			handleExpand(book);
		}
	}, [data?.bookings, notificationId]);

	const formatDate = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		hour12: false,
		minute: 'numeric',
		timeZone: 'GMT'
	});

	const dateFormatter = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const getDuration = (date1: any, date2: any) => {
		const d1: any = new Date(date1);
		const d2: any = new Date(date2);

		const dif = Math.abs(d2 - d1);

		if (dif / (1000 * 3600) < 1) return `${(dif / (1000 * 3600)) * 60} ${(dif / (1000 * 3600)) * 60 === 1 ? 'minute' : 'minutes'}`; 

		return `${dif / (1000 * 3600)} ${dif / (1000 * 3600) === 1 ? 'hour' : 'hours'}`;
	};

	const [updateBooking] = useMutation(APPROVE_BOOKING, {
		refetchQueries: [{ query: QUERY_BOOKINGS }],
		onCompleted: (data) => {
			if (data) {
				setIsReassign(false);
				setIsDeclined(false);
				setUpdateLoading(false);
	
				if (data?.status === EStatus.APPROVED) {
					notifySuccess("Booking has been approved");	
				}
				if (data?.status === EStatus.CANCELLED) {
					notifySuccess("Booking has been cancelled");	
				}
				if (data?.status === EStatus.APPROVED_REASSIGNED) {
					notifySuccess("Booking has been reassigned");	
				}
			}
		},
		onError(err) {
			setUpdateLoading(false);
			console.log(err);
		}
	});

	const handleApprove = (id: any) => {
		const booking = {
			bookingId: id,
			status: EStatus.APPROVED
		}

		setUpdateLoading(true);
		updateBooking({ variables: { booking } });
	}

	const [getRooms, { data: roomsData, loading: loadingRooms }] = useAvailableRoomsByDateRangeLazyQuery({ variables: { range: dateRange } });

	const receiveRoom = (e: any) => setRoom(e);

	const handleDecline = (id: any) => {
		const booking = {
			bookingId: id,
			message,
			status: EStatus.CANCELLED
		}

		setUpdateLoading(true);
		updateBooking({ variables: { booking } });
	}

	const onReassign = () => {
		getRooms();
		setIsReassign(true);
	}

	const handleReassign = (id: any) => {
		const booking = {
			bookingId: id,
			status: EStatus.APPROVED_REASSIGNED,
			room: room?.id
		}

		setUpdateLoading(true);
		updateBooking({ variables: { booking } });
	}

	const filterByRoom = (e: any) => {
		setSelectedRoom(e)
		const filtered: any[] = bookings.filter((booking: any) => booking.room.id === e.id);
		setFilteredBookings(filtered);
	}

	const filterByStatus = (e: any) => {
		setSelectedStatus(e);
		const filtered: any[] = bookings.filter((booking: any) => booking.status === e.value);
		setFilteredBookings(filtered);
	}

	useEffect(() => {
		if (selectedRoom && date) {
			const filtered = bookings?.filter((booking: any) => booking.room.id === selectedRoom.id)?.filter(b => isSameDay(new Date(b.startDate), new Date(date)));
			setFilteredBookings(filtered);
			return;
		}

		if (selectedStatus && date) {
			const filtered = bookings.filter((booking: any) => booking.status === selectedStatus.value)?.filter(b => isSameDay(new Date(b.startDate), new Date(date)));
			setFilteredBookings(filtered);
			return;
		}

		if (selectedStatus && selectedRoom) {
			const filtered = bookings?.filter((booking: any) => booking.status === selectedStatus.value)?.filter((booking: any) => booking?.room?.id === selectedRoom?.id);
			setFilteredBookings(filtered);
			return;
		}

		if (selectedRoom && date && selectedStatus) {
			const filtered = bookings?.filter((booking: any) => booking?.room?.id === selectedRoom?.id)?.filter(b => isSameDay(new Date(b.startDate), new Date(date)))?.filter(b => b.status === selectedStatus.value);
			setFilteredBookings(filtered);
			return;
		}
	}, [selectedRoom, date, selectedStatus, bookings]);

	const onClear = () => {
		setSelectedRoom(null);
		setDate(null);
		setSelectedStatus(null);
		setFilteredBookings(bookings);
	}
	
	const isSameDay = (d1: Date, d2: Date) => {
		return d1.getFullYear() === d2.getFullYear() &&
			d1.getDate() === d2.getDate() &&
			d1.getMonth() === d2.getMonth();
	}

	if (loading) return <Loader loading={loading} />;

	return (
		<div className="flex flex-col space-y-3">
			<div className="flex items-center justify-between">
				<h3>Bookings</h3>
			</div>

			<div className="flex flex-col mb-3 space-y-3 md:flex-row md:space-x-3 md:items-end md:space-y-0">
				<div className="w-full md:w-1/4">
					<Select presetValue={selectedRoom} label="Filter by Room:" items={rooms?.rooms.filter(r => r.bookable)} sendData={filterByRoom} />
				</div>

				<div className="w-full md:w-1/4">
					<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="title">
						Filter by Date:
					</label>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DesktopDatePicker
							inputFormat="MM/dd/yyyy"
							renderInput={(props) => <TextField className="w-full h-10 bg-white" {...props} />}
							value={date}
							onChange={(newValue: any) => {
								setDate(newValue);
								// return bookings that has the same created date as the selected date
								const filtered = bookings.filter(b => isSameDay(new Date(b.startDate), new Date(newValue)));
								setFilteredBookings(filtered);
							}}
						/>
					</LocalizationProvider>
				</div>

				<div className="w-full md:w-1/4">
					<Select presetValue={selectedStatus} label="Filter by Status:" items={statuses} sendData={filterByStatus} />
				</div>

				<div>
					<button
						type="button"
						className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
						onClick={onClear}
					>
						Clear
					</button>
				</div>
			</div>

			{filteredBookings?.length === 0 && (<NoData/>)}

			{filteredBookings?.length > 0 && (
				<div className="flex flex-col mt-6">
					<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
							<div className="overflow-hidden border-b border-gray-200 rounded-md shadow-md">
								<table className="min-w-full overflow-x-scroll divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
												Room
											</th>
											<th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
												Requester
											</th>
											<th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
												Status
											</th>
											<th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
												Created At
											</th>
											<th scope="col" className="relative px-6 py-3">
												<span className="sr-only">Edit</span>
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{filteredBookings?.map((book, index) => (
											<React.Fragment key={index}>
												<tr className="transition-all hover:bg-gray-100 hover:shadow-lg hover:cursor-pointer" onClick={() => handleExpand(book)}>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															<div className="flex-shrink-0 w-40 h-28">
																<img className="w-40 rounded-lg h-28" src={roomThumbnail} alt="room thumbnail" />
															</div>
															<div className="ml-4">
																<div className="text-sm font-medium text-gray-900">{book.room.name}</div>
																<div className="text-sm text-gray-500">{book.room?.venue?.name}</div>
															</div>
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">{book.user?.firstName} {book.user?.lastName}</div>
														<div className="text-sm text-gray-500">{humanRole(book.user?.role[0])}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<span className={`inline-flex px-3 py-2 text-sm font-semibold leading-5 text-gray-800 rounded-xl ${book.status === 'APPROVED' && 'bg-green-300'} ${book.status === 'PENDING' && 'bg-yellow-200'} ${book.status === 'CANCELLED' && 'bg-red-300'} ${book.status === 'APPROVED_REASSIGNED' && 'bg-purple-200'}`}>
															{book.status.replace(/_+/g, ' ')}
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														{dateFormatter.format(new Date(book?.createdDate))}
													</td>
													<td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
														<span className="text-indigo-600 hover:text-indigo-900" onClick={() => handleExpand(book)}>{isExpanded(book) ? 'Hide details' : 'View details'}</span>
													</td>
												</tr>
												{isExpanded(book) && (
													<tr className="bg-white">
														<td colSpan={5} className="p-4">
															<div className="w-full p-2">
																<div className="md:grid md:grid-cols-3 md:gap-6">
																	<div className="mt-5 md:mt-0 md:col-span-3">
																		<div className="grid grid-cols-6 gap-4">
																			{/* <div className="col-span-6 sm:col-span-2">
																				<div className="flex flex-col">
																					<h3 className="mb-2 font-semibold">{book.room?.name}</h3>
																					<img className="rounded-lg w-60 h-44" src={book.room?.thumbnail} alt="room thumbnail" />
																				</div>
																			</div> */}
																			
																			<div className="col-span-6 sm:col-span-2">
																				<div className="flex flex-col space-y-3">
																					<div className="font-semibold">
																						<h3>{book.room?.name} offers</h3>
																					</div>
																					{book.room.amenities.wifi && (
																						<div className="flex items-center">
																							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
																								<path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
																							</svg>
																							<span className="ml-2 text-sm">WIFI</span>
																						</div>
																					)}
																					
																					{book.room.amenities.camera && (
																						<div className="flex items-center">
																							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
																								<path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
																								<path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
																							</svg>
																							<span className="ml-2 text-sm">Camera</span>
																						</div>
																					)}
																					{book.room.amenities.projector && (
																						<div className="flex items-center">
																							<img className="w-6 h-6" src={projectorIcon} alt="projector icon" />
																							<span className="ml-2 text-sm">Projector</span>
																						</div>
																					)}
																					{book.room.amenities.conditioner && (
																						<div className="flex items-center">
																							<img className="w-6 h-6" src={conditionerIcon} alt="conditioner icon" />
																							<span className="ml-2 text-sm">Air Conditioning</span>
																						</div>
																					)}
																					{book.room.amenities.microphone && (
																						<div className="flex items-center">
																							<img className="w-6 h-6" src={microphoneIcon} alt="microphone icon" />
																							<span className="ml-2 text-sm">Microphone</span>
																						</div>
																					)}
																				</div>
																			</div>
																			
																			<div className="col-span-6 sm:col-span-2">
																				<div className="flex flex-col space-y-3">
																					<h3 className="text-sm">Requested by: <span className="font-semibold">{book.user?.firstName} {book.user?.lastName}</span></h3>
																					<div className="text-sm">From: <span className="font-semibold">{formatDate.format(new Date(book?.startDate))}</span></div>
																					<div className="text-sm">To: <span className="font-semibold">{formatDate.format(new Date(book?.endDate))}</span></div>
																					<div className="text-sm">Duration: <span className="font-semibold">{getDuration(book?.endDate, book?.startDate)}</span></div>
																					{isReassign && (
																						<div className="">
																							<Select loading={loadingRooms} items={roomsData?.availableRoomsDateRange} label="Room" sendData={receiveRoom} />
																						</div>	
																					)}

																					{isDeclined && (
																						<div className="">
																							<label htmlFor="about" className="block text-sm font-medium text-gray-700">
																								Message
																							</label>
																							<div className="mt-1">
																								<textarea
																									id="message"
																									name="message"
																									rows={3}
																									className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
																									placeholder="Enter message"
																									value={message}
																									onChange={(e) => setMessage(e.target.value)}
																								/>
																							</div>
																						</div>
																					)}
																					{book.status === 'CANCELLED' && (
																						<div className="flex pt-3 space-x-2">
																							<button
																								disabled={updateLoading}
																								onClick={isReassign ? () => handleReassign(book.id) : () => onReassign()}
																								type="button"
																								className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 disabled:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
																							>
																								<span className={`${updateLoading && 'text-gray-300'}`}>Reassign</span>
																								{updateLoading && (
																									<span className="ml-2">
																										<svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
																											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
																											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
																										</svg>
																									</span>
																								)}
																							</button>
																						</div>
																					)}

																					{book.status === 'PENDING' && (
																						<div className="flex pt-3 space-x-2">
																							{!isDeclined && (
																								<>
																									{!isReassign && (
																										<div>
																											<button
																												onClick={() => handleApprove(book.id)}
																												type="button"
																												className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-700 disabled:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
																												disabled={updateLoading}
																											>
																												<span className={`${updateLoading && 'text-gray-300'}`}>Approve</span>
																												{updateLoading && (
																													<span className="ml-2">
																														<svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
																															<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
																															<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
																														</svg>
																													</span>
																												)}
																											</button>
																										</div>
																									)}
																									<div>
																										<button
																											disabled={updateLoading}
																											onClick={isReassign ? () => handleReassign(book.id) : () => onReassign()}
																											type="button"
																											className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 disabled:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
																										>
																											<span className={`${updateLoading && 'text-gray-300'}`}>Reassign</span>
																											{updateLoading && (
																												<span className="ml-2">
																													<svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
																														<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
																														<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
																													</svg>
																												</span>
																											)}
																										</button>
																									</div>
																								</>
																							)}

																							{!isReassign && (
																								<div>
																									{!isDeclined ? (
																										<div>
																											<button
																												onClick={() => setIsDeclined(true)}
																												type="button"
																												className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
																											>
																												Reject
																											</button>
																										</div>
																									) : (
																										<div>
																											<button
																												disabled={updateLoading}
																												onClick={() => handleDecline(book.id)}
																												type="button"
																												className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-700 disabled:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
																											>
																												<span className={`${updateLoading && 'text-gray-300'}`}>Decline</span>
																												{updateLoading && (
																													<span className="ml-2">
																														<svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
																															<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
																															<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
																														</svg>
																													</span>
																												)}
																											</button>
																										</div>
																									)}	
																								</div>
																							)}
																						</div>
																					)}
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</td>
													</tr>
												)}
											</React.Fragment>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}