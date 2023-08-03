import React, { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

interface MultiSelectProps {
	label: string;
	items: any[];
	presetValue?: any[];
	sendData?: (data: any) => void;
}

export default function MultiSelect(props: React.PropsWithChildren<MultiSelectProps>) {
	const { label, items, presetValue, sendData } = props;
	const [selected, setSelected] = useState<any[]>([]);
	const [query, setQuery] = useState<string>('');

	const filtered =
		query === ''
			? items
			: items.filter((item) =>
				item.lastName
					?.toLowerCase()
					?.replace(/\s+/g, '')
					?.includes(query?.toLowerCase()?.replace(/\s+/g, '')) ||
				
				item.firstName
					?.toLowerCase()
					?.replace(/\s+/g, '')
					?.includes(query?.toLowerCase()?.replace(/\s+/g, ''))
			);
	
	useEffect(() => {
		if (presetValue) {
			setSelected(presetValue);
		}
	}, [presetValue]);
	
	const onChange = (e: any) => {
		const arr = [...new Map(e.map((item: any) => [item["id"], item])).values()];
		setSelected(arr);
		sendData?.(arr);
	}

  return (
		<Combobox value={selected} onChange={onChange} multiple>
			<Combobox.Label className="block text-sm font-medium text-gray-700">{label}</Combobox.Label>
			<div className="relative mt-1">
				<div className="relative w-full overflow-hidden text-left bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
					<Combobox.Input
						className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0"
						displayValue={(item: any) => item.map((p: any) => p?.lastName + " " + p?.firstName)?.join(", ")}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Select"
					/>
					<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
						<SelectorIcon
							className="w-5 h-5 text-gray-400"
							aria-hidden="true"
						/>
					</Combobox.Button>
				</div>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery('')}
				>
					<Combobox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white border border-gray-300 rounded-md max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{(filtered.length === 0 && query !== '' || filtered.length === 0) ? (
							<div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
								Nothing found.
							</div>
						) : (
							filtered.map((item) => (
								<Combobox.Option
									key={item.id}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active ? 'bg-indigo-600 text-white' : 'text-gray-900'
										}`
									}
									value={item}
									disabled={!item?.status}
								>
									{({ selected, active }) => (
										<>
											<span
												className={`block truncate ${
													selected || presetValue?.some(sp => sp.id === item.id) ? 'font-medium' : 'font-normal'
												} ${!item.status ? 'opacity-75' : ''}`}
											>
												{item.lastName} {item.firstName}
											</span>
											{selected || presetValue?.some(sp => sp.id === item.id) ? (
												<span
													className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
														active ? 'text-white' : 'text-indigo-600'
													}`}
												>
													<CheckIcon className="w-5 h-5" aria-hidden="true" />
												</span>
											) : null}
										</>
									)}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
  )
}