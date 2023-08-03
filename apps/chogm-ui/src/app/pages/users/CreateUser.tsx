import { useEffect, useState } from "react";
import FileUpload from "../../components/upload/FileUpload";
import Select from "../../components/Select";
import { useMutation } from '@apollo/client';
import { CREATE_USER } from "./mutation";
import { QUERY_USERS } from "./query";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { UPLOAD_FILE } from "../../components/upload/mutation";
import { roles, yesNo } from "../../@data";
import { notifyError, notifySuccess } from "../../utils";
import { GET_USERS_BY_ROLE } from "../programmes/query";
import { EUserRole } from "../../enums";
import { Editor } from "../../components/Editor";

export default function CreateUser() {
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [age, setAge] = useState<string>('');
	const [role, setRole] = useState<any>(null);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [file, setFile] = useState<any>(null);
	// const [biography, setBiography] = useState<string>('');
	// const [description, setDescription] = useState<string>('');

	const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
	const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
	const [showNoc, setShowNoc] = useState<any>(null);

	const validEmailPattern = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{1,}';
  const validPhoneNumberPattern =
    '^(078|073|072|079|\\+25078|\\+25073|\\+25072|\\+25079)([0-9]){7}$';

	useEffect(() => {
		if (phoneNumber.trim() !== '') {
			setIsPhoneValid(!(new RegExp(validPhoneNumberPattern).test(phoneNumber)));
		}

		if (email.trim() !== '') {
			setIsEmailValid(!(new RegExp(validEmailPattern).test(email)));
		}
	}, [phoneNumber, email])

	const navigate = useNavigate();
	const redirect = (url: string) => navigate(url);

	const receiveRole = (data: any) => setRole(data);

	const receiveFile = (file: any) => setFile(file);

	// const receiveHtml = (html: any) => setDescription(html);

	const receiveShowNoc = (data: any) => setShowNoc(data);

	const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
		onCompleted: (data: any) => {
			user.avatar = data?.uploadFile

			createUser({ variables: { user } });
		},
		onError(err) {
			console.log(err);
		}
	});

	const user: any = {
		firstName,
		lastName,
		email,
		role: role?.value,
		age: parseFloat(age),
		showNoc: showNoc?.value
	}

	const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
		refetchQueries: [
			{
				query: QUERY_USERS, variables: { limit: 10, skip: 0 }
			},
			{
				query: GET_USERS_BY_ROLE, variables: { role: { roles: [EUserRole.SPEAKER] }}
			},
			{
				query: GET_USERS_BY_ROLE, variables: { role: { roles: [EUserRole.MODERATOR] }}
			}
		],
		onCompleted: (data) => {
			if (data) {
				notifySuccess("User has been created!");
				redirect('/admin/users');
			}
		},
		onError(err) {
			console.log(err);
		}
	});

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (role?.value === EUserRole.MODERATOR || role?.value === EUserRole.SPEAKER) {
			if (file) {
				uploadFile({ variables: { file } });
				return;
			} else {
				createUser({ variables: { user } });
			}
		} else {
			if (!file) {
				notifyError('Upload a profile picture.');
				return;
			}
			uploadFile({ variables: { file } });
		}
	};

	if (createLoading || uploading) return <Loader loading={(createLoading || uploading)} />;

  return (
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="mt-5 md:mt-0 md:col-span-3">
				<form onSubmit={handleSubmit}>
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
									<div>
										<input
											type="email"
											name="email"
											id="name"
											autoComplete="name"
											className={`${isEmailValid ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'} block w-full mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm`}
											value={email}
											onChange={e => setEmail(e.target.value)}
											required
											placeholder="Enter email address"
										/>
										{isEmailValid && (
											<span className="mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
												Invalid email address
											</span>
										)}
									</div>
								</div>

								<div className="col-span-6 sm:col-span-1">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Age
									</label>
									<input
										min="16"
										type="number"
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
									<div>
										<input
											type="text"
											name="phoneNumber"
											id="phoneNumber"
											autoComplete="phoneNumber"
											className={`${isPhoneValid ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'} block w-full mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm`}
											value={phoneNumber}
											onChange={e => setPhoneNumber(e.target.value)}
											placeholder="Enter phone number"
										/>
										{isPhoneValid && (
											<span className="mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
												Invalid Phone Number
											</span>
										)}
									</div>
								</div>

								<div className="col-span-6 sm:col-span-6 lg:col-span-2">
									<Select presetValue={showNoc} items={yesNo} isOptional={true} label="Can See NOC dashboard" sendData={receiveShowNoc} />
								</div>

								{/* <div className="col-span-6 sm:col-span-2"></div> */}

								<div className="col-span-6 sm:col-span-6 lg:col-span-2">
									<FileUpload sendFile={receiveFile}/>
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
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
  )
}