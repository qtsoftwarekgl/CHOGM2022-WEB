import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { BROADCAST_MESSAGE } from './mutation';
import { useMutation } from '@apollo/client';
import { notifySuccess } from '../../utils';
import { BROADCASTED_MESSAGES } from './query';

interface BroadcastProps {
	isOpen: boolean;
	closeModal?: (e: boolean) => void;
}

export default function BroadcastModal(props: React.PropsWithChildren<BroadcastProps>) {
	const { isOpen, closeModal } = props;
	
	const [title, setTitle] = useState<string>('');
	const [message, setMessage] = useState<string>('');

	const onClose = () => closeModal?.(false);

	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (title.trim() === '' || message.trim() === '') return;
		sendMessage({ variables: { message, title } });
	}

	const [sendMessage, { loading }] = useMutation(BROADCAST_MESSAGE, {
		refetchQueries: [
			{
				query: BROADCASTED_MESSAGES
			}
		],
		onCompleted: (data: any) => {
			if (data?.BroadcastMessage) {
				notifySuccess('You have sent to all participants!');
				onClose();
			}
		}
	})

  return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
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
							<Dialog.Panel className="w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									Broadcast Message
								</Dialog.Title>
								<form className="w-full mt-2" onSubmit={handleSubmit}>
									<div className="flex flex-col space-y-3">
										<div>
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
												required
											/>
										</div>

										<div>
											<label htmlFor="about" className="block text-sm font-medium text-gray-700">
												Message
											</label>
											<div className="mt-1">
												<textarea
													id="description"
													name="description"
													rows={6}
													className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
													placeholder="Enter message"
													value={message}
													onChange={(e) => setMessage(e.target.value)}
													required
												/>
											</div>
										</div>

										<div className="flex space-x-2">
											<button
												disabled={loading}
												type="submit"
												className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											>
												Send
											</button>

											<button
												type="button"
												className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												onClick={onClose}
											>
												Cancel
											</button>
										</div>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
  )
}
