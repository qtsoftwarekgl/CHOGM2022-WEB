import { useEffect, useState } from 'react';
import avatar from '../../../assets/img/avatar-placeholder.webp';
import { useCategorizedChatsQuery, useGetChatsByNocQuery } from '../../generated/graphql';
import { useMutation } from '@apollo/client';
import { REPLY_CHAT } from './mutation';
import { GET_CHATS_BY_NOC } from './query';
import { groupByKey, sortByDate, timeSince } from '../../utils';
import { CHAT_EVENT } from './subscription';
import { useLocation } from 'react-router-dom';
import noMessages from '../../../assets/img/no-messages.png'
import { ROLE } from 'apps/chogm-ui/src/constants';
import { EQAtypes, EUserRole } from '../../enums';
import BroadcastModal from './BroadcastModal';
import Messages from './Messages';

interface ISubData {
	data: IData
}

interface IData {
	chatsByNOC: any;
	chatEvent?: any;
}

export default function Chat() {
	const [chatId, setChatId] = useState<string>('');
	const [user, setUser] = useState<any>(null);
	const [messagesList, setMessagesList] = useState<any[]>([]);
	const [message, setMessage] = useState<string>('');
	const [allChats, setAllChats] = useState<any>({});
	const [query, setQuery] = useState<string>('');
	const [isMsgValid, setMsgValid] = useState<boolean>(false);

	const search = useLocation().search;
	const notificationId = new URLSearchParams(search).get('notification_id');
	
	const role = localStorage.getItem(ROLE);

	const { data, subscribeToMore } = useGetChatsByNocQuery({ variables: {}, skip: role === EUserRole.TRANSPORT });

	useEffect(() => {
		if (data?.chatsByNOC && data.chatsByNOC.length > 0) {
			setAllChats(groupByKey(sortByDate(data.chatsByNOC), 'queryType'));
		}
	}, [data?.chatsByNOC]);

	const type: any = { queryType: EQAtypes.TRANSPORT };

	const { data: transportChats, subscribeToMore: subscribeToTransportChats } = useCategorizedChatsQuery({ variables: { type }, skip: role !== EUserRole.TRANSPORT });

	useEffect(() => {
		if (role === EUserRole.TRANSPORT) {
			subscribeToTransportChats({
				document: CHAT_EVENT,
				updateQuery: (prev, { subscriptionData }: { subscriptionData: ISubData }) => {
					if (!subscriptionData.data) return prev;
	
					const newChatEvent = subscriptionData.data['chatEvent'];
					setMessagesList(newChatEvent.messages);
	
					return {
						categorizedChats: [...prev.categorizedChats.filter(pv => pv.id !== newChatEvent.id), newChatEvent],
						__typename: prev.__typename
					}
				}
			});
		}
	}, [subscribeToTransportChats, role]);

	useEffect(() => {
		subscribeToMore({
			document: CHAT_EVENT,
			updateQuery: (prev, { subscriptionData }: { subscriptionData: ISubData }) => {
				if (!subscriptionData.data) return prev;

				const newChatEvent = subscriptionData.data['chatEvent'];
				setMessagesList(newChatEvent.messages);

				return {
					chatsByNOC: [...prev.chatsByNOC.filter(pv => pv.id !== newChatEvent.id), newChatEvent],
					__typename: prev.__typename
				}
			}
		})
	}, [subscribeToMore]);

	const [replyChat, { loading }] = useMutation(REPLY_CHAT, {
		refetchQueries: [
			{
				query: GET_CHATS_BY_NOC
			}
		],
		onCompleted: (data) => {
			if (data) {
				setMessagesList(data?.replyChat.messages);
			}
		},
		onError(err) {
			console.log(err);
		}
	});
	
	const handleReply = (e: any) => {
		e.preventDefault();

		if (message?.trim() === '') {
			setMsgValid(true);
			return;
		}

		const reply = {
			chatId,
			message,
			sender: null
		};

		replyChat({ variables: { reply }});
		setMessage('');
	}

	useEffect(() => {
		if (message?.trim() !== '') {
			setMsgValid(false);
			return;
		}

		const chat_ = role === EUserRole.TRANSPORT ? transportChats?.categorizedChats.find(it => it?.id === notificationId) : data?.chatsByNOC.find(it => it?.id === notificationId);
		if (notificationId && chat_) {
			setChatId(chat_?.id);
			setUser(chat_?.users?.[0]);
			setMessagesList(chat_?.messages);
		}
	}, [data?.chatsByNOC, notificationId, role, transportChats?.categorizedChats, message]);

	const [isOpen, setIsOpen] = useState(false);
	const [msgModal, setMsgModal] = useState(false);

	const closeModal = (e: boolean) => setIsOpen(e);
	const closeMsgModal = (e: boolean) => setMsgModal(e);

	return (
		<>
			<BroadcastModal isOpen={isOpen} closeModal={closeModal} />
			<Messages isOpen={msgModal} closeModal={closeMsgModal} />
			<div className="flex justify-end mb-3">
				<button className="mr-3 text-white bg-indigo-500 btn hover:bg-indigo-600" onClick={() => setIsOpen(true)}>
					Broadcast message
				</button>
				<button onClick={() => setMsgModal(true)} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
					Broadcasted message
				</button>
			</div>
			<div className="min-w-full bg-white border rounded lg:grid lg:grid-cols-3">
				<div className="border-r border-gray-300 lg:col-span-1">
					<div className="mx-3 my-3">
						<div className="relative text-gray-600">
							<span className="absolute inset-y-0 left-0 flex items-center pl-2">
								<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
									viewBox="0 0 24 24" className="w-6 h-6 text-gray-300">
									<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
								</svg>
							</span>
							<input
								style={{ backgroundColor: '#efefef' }}
								type="search"
								className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								name="search"
								placeholder="Search"
								required
								value={query}
								onChange={e => {
									setQuery(e.target.value);
								}}
							/>
						</div>
					</div>

					<ul className="h-full overflow-auto">
						<div className="px-3 py-2">
						<h2 className="text-lg text-gray-600">Chats</h2>
						</div>
						<li>
							{role === EUserRole.TRANSPORT ? (
								<div>
									{!!transportChats && transportChats.categorizedChats.map((chat, index) => (
										// eslint-disable-next-line jsx-a11y/anchor-is-valid
										<a onClick={() => {
											setChatId(chat.id);
											setUser(chat.users?.[0]);
											setMessagesList(chat.messages);
										}} key={index} className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
											<img className="object-cover w-10 h-10 rounded-full" src={chat?.users?.[0]?.avatar || avatar} alt="username" />
											<div className="w-full pb-2">
												<div className="flex justify-between">
													<span className="block ml-2 font-semibold text-gray-600">{chat?.users?.[0].firstName} {chat?.users?.[0].lastName}</span>
													<span className="block ml-2 text-sm text-gray-600">{timeSince(new Date(chat?.messages?.[chat.messages.length - 1].createdDate))}</span>
												</div>
												<span className="block ml-2 text-sm text-gray-600">{`${chat?.messages?.[chat.messages.length - 1].message.slice(0, 30)}...`}</span>
											</div>
										</a>
									))}
								</div>
							) : (
								<div className="flex flex-col">
									{Object.keys(allChats).map((k, index) => (
										<div key={index}>
											<div className="px-3 py-2">
												<h4 className="text-sm font-medium uppercase">{k.replace(/_+/g, ' ')}</h4>
											</div>
											{allChats?.[k]?.map((chat: any, index: number) => (
												// eslint-disable-next-line jsx-a11y/anchor-is-valid
												<a onClick={() => {
													setChatId(chat.id);
													setUser(chat.users?.[0]);
													setMessagesList(chat.messages);
												}} key={index} className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
													<img className="object-cover w-10 h-10 rounded-full" src={chat?.users?.[0]?.avatar || avatar} alt="username" />
													<div className="w-full pb-2">
														<div className="flex justify-between">
															<span className="block ml-2 font-semibold text-gray-600">{chat?.users?.[0].firstName} {chat?.users?.[0].lastName}</span>
															<span className="block ml-2 text-sm text-gray-600">{timeSince(new Date(chat?.messages?.[chat.messages.length - 1].createdDate))}</span>
														</div>
														<span className="block ml-2 text-sm text-gray-600">{`${chat?.messages?.[chat.messages.length - 1].message.slice(0, 30)} ${chat?.messages?.[chat.messages.length - 1].message.length > 30 ? '...' : ''}`}</span>
													</div>
												</a>
											))}
										</div>
									))}
								</div>
							)}
						</li>
					</ul>
				</div>
				<div className="hidden lg:col-span-2 lg:block">
					<div className="w-full">
						{user && (	
							<div className="relative flex items-center p-3 border-b border-gray-300">
								<img className="object-cover w-10 h-10 rounded-full" src={user.avatar || avatar} alt="username" />
								<span className="block ml-2 font-bold text-gray-600">{user?.firstName} {user?.lastName}</span>
							</div>
						)}
						<div className="relative w-full p-6 overflow-y-auto h-[40rem] bg-slate-50">
							{messagesList?.length === 0 && (<div className='flex flex-col items-center justify-center h-full gap-1'>
								<img src={noMessages} className="w-56 h-56" alt="no messages illustration" />
								<h2 className="flex text-lg font-medium text-gray-600">No Selected chat!</h2>
								<p className="flex text-sm text-gray-600">Please select any chat from the left panel</p>
							</div>)}
							<ul className="space-y-2">
								{messagesList?.length > 0 && messagesList.map((msg: any, index: number) => (
									<li key={index} className={`flex ${msg.sender === null ? 'justify-end' : 'justify-start'}`}>
										<div className={`relative max-w-xl px-4 py-2 rounded-lg shadow ${msg.sender === null ? 'text-white bg-slate-700': 'text-gray-700 bg-gray-100'}`}>
											<span className="block">{msg?.message}</span>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
							<div className="block w-full mx-3">
								<input
									type="text"
									placeholder="Message"
									className={`block w-full bg-gray-100 rounded-full outline-none focus:text-gray-700 ${isMsgValid && 'border-red-500'}`}
									name="message"
									required
									value={message}
									onChange={e => setMessage(e.target.value)}
								/>
								{isMsgValid && (
									<span className="mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
										Please enter a message
									</span>
								)}
							</div>
							<button type="submit" onClick={handleReply}>
								<svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20" fill="currentColor">
									<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}