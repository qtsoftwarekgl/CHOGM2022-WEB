import { useMutation } from '@apollo/client';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import avatar from '../../../assets/img/avatar-placeholder.webp';
import { ENotificationType } from '../../enums';
import { useNotificationsQuery } from '../../generated/graphql';
import { humanNotification, sortByDate } from '../../utils';
import { UPDATE_NOTIFICATION } from './mutation';
import { GET_NOTIFICATIONS } from './query';
import { NOTIFICATION_EVENT } from './subscription';

interface ISubData {
	data: IData
}

interface IData {
	notifications: any;
	notificationEvent?: any;
}

export default function Notifications() {
	const [notifications, setNotifications] = useState<any[]>([]);
	const { data, subscribeToMore } = useNotificationsQuery();
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

	useEffect(() => {
		if (data?.notifications && data.notifications?.length > 0) {
			setNotifications(sortByDate(data.notifications))
		}
	}, [data?.notifications]);
	
	const useOutsideClick = (ref: any, callback: any) => {
		const handleClick = (e: any) => {
			if (ref.current && !ref.current.contains(e.target)) {
				callback();
			}
		};
		
		useEffect(() => {
			document.addEventListener("click", handleClick);
		
			return () => {
				document.removeEventListener("click", handleClick);
			};
		});
	};

	useOutsideClick(ref, () => {
		setIsOpen(false);
	});

	useEffect(() => {
		subscribeToMore({
			document: NOTIFICATION_EVENT,
			updateQuery: (prev, { subscriptionData }: { subscriptionData: ISubData }) => {
				if (!subscriptionData.data) return prev;

				const newNotification = subscriptionData.data['notificationEvent'];

				return {
					notifications: [...prev.notifications, newNotification].reverse(),
					__typename: prev.__typename
				}
			}
		});
	}, [subscribeToMore]);

	const [updateNotification] = useMutation(UPDATE_NOTIFICATION, {
		refetchQueries: [
			{
				query: GET_NOTIFICATIONS
			}
		],
		onCompleted: (data: any) => {
			console.log(data)
		},
		onError(err) {
			console.log(err);
		}
	});

	const dateFormatter = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		hour12: true,
		minute: 'numeric',
		timeZone: 'Asia/Dubai'
	});

	const handleUpdate = (id: string) => {
		const ids = {
			notificationIds: [id]
		}
		updateNotification({ variables: { ids } });
	}

	const routetoPage = (notification: any): string => {
		const route = notification?.type === ENotificationType.BOOKING_REQUEST ? 'bookings' : 'messages';
		return '/admin/' + route + '?notification_id=' + notification.payload.payloadId;
	}

  return (
    <div className="ml-2">
      <Menu as="div" className="relative inline-block text-left" ref={ref}>
				{({ open }) => (
					<>
						<Menu.Button onClick={() => setIsOpen(true)}
							className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full`}
							aria-haspopup="true"
						>
							<span className="sr-only">Notifications</span>
							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20">
								<path className="fill-current text-slate-500" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
							</svg>
							{ notifications?.filter(n => n.seen === false)?.length > 0 && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></div> }
						</Menu.Button>
						{isOpen && (
							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items static className={`${!!data && data.notifications?.length > 5 && 'overflow-y-scroll'} absolute right-0 w-[19.875rem] max-h-[34.375rem] mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
									<div className="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4">Notifications</div>
									{(notifications?.length === 0) && (
										<div className="px-3 py-4 bg-gray-50">
											<p className="text-xs font-semibold uppercase">No notifications</p>
										</div>
									)}
									{notifications?.filter(n => n.seen === false).map((nt, index: number) => (
										<Menu.Item key={index}>
											<div className={`border-b border-slate-200 last:border-0 ${nt.seen && 'bg-slate-50'}`}>
												<Link onClick={() => { setIsOpen(false); handleUpdate(nt.id) }}
													className="block px-4 py-2 hover:bg-slate-100"
													to={routetoPage(nt)}
												>
													<span className="block mb-1 text-sm" role="img" aria-label="emoji">
														{nt.type === 'BOOKING_REQUEST' && '📣'}	 
														{nt.type === 'NEW_CHAT_NOC' && '💬'}
														<span className="ml-1 font-medium text-slate-800">{humanNotification(nt.type)}</span>
													</span>
													<div className="flex items-center gap-1 mb-1">
														<img className="object-cover rounded-full w-7 h-7" src={nt.payload?.from?.avatar || avatar} alt="username" />
														<span className="block mb-2 text-sm">{nt.type === 'NEW_CHAT_NOC' && <span className='font-medium'>{nt.payload?.from?.firstName}: </span>} {nt.content}</span>
													</div>
													<span className="block text-xs font-medium text-slate-400">{dateFormatter.format(new Date(nt.createdDate))}</span>
												</Link>
											</div>
										</Menu.Item>
									))}
								</Menu.Items>
							</Transition>
						)}
					</>
				)}
      </Menu>
    </div>
  )
}