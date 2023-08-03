import { useMutation } from '@apollo/client';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '../../components/Editor';
import { Loader } from '../../components/Loader';
import Select from '../../components/Select';
import FileUpload from '../../components/upload/FileUpload';
import { UPLOAD_FILE } from '../../components/upload/mutation';
import { EVenueType } from '../../enums';
import { useVenuesByCategoryQuery } from '../../generated/graphql';
import { notifySuccess } from '../../utils';
import { CREATE_FORUM } from './mutation';
import { QUERY_FORUMS } from './query';

export default function CreateForum() {
	const [venue, setVenue] = useState<any>(null);
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [file, setFile] = useState<any>(null);
	const [startDate, setStartDate] = useState<any>(null);
	const [endDate, setEndDate] = useState<any>(null);

	const navigate = useNavigate();
	const redirect = (url: string) => navigate(url);

	const type: any = { category: EVenueType.EVENT_VENUE };
	const { data: venues, error } = useVenuesByCategoryQuery({ variables: { type } });

	const receiveVenue = (venue: any) => setVenue(venue);

	const receiveFile = (file: any) => setFile(file);

	const receiveHtml = (html: any) => setDescription(html);

	const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
		onCompleted: (data: any) => {
			const forum: any = {
				name,
				description,
				attendees: ["All people"],
				startDate,
				endDate,
				venue: venue?.id
			}

			forum.thumbnail = data?.uploadFile

			createForum({ variables: { forum } });
		},
		onError(err) {
			console.log(err);
		}
	});

	const [createForum, { loading: createLoading }] = useMutation(CREATE_FORUM, {
		refetchQueries: [
			{
				query: QUERY_FORUMS
			}
		],
		onCompleted: (data) => {
			if (data) {
				notifySuccess("Event has been created!");
				redirect('/admin/events');
			}
		},
		onError(err) {
			console.log(err);
		}
	});

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (!file) return;
		uploadFile({ variables: { file } });
	}

	if (createLoading || uploading) return <Loader loading={(createLoading || uploading)} />;

	return (
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="mt-5 md:mt-0 md:col-span-3">
				<form onSubmit={handleSubmit}>
					<div className="overflow-hidden shadow sm:rounded-md">
						<div className="px-4 py-5 bg-white sm:p-6">
							<div className="grid grid-cols-6 gap-6">
								<div className="col-span-6 sm:col-span-2">
									<Select presetValue={venue} items={!venues ? [] : venues.venuesByCategoy} label="Venue" sendData={receiveVenue} />
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

								<div className="col-span-6 sm:col-span-2"></div>

								<div className="col-span-6 sm:col-span-2">
									<label className="block mb-1 text-sm font-bold text-gray-700" htmlFor="startDate">
										Start Date
									</label>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DateTimePicker
											minDate={new Date()}
											maxDateTime={endDate}
											renderInput={(props) => <TextField className="w-full h-10" {...props} />}
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
											renderInput={(props) => <TextField className="w-full h-10" {...props} />}
											value={endDate}
											onChange={(newValue) => {
												setEndDate(newValue);
											}}
										/>
									</LocalizationProvider>
								</div>

								<div className="col-span-6 sm:col-span-6 lg:col-span-2"></div>

								<div className="col-span-6 sm:col-span-6 lg:col-span-2">
									<FileUpload sendFile={receiveFile}/>
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
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

