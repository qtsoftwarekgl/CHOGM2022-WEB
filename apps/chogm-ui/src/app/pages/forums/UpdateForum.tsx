import { useMutation } from '@apollo/client';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import Select from "../../components/Select";
import FileUpload from "../../components/upload/FileUpload";
import { UPLOAD_FILE } from "../../components/upload/mutation";
import { EVenueType } from "../../enums";
import { useForumQuery, useVenuesByCategoryQuery } from "../../generated/graphql";
import { notifySuccess } from '../../utils';
import { UPDATE_FORUM } from "./mutation";
import { QUERY_FORUMS } from "./query";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import { Editor } from '../../components/Editor';

export default function UpdateForum() {
	const { id } = useParams();
	const [venue, setVenue] = useState<any>();
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [file, setFile] = useState<any>(null);
	const [startDate, setStartDate] = useState<any>(null);
	const [endDate, setEndDate] = useState<any>(null);
	const [imageURL, setImageURL] = useState<string>('');

	const navigate = useNavigate();
	const redirect = (url: string) => navigate(url);

	const type: any = { category: EVenueType.EVENT_VENUE };
	const { data: venues, error } = useVenuesByCategoryQuery({ variables: { type } });

	const { data, loading } = useForumQuery({ variables: { id: id! } });

	useEffect(() => {
		if (data) {
			const { forum } = data;
			setVenue(forum.venue);
			setName(forum.name);
			setStartDate(forum.startDate);
			setEndDate(forum.endDate);
			setImageURL(forum.thumbnail);
			setDescription(forum.description)
		}
	}, [data]);

	const receiveVenue = (venue: any) => setVenue(venue);

	const receiveFile = (file: any) => setFile(file);

	const receiveHtml = (html: any) => setDescription(html);

	const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
		onCompleted: (data: any) => {
			const forum: any = {
				forumId: id,
				name,
				description,
				attendees: ["All people"],
				startDate: new Date(startDate)?.toISOString(),
				endDate: new Date(endDate)?.toISOString(),
				venue: venue?.id
			}

			forum.thumbnail = data?.uploadFile;

			updateForum({ variables: { forum } });
		},
		onError(err) {
			console.log(err);
		}
	});

	const [updateForum, { loading: updateLoading }] = useMutation(UPDATE_FORUM, {
		refetchQueries: [
			{
				query: QUERY_FORUMS
			}
		],
		onCompleted: (data) => {
			if (data) {
				notifySuccess("Event has been updated!");
				redirect('/admin/events');
			}
		},
		onError(err) {
			console.log(err);
		}
	})

	const handleUpdate = (e: any) => {
		e.preventDefault();
		if (!file && imageURL?.trim() === '') return;

		if (!!file && typeof file === 'object') {
			uploadFile({ variables: { file } });
		} else {
			const forum: any = {
				forumId: id,
				name,
				description,
				attendees: ["All people"],
				startDate: new Date(startDate)?.toISOString(),
				endDate: new Date(endDate)?.toISOString(),
				venue: venue?.id
			}

			updateForum({ variables: { forum } });
		}
	}

	if (loading || updateLoading || uploading) return <Loader loading={(loading || updateLoading || uploading)} />;

	return (
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="mt-5 md:mt-0 md:col-span-3">
				<form onSubmit={handleUpdate}>
					<div className="overflow-hidden shadow sm:rounded-md">
						<div className="px-4 py-5 bg-white sm:p-6">
							<div className="grid grid-cols-6 gap-6">
								<div className="col-span-6 sm:col-span-2">
									{!!venues && (<Select presetValue={venue} items={venues.venuesByCategoy} label="Venue" sendData={receiveVenue} />)}
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Name
									</label>
									<input
										placeholder="Enter name"
										type="text"
										name="name"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={name}
										onChange={e => setName(e.target.value)}
									/>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label className="block mb-1 text-sm font-bold text-gray-700" htmlFor="startDate">
										Start Date
									</label>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DateTimePicker
											maxDateTime={endDate}
											renderInput={(props) => <TextField className="h-10" {...props} />}
											value={startDate}
											onChange={(newValue) => {
												setStartDate(newValue);
											}}
										/>
									</LocalizationProvider>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label className="block mb-1 text-sm font-bold text-gray-700" htmlFor="endDate">
										End Date
									</label>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DateTimePicker
											minDateTime={startDate}
											renderInput={(props) => <TextField className="h-10" {...props} />}
											value={endDate}
											onChange={(newValue) => {
												setEndDate(newValue);
											}}
										/>
									</LocalizationProvider>
								</div>

								<div className="col-span-6 sm:col-span-6 lg:col-span-2">
									<FileUpload presetImg={imageURL} sendFile={receiveFile}/>
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