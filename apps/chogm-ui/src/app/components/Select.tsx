import React, { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

interface SelectProps {
	label: string;
	items: any[] | undefined;
	sendData?: (data: any) => void;
	presetValue?: any;
	displayValue?: any;
	anotherDisValue?: any;
	loading?: boolean;
  isOptional?: boolean;
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

export default function Select(props: React.PropsWithChildren<SelectProps>) {
	const { items, label, sendData, presetValue, displayValue, anotherDisValue, loading, isOptional } = props;
	const [selected, setSelected] = useState<any>(null);

	const onChange = (e: any) => {
		setSelected(e);
		sendData?.(e);
	}

	useEffect(() => {
		// if (!presetValue) return;
		
		setSelected(presetValue);
	}, [presetValue]);

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">{label} {isOptional && (<span className="text-xs font-normal text-gray-600">(Optional)</span>)}</Listbox.Label>
          <div className="relative mt-1">
						<Listbox.Button className={`${loading ? 'bg-gray-200' : 'bg-white'} relative w-full py-2 pl-3 pr-10 text-left border border-gray-300 rounded-md shadow-sm cursor-default select-btn focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}>
							{loading ? (
								<div className="flex justify-between">
									<span>Loading...</span>
									<span className="">
										<svg className="w-5 h-5 text-gray-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									</span>
								</div>
							) : (
								<>
									<span className="flex items-center">
										{/* <img src={selected.avatar} alt="" className="flex-shrink-0 w-6 h-6 rounded-full" /> */}
										<span className="block truncate">{selected === null ? <span className="text-gray-400">Select</span> : selected?.name}</span>
									</span>
									<span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
										<SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
									</span>
								</>
							)}
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
							<Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{items?.length === 0 && (<Listbox.Option className="relative py-2 pl-3 select-none pr-9" value="" disabled><div className="text-sm">No data found</div></Listbox.Option>)}
                {items?.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9'
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {/* <img src={item.avatar} alt="" className="flex-shrink-0 w-6 h-6 rounded-full" /> */}
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {!displayValue && !anotherDisValue ? item.name : item[displayValue] + " " + item[anotherDisValue] }
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
