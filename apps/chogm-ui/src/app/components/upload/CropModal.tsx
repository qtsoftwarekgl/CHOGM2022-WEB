import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import ReactSlider from "react-slider";
import getCroppedImg from '../../utils/crop-image';

interface CropModalProps {
	isOpen: boolean;
	imageUrl: string;
	sendFile?: (e: any) => void;
	closeModal?: (e: boolean) => void;
}

export default function CropModal(props: React.PropsWithChildren<CropModalProps>) {
	const { isOpen, imageUrl, sendFile , closeModal} = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState<any>(null)

  const onCancel = () => {
		setCroppedImage(null);
		closeModal?.(false);
  }

	const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
		setCroppedAreaPixels(croppedAreaPixels)
	}, []);

	const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage: any = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation
			)
			
			setCroppedImage(croppedImage);
			if (croppedImage) {
				// console.log(croppedImage);
				sendFile?.(croppedImage);
			}
    } catch (e) {
			console.error(e);
    }
  }, [imageUrl, croppedAreaPixels, rotation, sendFile])

  return (
    <Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onCancel}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex items-center justify-center min-h-full p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="flex flex-col w-full max-w-2xl p-6 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-2xl">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									Image preview
								</Dialog.Title>
								<div className="relative mt-2" style={{ width: '100%', height: '400px' }}>
									<Cropper
										image={imageUrl}
										crop={crop}
										zoom={zoom}
										rotation={rotation}
										aspect={4/3}
										onCropChange={setCrop}
										onRotationChange={setRotation}
										onCropComplete={onCropComplete}
										onZoomChange={setZoom}
									/>
								</div>

								<div className="flex items-center mt-3">
									<p className="mr-2 font-medium">Zoom:</p>
									<ReactSlider
										step={0.1}
										min={1}
										max={3}
										className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md cursor-grab"
										thumbClassName="absolute w-5 h-5 cursor-grab bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 -top-6px"
										value={zoom}
										onChange={(value: any) => {
											setZoom(value);
										}}
									/>
								</div>

								<div className="flex items-center mt-3">
									<p className="mr-2 font-medium">Rotation:</p>
									<ReactSlider
										step={1}
										min={0}
										max={360}
										className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md cursor-grab"
										thumbClassName="absolute w-5 h-5 cursor-grab bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 -top-6px"
										value={rotation}
										onChange={(value: any) => {
											setRotation(value);
										}}
									/>
								</div>

								<div className="flex mt-4 space-x-3">
									<div className=''>
										<button
											type="button"
											className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											onClick={showCroppedImage}
										>
											Crop
										</button>
									</div>

									<div className=''>
										<button
											type="button"
											className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											onClick={onCancel}
										>
											Cancel
										</button>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
  )
}