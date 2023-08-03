import { useEffect, useRef, useState } from "react";
import Dropzone from 'react-dropzone';
import CropModal from "./CropModal";
interface FileUploadProps {
	presetImg?: any;
	sendFile(file: any): void;
}

const generateRandomString = (length: any): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const FileUpload = (props: React.PropsWithChildren<FileUploadProps>) => {
	const { presetImg, sendFile } = props;
	
	const [file, setFile] = useState<any>(null);
	const [previewSrc, setPreviewSrc] = useState('');
	const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
	const dropRef = useRef(document.createElement("div"));

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [imageURL, setImageURL] = useState<string>('');
	const [fileName, setFileName] = useState<string>('');

	const closeModal = (e: boolean) => setIsOpen(e);

	useEffect(() => {
		if (presetImg) {
			setIsPreviewAvailable(true)
			setPreviewSrc(presetImg);
			setImageURL(presetImg);
		}
	}, [presetImg]);
	
	const onDrop = (files: any) => {
		const [uploadedFile] = files;

		setFileName(uploadedFile?.name);
		setFile(uploadedFile);
		sendFile(uploadedFile);

		const fileReader: any = new FileReader();
		fileReader.onload = () => {
			setPreviewSrc(fileReader.result);
		}
		fileReader.readAsDataURL(uploadedFile);
		setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));

		// TODO: change image name on edit
		// setFileName(uploadedFile?.name);
		// setImageURL(URL.createObjectURL(uploadedFile));
		// setIsOpen(true);

		// const fileReader: any = new FileReader();
		// fileReader.onload = () => {
		// 	setPreviewSrc(fileReader.result);
		// }
		// fileReader.readAsDataURL(uploadedFile);
		// setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
	}

	const updateBorder = (dragState: any) => {
		if (dragState === 'over') {
			dropRef.current.style.border = '2px solid #000';
		} else if (dragState === 'leave') {
			dropRef.current.style.border = '2px dashed #e9ebeb';
		}
	};

	const removeImage = () => {
		setFile(null);
		setPreviewSrc('');
		setIsPreviewAvailable(false);
	}

	// const receiveFile = async (e: any) => {
	// 	setPreviewSrc(e);
	// 	setIsPreviewAvailable(true);
	// 	setIsOpen(false);

	// 	await fetch(e).then(r => r.blob()).then(blobFile => {
	// 		const type = blobFile.type.replace("image/", "");
	// 		const file = new File([blobFile], `${generateRandomString(10)}.${type}`, { type: blobFile.type });
	// 		setFile(file);
	// 		sendFile(file);
	// 	});
	// };

	const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
		<>
			<label className="block text-sm font-medium text-gray-700">Cover photo</label>
			{previewSrc ? (
				isPreviewAvailable ? (
					<div className="flex flex-col py-3 mt-1 rounded">
						<div className="img-container" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
							<img src={previewSrc} alt="Preview" className="preview-image" />
							{isHovering && (
								<div className="absolute" style={{ top: '10px', right: '16px' }}>
									<button type="button" className="mr-1" onClick={removeImage}>
										<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
									{/* <button type="button" className="float-right" onClick={() => setIsOpen(true)}>
										<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
											<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
											<path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
										</svg>
									</button> */}
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center p-3 mt-1 space-y-3 border border-gray-200 rounded">
						<p className="text-sm text-gray-500">No preview available for this file</p>
						<div>
							<button
								onClick={removeImage}
								className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Upload again
							</button>
						</div>
					</div>
				)
			) : (
				<Dropzone onDrop={onDrop}
					onDragEnter={() => updateBorder('over')}
					onDragLeave={() => updateBorder('leave')}
				>
					{({ getRootProps, getInputProps }) => (
						<div {...getRootProps({ className: 'drop-zone' })} ref={dropRef} className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md">
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
								{file && (
									<div className="text-sm text-gray-500">
										<strong>Selected file:</strong> {file?.name}
									</div>
								)}
								<p className="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
							</div>
						</div>
					)}
				</Dropzone>
			)}
			{/* <CropModal isOpen={isOpen} imageUrl={imageURL} sendFile={receiveFile} closeModal={closeModal}/> */}
		</>
  );
};
export default FileUpload;