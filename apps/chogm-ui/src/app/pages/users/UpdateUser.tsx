import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UPLOAD_FILE } from "../../components/upload/mutation";
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from "./mutation";
import { QUERY_USERS } from "./query";
import { Loader } from "../../components/Loader";
import Select from "../../components/Select";
import { roles, yesNo } from "../../@data";
import FileUpload from "../../components/upload/FileUpload";
import { useUserQuery } from "../../generated/graphql";
import { notifyError, notifySuccess } from "../../utils";
import { EUserRole } from "../../enums";
import { Editor } from "../../components/Editor";

export default function UpdateUser() {
	const { id } = useParams();
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [age, setAge] = useState<string>('');
	const [role, setRole] = useState<any>(null);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [file, setFile] = useState<any>(null);
	// const [biography, setBiography] = useState<string>('');
	// const [description, setDescription] = useState<string>('');
	const [imageURL, setImageURL] = useState<string>('');
	const [showNoc, setShowNoc] = useState<any>(null);

	const navigate = useNavigate();
	const redirect = (url: string) => navigate(url);

	const { data } = useUserQuery({ variables: { id: id! } });

	useEffect(() => {
		if (data) {
			const { user } = data;
			setFirstName(user?.firstName);
			setLastName(user?.lastName);
			setEmail(user?.email);
			if (user?.age) {
				setAge(user?.age?.toString());
			} else setAge('');
			setRole(roles?.find((r: any) => r.value === user?.role[0]));
			if (user?.phoneNumber) setPhoneNumber(user?.phoneNumber);
			setImageURL(user?.avatar);
			// setBiography(user?.biography);
			// setDescription(user?.description);
			setShowNoc(yesNo.find(({value}) => value === user.showNoc))
		}
	}, [data?.user])

	const receiveRole = (data: any) => setRole(data);

	const receiveFile = (file: any) => setFile(file);

	// const receiveHtml = (html: any) => setDescription(html);

	const receiveShowNoc = (data: any) => setShowNoc(data);

	const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
		onCompleted: (data: any) => {
			user.avatar = data?.uploadFile

			updateUser({ variables: { user } });
		},
		onError(err: any) {
			console.log(err);
		}
	});

	const user: any = {
		userId: id,
		firstName,
		lastName,
		email,
		role: role?.value,
		age: parseFloat(age),
		showNoc: showNoc?.value
	}

	const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
		refetchQueries: [
			{
				query: QUERY_USERS, variables: { limit: 10, skip: 0 }
			}
		],
		onCompleted: (data) => {
			if (data) {
				notifySuccess("User has been updated!");
				redirect('/admin/users');
			}
		},
		onError(err) {
			console.log(err);
		}
	});

	const handleUpdate = (e: any) => {
		e.preventDefault();

		if (role?.value === EUserRole.MODERATOR || role?.value === EUserRole.SPEAKER) {
			if (file) {
				uploadFile({ variables: { file } });
				return;
			} else {
				updateUser({ variables: { user } });
			}
		} else {
			if (!file && imageURL?.trim() === '') {
				notifyError('Upload a profile picture');
				return;
			};

			if (!!file && typeof file === 'object') {
				uploadFile({ variables: { file } });
				return;
			} else {
				updateUser({ variables: { user } });
			}
		}
	};

	if (updateLoading || uploading) return <Loader loading={(updateLoading || uploading)} />;

	return (
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="mt-5 md:mt-0 md:col-span-3">
				<form onSubmit={handleUpdate}>
					<div className="overflow-hidden shadow sm:rounded-md">
						<div className="px-4 py-5 bg-white sm:p-6">
							<div className="grid grid-cols-6 gap-6">
								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										First Name
									</label>
									<input
										type="text"
										name="name"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={firstName}
										onChange={e => setFirstName(e.target.value)}
										required
										placeholder="Enter first name"
									/>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Last Name
									</label>
									<input
										type="text"
										name="name"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={lastName}
										onChange={e => setLastName(e.target.value)}
										required
										placeholder="Enter last name"
									/>
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<input
										type="email"
										name="email"
										id="name"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={email}
										onChange={e => setEmail(e.target.value)}
										required
										placeholder="Enter email address"
									/>
								</div>

								<div className="col-span-6 sm:col-span-1">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Age
									</label>
									<input
										type="number"
										min="16"
										name="age"
										id="age"
										autoComplete="name"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={age}
										onChange={e => setAge(e.target.value)}
										placeholder="Enter age"
									/>
								</div>

								<div className="col-span-6 sm:col-span-1">
									<Select presetValue={role} items={roles.filter(r => r.value !== EUserRole.ATTENDEE)} label="Role" sendData={receiveRole} />
								</div>

								<div className="col-span-6 sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Phone Number
									</label>
									<input
										type="text"
										name="phoneNumber"
										id="phoneNumber"
										autoComplete="phoneNumber"
										className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										value={phoneNumber}
										onChange={e => setPhoneNumber(e.target.value)}
										placeholder="Enter phone number"
									/>
								</div>

								<div className="col-span-6 sm:col-span-6 lg:col-span-2">
									<Select presetValue={showNoc} items={yesNo} isOptional={true} label="Can See NOC dashboard" sendData={receiveShowNoc} />
								</div>

								<div className="col-span-6 sm:col-span-6 lg:col-span-2">
									<FileUpload presetImg={imageURL} sendFile={receiveFile}/>
								</div>

								{/* <div className="col-span-6 sm:col-span-6 lg:col-span-2">
									<label htmlFor="about" className="block text-sm font-medium text-gray-700">
										Biography <span className="text-xs font-normal text-gray-600">(Optional)</span>
									</label>
									<div className="mt-1">
										<textarea
											id="description"
											name="description"
											rows={6}
											className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											placeholder="Short biography"
											value={biography}
											onChange={(e) => setBiography(e.target.value)}
										/>
									</div>
								</div> */}

								{/* <div className="col-span-6 sm:col-span-6 lg:col-span-6">
									<Editor description={description} sendHtml={receiveHtml}/>
								</div> */}
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