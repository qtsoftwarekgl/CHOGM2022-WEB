import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import avatar from '../../assets/img/avatar-placeholder.webp';
import { humanRole } from '../utils';

interface ReviewsProps {
	isOpen: boolean;
	closeModal: (e: boolean) => void;
	ratings: any[];
}

export default function Reviews(props: React.PropsWithChildren<ReviewsProps>) {
	const { isOpen, closeModal, ratings } = props;

	return (
		<Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-4xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="div"
                    className="flex items-center justify-between"
									>
										<p className="text-lg font-medium leading-6 text-gray-900">Reviews</p>
										<div className="cursor-pointer" onClick={() => closeModal(false)}>
											<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-600" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</div>
									</Dialog.Title>
									<div className="mt-2 md:grid md:grid-cols-3 md:gap-6">
										<div className="mt-5 md:mt-0 md:col-span-3">
										<div className="grid grid-cols-6 gap-6">
												{ratings?.map((rt, index) => (
													<div className="col-span-6 sm:col-span-3" key={index}>
														<div className="flex flex-col p-4 bg-gray-100 rounded-lg">
															<div className="flex justify-between">
																<div className="flex">
																	<div className="w-10 h-10 mr-3">
																		<img className="rounded-2xl" src={(rt.user.avatar === '' || !rt.user.avatar) ? avatar : rt.user.avatar } alt="avatar" />
																	</div>
																	<div>
																		<p className="text-sm font-semibold">{rt.user?.firstName} {rt.user?.lastName}</p>
																		<p className="text-sm font-semibold">{humanRole(rt.user?.role?.[0])}</p>
																	</div>
																</div>
																<div className="flex items-center">
																	{Array.from({ length: 5 }, (_, i) => (
																		<svg
																			key={i}
																			xmlns="http://www.w3.org/2000/svg"
																			className={i < rt.stars ? 'text-orange-400 h-4 w-4 fill-orange-400' : 'text-gray-500 h-4 w-4 fill-transparent'}
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																			strokeWidth={2}
																		>
																			<path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
																		</svg>
																	))}
																</div>
															</div>
															<div className="mt-4">
																<p className="text-sm italic text-gray-800">{rt.comment === '' ? 'No comment' : rt.comment}</p>
															</div>
														</div>
													</div>
												))}
											</div>
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