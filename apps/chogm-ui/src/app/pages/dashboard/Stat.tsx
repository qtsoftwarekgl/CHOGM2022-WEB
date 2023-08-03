import React from 'react';
import { gender } from "../../@data";


interface StatProps {
	label: string;
	data: any;
}


export default function Stat(props: React.PropsWithChildren<StatProps>) {
	const { label, data } = props;

    const bgColors = [
		'#81c926',
		'#ff747e',
		'#faca00',
		'#3b82f6'
	]

    const getRation = (num: number, {registered}: {registered: number}): string => {
		return ((num *  100) / registered).toFixed(1) + '%'
	}

  return (
    <div>
   		{data && (
        <div className="mb-4">
					<div className="">
						<div className="flex justify-between">
							<h3 className="font-semibold uppercase">{label}</h3>
							<h3 className="font-semibold">{data?.registered} Participants</h3>
						</div>
						<div className="mt-2 border-b border-gray-200 rounded-md shadow-md"></div>
					</div>

					<div className="grid w-full grid-cols-4 gap-4 py-3 space-y-4 overflow-x-scroll md:flex-row md:flex-wrap md:space-y-0">
						{data?.categories?.map((category: {name: string, count: number}, index: number) => (
							<div key={index}
							className="flex flex-col w-full px-4 py-4 space-y-2 bg-white border border-gray-200 rounded"
							style={{ height: '130px' }}
							>
								<p className="flex justify-between text-xs text-gray-700">
									<span className="font-semibold tracking-widest uppercase">{category.name}</span>
									<span className="font-medium">{category.count} participants</span>
								</p>
								<div className="flex flex-col space-y-3">
									<div className="flex items-center">
										<div className="mr-2">
											<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
												<g fill={bgColors[index]} fillRule="evenodd">
													<rect width="18" height="18" opacity=".2" rx="3" />
													<rect width="9.429" height="9.429" x="4.286" y="4.286" rx="2" />
												</g>
											</svg>
										</div>
										<p className="text-lg font-semibold text-gray-950">{getRation(category.count, data)}</p>
									</div>
									<div className="w-full bg-gray-200 rounded" style={{height: '6px'}}>
										<div className="rounded" style={{ width: `${getRation(category.count, data)}`, height: '6px', backgroundColor: `${bgColors[index]}` }}></div>
									</div>
								</div>
							</div>
						))}
						<div
							className="flex flex-col px-4 py-4 space-y-2 bg-white border border-gray-200 rounded w-fit"
							style={{ height: '130px' }}
						>
							<p className="text-xs font-medium tracking-wider text-gray-700 uppercase">Gender Attendance</p>
							<div className="flex justify-between md:space-x-4">
								{gender?.map((gender: any, index: number) => (
									<div className="flex flex-col space-y-3" key={index}>
										<div className="flex items-center">
											<div className="mr-2">
												<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
													<g fill={bgColors[index]} fillRule="evenodd">
														<rect width="18" height="18" opacity=".2" rx="3" />
														<rect width="9.429" height="9.429" x="4.286" y="4.286" rx="2" />
													</g>
												</svg>
											</div>
											<p className="text-lg font-semibold text-gray-950">{getRation(data.gender[0][gender.name], data)}</p>
										</div>
										<div className="w-full bg-gray-200 rounded" style={{height: '6px'}}>
											<div className="rounded" style={{ width: `${getRation(data.gender[0][gender.name], data)}`, height: '6px', backgroundColor: `${bgColors[index]}` }}></div>
										</div>
										<p className="text-xs font-medium tracking-widest text-gray-700 uppercase">{gender.name}</p>
									</div>
								))}
							</div>
						</div>
    			</div>
        </div>
      )}
    </div>
  )
}
