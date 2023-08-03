import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "../../components/Select"
import { ECMSTypes } from "../../enums";
import { useMutation, makeVar } from '@apollo/client';
import { CREATE_CMS, UPLOAD_PDF_FILE } from "./mutation";
import { Loader } from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { GET_CMS } from "../about/query";
import { aboutTypes, cmsTypes, qaTypes, transportTypes } from "../../@data";
import { UPLOAD_FILE } from "../../components/upload/mutation";
import FileUpload from "../../components/upload/FileUpload";
import { notifySuccess, setValue } from "../../utils";
import Dropzone from 'react-dropzone';
import { Editor } from "../../components/Editor";

export default function CreateCMS() {
	const [name, setName] = useState<string>('');
	const [categories, setCategories] = useState<any[]>([]);
	const [category, setCategory] = useState<any>(null);
	const [file, setFile] = useState<any>(null);
	const [qaType, setQaType] = useState<any>(null);
	const [description, setDescription] = useState<string>('');
	const [isMultiRefetch, setMultiRefetch] = useState<boolean>(false);
	const [contactEmail, setContactEmail] = useState<string>('');
	const [contactPhone, setContactPhone] = useState<string>('');
	const [website, setWebsite] = useState<string>('');
	const [pdfFile, setPDFFile] = useState<any>(null);

	const returnedFile = makeVar<any[]>([]);
	
	const location = useLocation();
	const { pathname } = location;

	useEffect(() => {
		if (pathname?.includes('about')) {
			// multiple refetch (ABOUT & COMSEC)
			setMultiRefetch(true);
			setCategories(aboutTypes)
		}

		if (pathname?.includes('information-centre')) {
			setCategory(cmsTypes[3]);
		}

		if (pathname?.includes('faqs')) {
			setCategory(cmsTypes[2]);
		}

		if (pathname?.includes('visit-rwanda')) {
			// multiple fetch (TRANSIT VISA, VISITORS VISA & VISA ON ARRIVAL)
			setMultiRefetch(true);
			const cats = cmsTypes.filter((type: any) => (type?.value.includes('VISA')));
			setCategories(cats);
		}

		if (pathname?.includes('media')) {
			setCategory(cmsTypes[7]);
		}

		if (pathname?.includes('news')) {
			setCategory(cmsTypes[1]);
		}

		if (pathname?.includes('transport')) {
			// multiple fetch (SHUTTLE & RENTALS)
			setMultiRefetch(true);
			setCategories(transportTypes);
		}
	
	}, [pathname]);

	const receiveCMSType = (category: any) => setCategory(category);

	const receiveQaType = (type: any) => setQaType(type);

	const receiveFile = (file: any) => setFile(file);

	const receiveHtml = (html: any) => setDescription(html);

	const navigate = useNavigate();
	const redirect = (url: string) => navigate(url);

	let cat: any;
	if (pathname?.includes('information-centre')) {
		cat = { category: ECMSTypes.USEFUL_INFO };
	}

	if (pathname?.includes('faqs')) {
		cat = { category: ECMSTypes.QA };
	}

	if (pathname?.includes('media')) {
		cat = { category: ECMSTypes.MEDIA };
	}

	if (pathname?.includes('news')) {
		cat = { category: ECMSTypes.NEWS };
	}

	const content: any = {
		name,
		category: category?.value,
		...(category?.value === ECMSTypes.QA && { qaType: qaType?.value }),
		...(category?.value === ECMSTypes.TRANSPORT_CAR_RENTALS && {
			otherInfo: {
				contactEmail,
				contactPhone,
				website
			}
		}),
		description
	}

	const [uploadPDFFile] = useMutation(UPLOAD_PDF_FILE, {
		onCompleted: (data: any) => {
			if (data) {
				returnedFile([data?.uploadPDFFile]);
			}

			uploadFile({ variables: { file } }).then((res) => {
				if (res?.data) {
					content.thumbnail = res.data?.uploadFile;
					setValue("otherInfo.pdfFile", returnedFile()[0], content);
					
					createCms({ variables: { content } });
				}
			});
		},
		onError(err) {
			console.log(err);
		}
	});

	const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
		onCompleted: (data: any) => {
			if (category?.value !== ECMSTypes.TRANSPORT_SHUTTLE_SERVICES) {
				content.thumbnail = data?.uploadFile;
	
				createCms({ variables: { content } });
			}
		},
		onError(err) {
			console.log(err);
		}
	});

	const getRefetches = (): any[] => {
		if (pathname?.includes('about')) {
			return [
				{
					query: GET_CMS, variables: { category: { category: ECMSTypes.ABOUT_CONFERENCE }}
				},
				{
					query: GET_CMS, variables: { category: { category: ECMSTypes.COMSEC }}
				},
				{
					query: GET_CMS, variables: { category: { category: ECMSTypes.PRIVACY_POLICY }}
				},
				{
					query: GET_CMS, variables: { category: { category: ECMSTypes.TOLL_NUMBER }}
				}
			]
		} else if (pathname?.includes('transport')) {
			return [
				{
					query: GET_CMS, variables: { category: { category: ECMSTypes.TRANSPORT_CAR_RENTALS } }
				},
				{
					query: GET_CMS, variables: { category: { category: ECMSTypes.TRANSPORT_SHUTTLE_SERVICES } }
				}
			]
		} else {
			return [
				{
					query: GET_CMS, variables: { category: { category: ECMSTypes.TRANSIT_VISA } }
				},
				{
					query: GET_CMS, variables: { category: { category: ECMSTypes.VISA_ON_ARRIVAL } }
				},
				{
					query: GET_CMS, variables: { category: { category: ECMSTypes.VISITORS_VISA } }
				},
			]
		}
	}

	const [createCms, { loading }] = useMutation(CREATE_CMS, {
		refetchQueries: isMultiRefetch ? getRefetches() : [ 
			{
				query: GET_CMS, variables: { category: cat }
			},
		],
		onCompleted: (data: any) => {
			if (data) {
				if (pathname?.includes('about')) {
					notifySuccess("About has been created!");
					redirect('/admin/about');
				}

				if (pathname?.includes('information-centre')) {
					notifySuccess("Information Centre has been created!");
					redirect('/admin/information-centre');
				}

				if (pathname?.includes('visit-rwanda')) {
					notifySuccess("Visit Rwanda has been created!");
					redirect('/admin/visit-rwanda');
				}

				if (pathname?.includes('faqs')) {
					notifySuccess("FAQ has been created!");
					redirect('/admin/faqs');
				}

				if (pathname?.includes('media')) {
					notifySuccess("Media has been created!");
					redirect('/admin/media');
				}

				if (pathname?.includes('news')) {
					notifySuccess("News has been created!");
					redirect('/admin/news');
				}

				if (pathname?.includes('transport')) {
					notifySuccess("Transport has been created!");
					redirect('/admin/transport');
				}
			}
		}
	});

	const onChange = (e: any) => {
		setPDFFile(e[0]);
	}

	const removePDF = () => {
		setPDFFile(null);
	}

	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (category?.value === ECMSTypes.TRANSPORT_SHUTTLE_SERVICES) {
			uploadPDFFile({ variables: { file: pdfFile } });
			return;
		}

		if (category?.value === ECMSTypes.TRANSPORT_CAR_RENTALS || category?.value === ECMSTypes.NEWS) {
			uploadFile({ variables: { file } });
			return;
		} else {
			createCms({ variables: { content } });
		}
	}

	if (loading || uploading) return <Loader loading={(loading || uploading)} />

	return (
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="mt-5 md:mt-0 md:col-span-3">
				<form onSubmit={handleSubmit}>
					<div className="overflow-hidden shadow sm:rounded-md">
						<div className="px-4 py-5 bg-white sm:p-6">
							<div className="grid grid-cols-6 gap-6">
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
										value={name}
										onChange={e => setName(e.target.value)}
										placeholder="Enter title"
									/>
								</div>

								{categories.length > 0 && (
									<div className="col-span-6 sm:col-span-2">
										<Select presetValue={category} items={categories} label="Content Type" sendData={receiveCMSType} />
									</div>
								)}

								{category?.value === ECMSTypes.QA && (
									<div className="col-span-6 sm:col-span-2">
										<Select presetValue={qaType} items={qaTypes} label="QA Type" sendData={receiveQaType} />
									</div>
								)}

								{(category?.value === ECMSTypes.NEWS) && (
									<>
										<div className="col-span-6 sm:col-span-6 lg:col-span-4"></div>
										<div className="col-span-6 sm:col-span-6 lg:col-span-2">
											<FileUpload sendFile={receiveFile}/>
										</div>
									</>
								)}

								{(category?.value === ECMSTypes.TRANSPORT_CAR_RENTALS || category?.value === ECMSTypes.TRANSPORT_SHUTTLE_SERVICES) && (
									<>
										<div className="col-span-6 sm:col-span-6 lg:col-span-2"></div>
										<div className="col-span-6 sm:col-span-6 lg:col-span-2">
											<FileUpload sendFile={receiveFile}/>
										</div>
									</>
								)}

								{category?.value === ECMSTypes.TRANSPORT_SHUTTLE_SERVICES && (
									<div className="col-span-6 sm:col-span-6 lg:col-span-2">
										<label className="block text-sm font-medium text-gray-700">Document</label>
										{!pdfFile ? (
											<Dropzone onDrop={(e: any) => onChange(e)}>
												{({ getRootProps, getInputProps }) => (
													<div {...getRootProps({ className: 'drop-zone' })} className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md">
														<div className="space-y-1 text-center">
															<svg
																className="w-12 h-12 mx-auto text-gray-400"
																stroke="currentColor"
																fill="none"
																viewBox="0 0 48 48"
																aria-hidden="true"
															>
																<path
																	d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
																	strokeWidth={2}
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
															</svg>
															<div className="flex text-sm text-gray-600">
																<label
																	htmlFor="file-upload"
																	className="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
																>
																	<span>Upload a file</span>
																	<input className="sr-only" {...getInputProps()} />
																</label>
																<p className="pl-1">or drag and drop</p>
															</div>
															<p className="text-xs text-gray-500">PDF up to 10MB</p>
														</div>
													</div>
												)}
											</Dropzone>
										) : (
											<div className="flex items-center text-sm text-gray-500">
													<strong>Selected file:</strong>
													<span className="flex items-center text-purple-500">
														<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
															<path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
														</svg>
														<span>{pdfFile?.name}</span>
													</span>
													<button type="button" className="ml-1" onClick={removePDF}>
														<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
															<path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
														</svg>
													</button>
											</div>
										)}
									</div>
								)}

								{category?.value === ECMSTypes.TRANSPORT_CAR_RENTALS && (
									<>
										<div className="col-span-6 sm:col-span-2">
											<label htmlFor="name" className="block text-sm font-medium text-gray-700">
												Contact Email
											</label>
											<input
												type="text"
												name="name"
												id="name"
												autoComplete="name"
												className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												value={contactEmail}
												onChange={e => setContactEmail(e.target.value)}
												placeholder="Enter email address"
											/>
										</div>
										<div className="col-span-6 sm:col-span-2">
											<label htmlFor="name" className="block text-sm font-medium text-gray-700">
												Contact Phone
											</label>
											<input
												type="text"
												name="name"
												id="name"
												autoComplete="name"
												className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												value={contactPhone}
												onChange={e => setContactPhone(e.target.value)}
												placeholder="Enter contact phone"
											/>
										</div>
										<div className="col-span-6 sm:col-span-2">
											<label htmlFor="name" className="block text-sm font-medium text-gray-700">
												Website
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
									</>
								)}

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