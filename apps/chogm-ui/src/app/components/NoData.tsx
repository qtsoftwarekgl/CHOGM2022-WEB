import nodata from '../../assets/img/no-data.svg';

export default function NoData() {

	return (
		<div className="flex items-center justify-center">
			<div className="flex flex-col items-center py-6 space-y-5 bg-white shadow-lg rounded-2xl">
				<div>
					<img src={nodata} alt="No data illustration" />
				</div>
				<div className="flex flex-col items-center space-y-2">
					<p className="text-xl font-semibold">Not Data Found</p>
					<div className="w-full text-center md:w-2/3">
						<p className="text-sm">Please try again with another keywords or maybe use generic term</p>
					</div>
				</div>
				<div>
					<button className="px-4 py-3 text-sm text-white bg-blue-500 rounded-full cursor-pointer hover:bg-blue-300">
						Search Again
					</button>
				</div>
			</div>
		</div>
	);
}