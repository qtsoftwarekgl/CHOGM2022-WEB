import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { useNavigate } from 'react-router-dom'
import { AUTH_TOKEN, ROLE, USERNAME } from '../../../constants';
import {roles } from '../../@data'

export default function UMenu() {
	const [username, setUsername] = useState<any>();
	const [role, setRole] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const username = localStorage.getItem(USERNAME);
		if (!username) setUsername('Admin');

		setUsername(username);

		const role_ = localStorage.getItem(ROLE);
		if (role_) {
			setRole(role_);
		}
	}, []);

	const humanRole = () => {
		return roles.find(i => i.value === role)?.name;
	}

	const logout = () => {
		navigate('/');
		localStorage.removeItem(AUTH_TOKEN);
		localStorage.removeItem(USERNAME);
		localStorage.removeItem(ROLE);
	}

  return (
		<Menu as="div" className="relative inline-block text-left">
			<div className="flex">
				<Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-black rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
					<div className='flex gap-1'>
						<span> {username}</span>
						<span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full"> 
							{humanRole()} 
						</span>
					</div>
					<ChevronDownIcon
						className="w-5 h-5 ml-2 -mr-1 text-black hover:bg-opacity-80"
						aria-hidden="true"
					/>
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="px-1 py-1 ">
						{/* <Menu.Item>
							{({ active }) => (
								<button
									className={`${
										active ? 'bg-violet-500 text-white' : 'text-gray-900'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
								>
									Profile
								</button>
							)}
						</Menu.Item> */}
						<Menu.Item>
							{({ active }) => (
								<button
									className={`${
										active ? 'bg-violet-500 text-white' : 'text-gray-900'
										} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
									onClick={logout}
								>
									Log Out
								</button>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
  )
}