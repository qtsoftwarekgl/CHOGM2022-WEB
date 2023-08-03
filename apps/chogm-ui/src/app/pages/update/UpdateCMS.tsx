import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ECMSTypes } from "../../enums";
import { useCmsByCategoryQuery } from "../../generated/graphql";
import { useMutation, makeVar } from '@apollo/client';
import { UPDATE_CMS } from "./mutation";
import { Loader } from "../../components/Loader";
import Select from "../../components/Select";
import { qaTypes } from "../../@data";
import FileUpload from "../../components/upload/FileUpload";
import { UPLOAD_FILE } from "../../components/upload/mutation";
import { GET_CMS } from "../about/query";
import { notifySuccess, setValue } from "../../utils";
import Dropzone from 'react-dropzone';
import { UPLOAD_PDF_FILE } from "../create/mutation";
import { Editor } from "../../components/Editor";

export default function UpdateCMS() {
	const {id, cat} = useParams();
	const [name, setName] = useState<string>('');
	const [category, setCategory] = useState<any>(null);
	const [file, setFile] = useState<any>(null);
	const [qaType, setQaType] = useState<any>(null);
	const [description, setDescription] = useState<string>('');

	const [contactEmail, setContactEmail] = useState<string>('');
	const [contactPhone, setContactPhone] = useState<string>('');
	const [website, setWebsite] = useState<string>('');
	const [imageURL, setImageURL] = useState<string>('');
	const [pdfFile, setPDFFile] = useState<any>(null);
	const [pdfPreview, setPDFPreview] = useState<any>(null);
	const returnedFile = makeVar<any[]>([]);

	const location = useLocation();
	const { pathname } = location;

	const navigate = useNavigate();
	const redirect = (url: string) => navigate(url);

	const cType: any = { category: cat };

	const { data, loading } = useCmsByCategoryQuery({ variables: { category: cType } });

	useEffect(() => {
		if (data) {
			let contentData: any;
			if (data.cmsByCategory.length > 1) {
				contentData = data.cmsByCategory.filter(d => d.id === id);
			} else {
				contentData = data.cmsByCategory;
			}

			setName(contentData[0].name);
			setCategory(contentData[0].category);
			if (contentData[0].qaType) {
				const type = qaTypes.find(t => t.value === contentData[0].qaType);
				setQaType(type);
			}
			if (contentData[0].thumbnail) {
				setImageURL(contentData[0].thumbnail);
			}

			if (contentData[0].otherInfo !== null || contentData[0].otherInfo !== undefined) {
				setContactEmail(contentData[0].otherInfo?.contactEmail);
				setContactPhone(contentData[0].otherInfo?.contactPhone);
				setWebsite(contentData[0].otherInfo?.website);
				setPDFFile(contentData[0]?.otherInfo?.pdfFile);
			}

			setDescription(contentData[0].description);
		}
	}, [data, id]);
	
	const receiveQaType = (type: any) => setQaType(type);

	const receiveFile = (file: any) => setFile(file);

	const receiveHtml = (html: any) => {
		setDescription(html);
	};

	const onChange = (e: any) => {
		setPDFFile(e[0]);
		setPDFPreview(URL.createObjectURL(e[0]))
	}

	const removePDF = () => {
		setPDFFile(null);
	}

	const content: any = {
		cmsId: id,
		name,
		category,
		description,
		qaType: qaType?.value,
		...(category === ECMSTypes.TRANSPORT_CAR_RENTALS && {
			otherInfo: {
				contactEmail,
				contactPhone,
				website
			}
		})
	};

	const [uploadPDFFile] = useMutation(UPLOAD_PDF_FILE, {
		onCompleted: (data: any) => {
			if (data) {
				returnedFile([data?.uploadPDFFile]);
			}

			if (!!imageURL && typeof imageURL === 'string' && !file) {
				if (category === ECMSTypes.TRANSPORT_SHUTTLE_SERVICES) {
					setValue("otherInfo.pdfFile", returnedFile()[0], content);
				}

				updateCms({ variables: { content } });
				return;
			} else {
				uploadFile({ variables: { file } }).then((res) => {
					if (res?.data) {
						content.thumbnail = res.data?.uploadFile;
						setValue("otherInfo.pdfFile", returnedFile()[0], content);
						
						updateCms({ variables: { content } });
					}
				});
			}
		},
		onError(err) {
			console.log(err);
		}
	});

	const [uploadFile, { loading: uploading }] = useMutation(UPLOAD_FILE, {
		onCompleted: (data: any) => {
			if (category !== ECMSTypes.TRANSPORT_SHUTTLE_SERVICES) {
				content.thumbnail = data?.uploadFile;
	
				updateCms({ variables: { content } });
			}
		},
		onError(err) {
			console.log(err);
		}
	});

	const [updateCms, { loading: updateLoading }] = useMutation(UPDATE_CMS, {
		refetchQueries: [
			{
				query: GET_CMS, variables: { category: { category: cat } }
			}
		],
		onCompleted: (data: any) => {
			if (data) {
				if (pathname?.includes('about')) {
					notifySuccess("Content has been updated!");
					redirect('/admin/about');
				}

				if (pathname?.includes('information-centre')) {
					notifySuccess("Information Centre has been updated!");
					redirect('/admin/information-centre');
				}

				if (pathname?.includes('visit-rwanda')) {
					notifySuccess("Visit Rwanda has been updated!");
					redirect('/admin/visit-rwanda');
				}

				if (pathname?.includes('faqs')) {
					notifySuccess("FAQ has been updated!");
					redirect('/admin/faqs');
				}

				if (pathname?.includes('media')) {
					notifySuccess("Media has been updated!");
					redirect('/admin/media');
				}

				if (pathname?.includes('news')) {
					notifySuccess("News has been updated!");
					redirect('/admin/news');
				}

				if (pathname?.includes('transport')) {
					notifySuccess("Transport has been updated!");
					redirect('/admin/transport');
				}
			}
		},
		onError(err) { console.log(err) }
	});

	const handleUpdate = (e: any) => {
		e.preventDefault();

		if (category === ECMSTypes.TRANSPORT_SHUTTLE_SERVICES) {
			if (!file && !pdfFile && imageURL?.trim() === '') return;

			if (!!pdfFile && typeof pdfFile === 'object') {
				uploadPDFFile({ variables: { file: pdfFile } });
				return;
			}

			if (!!file && typeof file === 'object') {
				uploadFile({ variables: { file } });
				return;
			}

			updateCms({ variables: { content } });
		}

		if (category === ECMSTypes.NEWS || category === ECMSTypes.TRANSPORT_CAR_RENTALS) {
			if (!file && imageURL?.trim() === '') return;

			if (!!file && typeof file === 'object') {
				uploadFile({ variables: { file } });
				return;
			}
			updateCms({ variables: { content } });
		} else {
			updateCms({ variables: { content } });
		}
	}

	if (loading || uploading || updateLoading) return <Loader loading={(loading || uploading || updateLoading)} />
	
	return (
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="mt-5 md:mt-0 md:col-span-3">
				<form onSubmit={handleUpdate}>
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

								{category === ECMSTypes.QA && (
									<div className="col-span-6 sm:col-span-2">
										<Select items={qaTypes} label="QA Type" sendData={receiveQaType} presetValue={qaType} />
									</div>
								)}

								{(category === ECMSTypes.NEWS || category === ECMSTypes.TRANSPORT_CAR_RENTALS || category === ECMSTypes.TRANSPORT_SHUTTLE_SERVICES) && (
									<>
										<div className="col-span-6 sm:col-span-6 lg:col-span-4"></div>
										<div className="col-span-6 sm:col-span-6 lg:col-span-2">
											<FileUpload presetImg={imageURL} sendFile={receiveFile}/>
										</div>
										{/* <div className="col-span-6 sm:col-span-4"></div> */}
									</>
								)}

								{category === ECMSTypes.TRANSPORT_SHUTTLE_SERVICES && (
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
											<div className="flex items-center mt-2 space-x-1 text-sm text-gray-500">
												<div>
													<a href={typeof pdfFile === 'object' ? pdfPreview : pdfFile} className="pt-2 text-sm leading-normal text-blue-500 cursor-pointer hover:underline" target="_blank" rel="noopener noreferrer external">View PDF</a>
												</div>
												<button type="button" className="mr-1" onClick={removePDF}>
													<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
														<path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</button>
											</div>
										)}
									</div>
								)}

								{category === ECMSTypes.TRANSPORT_CAR_RENTALS && (
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
												placeholder="Enter contact email"
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
									<Editor sendHtml={receiveHtml} description={description} />
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
	);
}