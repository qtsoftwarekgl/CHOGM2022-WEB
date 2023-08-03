import { useMutation } from '@apollo/client';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hotelRankingData, venueCategories } from "../../@data";
import { Editor } from "../../components/Editor";
import { Loader } from "../../components/Loader";
import Select from "../../components/Select";
import FileUpload from "../../components/upload/FileUpload";
import { UPLOAD_FILE } from "../../components/upload/mutation";
import { EVenueType } from "../../enums";
import { useTakenRanksQuery, useVenueQuery } from "../../generated/graphql";
import { notifyError, notifySuccess } from "../../utils";
import { UPDATE_VENUE } from "./mutation";
import { QUERY_TAKEN_RANKING, QUERY_VENUES } from "./query";

export default function UpdateVenue() {
	const { id } = useParams();
	const [name, setName] = useState<string>('');
	const [venueCategory, setVenueCategory] = useState<any>(null);
	const [locationLink, setLocationLink] = useState<string>('');
	const [shortDescription, setShortDescription] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [file, setFile] = useState<any>(null);
	const [contactPhone, setContactPhone] = useState<string>('');
	const [contactEmail, setContactEmail] = useState<string>('');
	const [locationName, setLocationName] = useState<string>('');
	const [streetAddress, setStreetAddress] = useState<string>('');
	const [website, setWebsite] = useState<string>('');
	const [imageURL, setImageURL] = useState<string>('');
	const [hotelRanking, setHotelRanking] = useState<any>(null);
	const [availableHotelsRanks, setAvailableHotelsRanks] = useState<any[]>([]);
	const type: any = { category: EVenueType.EVENT_VENUE }

	const navigate = useNavigate();
	const redirect = (url: string) => navigate(url);

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { data, loading } = useVenueQuery({ variables: { id: id! } });

	const { data: availableData } = useTakenRanksQuery({ 
		variables: { type: venueCategory ? { category:  venueCategory?.value } : type },
	});

	useEffect(() => {
		if (data?.venue) {
			const { venue } = data;

			setName(venue.name);
			if (venue.venueCategory) {
				setVenueCategory(venueCategories.find((v: any) => v.value === venue.venueCategory));
			}

			setLocationLink(venue.venueInfo.locationLink);
			setImageURL(venue.thumbnail);
			setShortDescription(venue.shortDescription);
			if (venue.venueInfo.contactPhone) setContactPhone(venue.venueInfo.contactPhone);
			if (venue.venueInfo.contactEmail) setContactEmail(venue.venueInfo.contactEmail);
			if (venue.venueInfo.venueLocationName) setLocationName(venue.venueInfo.venueLocationName);
			if (venue.venueInfo.venueWebsite) setWebsite(venue.venueInfo.venueWebsite);
			if (venue.venueInfo.hotelRanking) setHotelRanking(hotelRankingData.find(({value}) => value === venue.venueInfo.hotelRanking));
			setDescription(venue.description);
		}
	}, [data?.venue]);

	useEffect(() => {
		if (availableData && availableData?.takenRanks?.length > 0) {
			const arr = availableData.takenRanks;
			setAvailableHotelsRanks(hotelRankingData.filter(({ value }) => !arr.includes(value)))
		} else {
			setAvailableHotelsRanks(hotelRankingData)
		}
	}, [availableData?.takenRanks]);
	
	const receiveCategory = (data: any) => {
		setVenueCategory(data);
	}

	const receiveFile = (file: any) => setFile(file);

	const receiveHtml = (html: any) => setDescription(html);

	const receiveRanking = (rank: any) => setHotelRanking(rank);

	const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
		onCompleted: (data: any) => {
			venue.thumbnail = data?.uploadFile

			updateVenue({ variables: { venue } });
		}
	});

	const showRanking = (): boolean => {
		return venueCategory?.value === EVenueType.HOTEL_APARTMENT_VENUE || 
		venueCategory?.value === EVenueType.EVENT_VENUE || 
		venueCategory?.value === EVenueType.RESTAURANT_VENUE || 
		venueCategory?.value === EVenueType.COFFEE_SHOP_VENUE
	}

	const venue: any = {
		venueId: id,
		name,
		venueCategory: venueCategory?.value,
		venueInfo: {
			locationLink,
			contactEmail,
			contactPhone,
			...(!!locationName && { venueLocationName: locationName }),
			...(!!streetAddress && { venueStreetAddress: streetAddress }),
			...(!!website && { venueWebsite: website }),
			...(!!hotelRanking && { hotelRanking: hotelRanking?.value })
		},
		description,
		shortDescription
	}

	const [updateVenue, { loading: updateLoading }] = useMutation(UPDATE_VENUE, {
		refetchQueries: [
			{
				query: QUERY_VENUES
			},
			{
				query: QUERY_TAKEN_RANKING
			}
		],
		onCompleted: (data) => {
			if (data) {
				notifySuccess("Venue has been updated!");
				redirect('/admin/venues');
			}
		},
		onError(err) {
			console.log(err);
		}
	});

	const handleUpdate = (e: any) => {
		e.preventDefault();
		if (!file && imageURL?.trim() === '') return;
		if (venueCategory?.value === EVenueType.HOTEL_APARTMENT_VENUE && !hotelRanking?.value) {
			notifyError("If the venue is a hotel apartment you have to provide hotel ranking");
			return;
		}
		if (!!file && typeof file === 'object') {
			uploadFile({ variables: { file } });
		} else {
			updateVenue({ variables: { venue } });
		}
	}

	if (loading || uploading) return <Loader loading={(loading || uploading)} />;

	return (
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="mt-5 md:mt-0 md:col-span-3">
				<form onSubmit={handleUpdate}>
					<div className="overflow-hidden shadow sm:rounded-md">
						<div className="px-4 py-5 bg-white sm:p-6">
							<div className="grid grid-cols-6 gap-6">
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

								<div className="col-span-6 sm:col-span-2">
									<Select presetValue={venueCategory} items={venueCategories} label="Venue Type" sendData={receiveCategory} />
								</div>

								{ showRanking() && (
									<div className="col-span-6 sm:col-span-2">
										<Select presetValue={hotelRanking} items={availableHotelsRanks} label="Ranking" sendData={receiveRanking} />
									</div>
								)}

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
										Google Map link
									</label>
									<input
										type="text"
										name="link"
										id="link"
										autoComplete="latitude"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={locationLink}
										onChange={e => setLocationLink(e.target.value)}
										placeholder="Enter google map link"
									/>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<FileUpload presetImg={imageURL} sendFile={receiveFile} />
								</div>

								<div className="col-span-6 sm:col-span-6 lg:col-span-2">
									<label htmlFor="about" className="block text-sm font-medium text-gray-700">
										Short description
									</label>
									<div className="mt-1">
										<textarea
											id="about"
											name="about"
											rows={6}
											className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											placeholder="Short description"
											value={shortDescription}
											onChange={e => setShortDescription(e.target.value)}
										/>
									</div>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<div className="flex flex-col space-y-3">
										<div>
											<label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
												Contact Phone <span className="text-xs font-normal text-gray-600">(Optional)</span>
											</label>
											<input
												type="number"
												name="contactPhone"
												id="contactPhone"
												autoComplete="contactPhone"
												className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												value={contactPhone}
												onChange={e => setContactPhone(e.target.value)}
												placeholder="Enter contact phone"
											/>
										</div>
										<div>
											<label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
												Contact Email <span className="text-xs font-normal text-gray-600">(Optional)</span>
											</label>
											<input
												type="email"
												name="contactEmail"
												id="contactEmail"
												autoComplete="contactEmail"
												className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												value={contactEmail}
												onChange={e => setContactEmail(e.target.value)}
												placeholder="Enter contact email"
											/>
										</div>
									</div>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Location Name <span className="text-xs font-normal text-gray-600">(Optional)</span>
									</label>
									<input
										type="text"
										name="name"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={locationName}
										onChange={e => setLocationName(e.target.value)}
										placeholder="Enter location name"
									/>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Street Address <span className="text-xs font-normal text-gray-600">(Optional)</span>
									</label>
									<input
										type="text"
										name="name"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={streetAddress}
										onChange={e => setStreetAddress(e.target.value)}
										placeholder="Enter street address"
									/>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Website <span className="text-xs font-normal text-gray-600">(Optional)</span>
									</label>
									<input
										type="text"
										name="name"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={website}
										onChange={e => setWebsite(e.target.value)}
										placeholder="Enter website"
									/>
								</div>

								<div className="col-span-6 sm:col-span-6 lg:col-span-6">
									<Editor description={description} sendHtml={receiveHtml}/>
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