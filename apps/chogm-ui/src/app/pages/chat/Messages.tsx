import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useBroacastedMessagesQuery } from '../../generated/graphql';
import { formatDate } from '../../utils';

interface BroadcastProps {
	isOpen: boolean;
	closeModal?: (e: boolean) => void;
}

export default function Messages(props: React.PropsWithChildren<BroadcastProps>) {
	const { isOpen, closeModal } = props;
	
	const { data } = useBroacastedMessagesQuery();

  const onClose = () => closeModal?.(false);

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
									Broadcasted Messages
								</Dialog.Title>
								<div className="mt-2">
									{!!data && data.broadcastedMessages.length === 0 && (<p className="py-3 font-semibold">No broadcast messages.</p>)}
									<ul className="space-y-2">
										{!!data && data.broadcastedMessages.map((bm, index) => (
											<li className="flex flex-col pb-2 space-y-2 border-b borer-gray-200" key={index}>
												<p className="text-sm font-semibold">{bm.payload.title}</p>
												<p className="text-sm">{bm.content}<span className="p-2 mt-2 text-xs font-semibold rounded-xl">{formatDate.format(new Date(bm.createdDate))}</span></p>
											</li>
										))}
									</ul>
								</div>

								<div className="mt-4">
									<button
										type="button"
										className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
										onClick={onClose}
									>
										Close
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
  )
}