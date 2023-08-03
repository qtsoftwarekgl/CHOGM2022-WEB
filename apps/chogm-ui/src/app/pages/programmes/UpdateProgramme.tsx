import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelect from "../../components/MultiSelect";
import Select from "../../components/Select";
import { EUserRole } from "../../enums";
import { useForumsQuery, useProgrammeQuery, useRoomsQuery, useUsersByRoleQuery } from "../../generated/graphql";
import { useMutation } from '@apollo/client';
import { UPDATE_PROGRAMME } from "./mutation";
import { QUERY_PROGRAMMES } from "./query";
import { Loader } from "../../components/Loader";
import { notifySuccess } from "../../utils";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import { Editor } from "../../components/Editor";

export default function UpdateProgramme() {
	const { id } = useParams();
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [startDate, setStartDate] = useState<any>(null);
	const [endDate, setEndDate] = useState<any>(null);
	const [broadcastLink, setBroadcastLink] = useState<string>('');
	const [room, setRoom] = useState<any>(null);
	const [forum, setForum] = useState<any>(null);
	const [speakers, setSpeakers] = useState<any>(null);
	const [moderators, setModerators] = useState<any>(null);
	const [mods, setMods] = useState<any[]>([]);
	const [spUsers, setSpUsers] = useState<any[]>([]);

	const navigate = useNavigate();
	const redirect = (url: string) => navigate(url);

	const { data: rooms, } = useRoomsQuery();
	const { data: forums } = useForumsQuery();

	const spRole: any = { roles: [EUserRole.SPEAKER, EUserRole.MODERATOR] };
	const { data: users } = useUsersByRoleQuery({ variables: { role: spRole } });

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { data, loading } = useProgrammeQuery({ variables: { id: id! } });

	useEffect(() => {
		if (data) {
			const { programme } = data;

			setRoom(programme.room);
			setForum(programme.forum);
			setTitle(programme.title);
			setSpeakers(programme.speakers)
			setStartDate(programme.startDate);
			setEndDate(programme.endDate);
			if (programme.broadcastLink) setBroadcastLink(programme.broadcastLink);
			setModerators(programme.moderator);
			setDescription(programme.description);
		}
	}, [data?.programme]);

	useEffect(() => {
		if (users?.usersByRole) {
			// dynamically set moderators list based on selected speakers
			if (speakers?.length > 0) {
				const mods = users?.usersByRole.filter(u => !speakers.some((s: any) => s.id === u.id));
				setMods(mods);
			} else {
				setMods(users?.usersByRole);
			}
			
			// dynamically set speakers list based on selected moderators
			if (moderators?.length > 0) {
				const sp = users?.usersByRole.filter(u => !moderators.some((s: any) => s.id === u.id));
				setSpUsers(sp);
			} else {
				setSpUsers(users?.usersByRole)
			}
		}
	}, [moderators, speakers, users?.usersByRole]);

	const receiveForum = (e: any) => setForum(e);

	const receiveRoom = (e: any) => setRoom(e);

	const receiveSpeakers = (e: any) => setSpeakers(e);

	const receiveModerator = (e: any) => setModerators(e);

	const receiveHtml = (html: any) => setDescription(html);

	const [updateProgram, { loading: updateLoading }] = useMutation(UPDATE_PROGRAMME, {
		refetchQueries: [
			{
				query: QUERY_PROGRAMMES
			}
		],
		onCompleted: (data) => {
			if (data) {
				notifySuccess("Programme has been updated!");
				redirect('/admin/programmes');
			}
		},
		onError(err) {
			console.log(err);
		}
	})

	const handleUpdate = (e: any) => {
		e.preventDefault();

		const program = {
			programmeId: id,
			title,
			broadcastLink,
			forum: forum?.id,
			room: room?.id,
			speakers: speakers?.map((sp: any) => sp.id),
			moderator: moderators?.map((mod: any) => mod.id),
			startDate: new Date(startDate).toISOString(),
			endDate: new Date(endDate).toISOString(),
			description
		};

		updateProgram({ variables: { program } });
	}

	if (updateLoading) return <Loader loading={updateLoading} />;

	return (
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="mt-5 md:mt-0 md:col-span-3">
				<form onSubmit={handleUpdate}>
					<div className="overflow-hidden shadow sm:rounded-md">
						<div className="px-4 py-5 bg-white sm:p-6">
							<div className="grid grid-cols-6 gap-6">
								<div className="col-span-6 sm:col-span-2">
									<Select items={!rooms ? [] : rooms.rooms} label="Room" sendData={receiveRoom} presetValue={room} />
								</div>

								<div className="col-span-6 sm:col-span-2">
									<Select items={!forums ? [] : forums.forums} label="Forum" sendData={receiveForum} presetValue={forum} />
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Title
									</label>
									<input
										type="text"
										name="name"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={title}
										onChange={e => setTitle(e.target.value)}
										placeholder="Enter title"
									/>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<MultiSelect label="Speakers" items={!spUsers ? [] : spUsers} sendData={receiveSpeakers} presetValue={speakers} />
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label className="block mb-1 text-sm font-bold text-gray-700" htmlFor="title">
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
									<label className="block mb-1 text-sm font-bold text-gray-700" htmlFor="title">
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

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Broadcast link
									</label>
									<input
										type="text"
										name="name"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={broadcastLink}
										onChange={e => setBroadcastLink(e.target.value)}
										placeholder="Enter broadcast link"
									/>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<MultiSelect presetValue={moderators} label="Moderators" items={!mods ? [] : mods} sendData={receiveModerator} />
								</div>

								<div className="col-span-6 sm:col-span-6 lg:col-span-6">
									<Editor description={description} sendHtml={receiveHtml} />
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