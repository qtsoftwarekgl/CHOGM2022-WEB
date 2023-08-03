import { useMutation } from '@apollo/client';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { initialAmenities, yesNo } from "../../@data";
import { Loader } from "../../components/Loader";
import Select from "../../components/Select";
import FileUpload from "../../components/upload/FileUpload";
import { UPLOAD_FILE } from "../../components/upload/mutation";
import { EVenueType } from "../../enums";
import { useRoomQuery, useVenuesByCategoryQuery } from "../../generated/graphql";
import { notifySuccess } from '../../utils';
import { UPDATE_ROOM } from "./mutation";
import { QUERY_ROOMS } from "./query";

export default function UpdateRoom() {
	const { id } = useParams();
	const [venue, setVenue] = useState<any>();
	const [availability, setAvailability] = useState<any>(null);
	const [isMediaRoom, setMediaRoom] = useState<any>(null);
	const [capacity, setCapacity] = useState<string>('');
	const [amenities, setAmenities] = useState<any>(initialAmenities);
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [file, setFile] = useState<any>(null);
	const [imageURL, setImageURL] = useState<string>('');

	const navigate = useNavigate();
	const redirect = (url: string) => navigate(url);

	const type: any = { category: EVenueType.EVENT_VENUE };
	const { data: venues, error } = useVenuesByCategoryQuery({ variables: { type } });

	const { data, loading } = useRoomQuery({ variables: { id: id! } });

	useEffect(() => {
		if (data) {
			const { room } = data;
			setVenue(room.venue);
			setName(room.name);
			setMediaRoom(yesNo.find((av: any) => av.value === room.isMediaRoom));
			setAvailability(yesNo.find((av: any) => av.value === room.bookable));
			setCapacity(room.capacity.toString());

			// presetting amenities on first load
			// if (room.amenities) {
			// 	const { camera, projector, conditioner, microphone, wifi } = room.amenities;
			// 	const amenities = { camera, projector, conditioner, microphone, wifi };
			// 	setAmenities(amenities);
			// }
			// setImageURL(room.thumbnail);
			setDescription(room.description);
		}
	}, [data?.room]);

	const receiveVenue = (data: any) => {
		setVenue(data);
	}

	const receiveMedia = (data: any) => {
		setMediaRoom(data);
	}
	
	const receiveAvailabiity = (data: any) => {
		setAvailability(data);
	}

	const onChange = (e: any) => {
		amenities[e.target.value] = e.target.checked;
		setAmenities(amenities);
	}

	const receiveFile = (file: any) => setFile(file);

	// const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
	// 	onCompleted: (data: any) => {
	// 		room.thumbnail = data?.uploadFile

	// 		updateRoom({ variables: { room } });
	// 	},
	// 	onError(err) {
	// 		console.log(err);
	// 	}
	// });

	const room: any = {
		roomId: id,
		name,
		description,
		isMediaRoom: isMediaRoom?.value,
    bookable: availability?.value,
    amenities,
		venue: venue?.id,
		capacity: parseFloat(capacity),
		thumbnail: ""
	}

	const [updateRoom, { loading: updateLoading }] = useMutation(UPDATE_ROOM, {
		refetchQueries: [
			{
				query: QUERY_ROOMS
			}
		],
		onCompleted: (data) => {
			if (data) {
				notifySuccess("Room has been updated!");
				redirect('/admin/rooms');
			}
		},
		onError(err) {
			console.log(err);
		}
	});

	const handleUpdate = (e: any) => {
		e.preventDefault();
		updateRoom({ variables: { room } });

		// if (!file && imageURL?.trim() === '') return;

		// if (!!file && typeof file === 'object') {
		// 	uploadFile({ variables: { file } });
		// } else {
		// 	updateRoom({ variables: { room } });
		// }
	}

	if (loading || updateLoading) return <Loader loading={(loading || updateLoading)} />;

	return (
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="mt-5 md:mt-0 md:col-span-3">
				<form onSubmit={handleUpdate}>
					<div className="overflow-hidden shadow sm:rounded-md">
						<div className="px-4 py-5 bg-white sm:p-6">
							<div className="grid grid-cols-6 gap-6">
								<div className="col-span-6 sm:col-span-2">
									{!!venues && (<Select items={venues.venuesByCategoy} label="Venue" sendData={receiveVenue} presetValue={venue} />)}
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Name
									</label>
									<input
										type="text"
										name="name"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={name}
										onChange={e => setName(e.target.value)}
										placeholder="Enter name"
									/>
								</div>

								<div className="col-span-6 sm:col-span-1">
									<Select presetValue={availability} items={yesNo} label="Bookable" sendData={receiveAvailabiity} />
								</div>

								<div className="col-span-6 sm:col-span-1">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Capacity
									</label>
									<input
										type="number"
										min="2"
										name="capacity"
										id="capacity"
										autoComplete="capacity"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={capacity}
										onChange={e => setCapacity(e.target.value)}
										placeholder="Enter capacity"
									/>
								</div>
								
								{/* <div className="col-span-6 sm:col-span-4">
									<div className="grid grid-cols-6 gap-4">
										<div className="col-span-6 sm:col-span-1">
											<div className="flex items-center">
												<input type="checkbox" className="form-checkbox" value="camera" onChange={onChange} checked={amenities.camera}/>
												<span className="text-sm text-gray-800">Camera</span>
											</div>
										</div>
										<div className="col-span-6 sm:col-span-1">
											<div className="flex items-center">
												<input type="checkbox" className="form-checkbox" value="conditioner" onChange={onChange} checked={amenities.conditioner} />
												<span className="text-sm text-gray-800">Air Conditioner</span>
											</div>
										</div>
										<div className="col-span-6 sm:col-span-1">
											<div className="flex items-center">
												<input type="checkbox" className="form-checkbox" value="microphone" onChange={onChange} checked={amenities.microphone} />
												<span className="text-sm text-gray-800">Microphone</span>
											</div>
										</div>
										<div className="col-span-6 sm:col-span-1">
											<div className="flex items-center">
												<input type="checkbox" className="form-checkbox" value="projector" onChange={onChange} checked={amenities.projector}/>
												<span className="text-sm text-gray-800">Projector</span>
											</div>
										</div>
										<div className="col-span-6 sm:col-span-1">
											<div className="flex items-center">
												<input type="checkbox" className="form-checkbox" value="wifi" onChange={onChange} checked={amenities.wifi} />
												<span className="text-sm text-gray-800">WIFI</span>
											</div>
										</div>
									</div>
								</div> */}

								<div className="col-span-6 sm:col-span-1">
									<Select presetValue={isMediaRoom} items={yesNo} label="Media Room" sendData={receiveMedia} />
								</div>

								<div className="col-span-6 sm:col-span-4"></div>

								{/* <div className="col-span-6 sm:col-span-6 lg:col-span-3">
									<FileUpload presetImg={imageURL} sendFile={receiveFile}/>
								</div> */}

								<div className="col-span-6 sm:col-span-6 lg:col-span-3">
									<label htmlFor="about" className="block text-sm font-medium text-gray-700">
										Short description
									</label>
									<div className="mt-1">
										<textarea
											id="description"
											name="description"
											rows={6}
											className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											placeholder="Short description"
											value={description}
											onChange={(e) => setDescription(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
							<button
								type="submit"
								className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Update
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}