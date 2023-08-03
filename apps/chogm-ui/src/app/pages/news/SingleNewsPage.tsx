import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { useCmsQuery } from "../../generated/graphql";
import { formatDate } from "../../utils";

export default function SingleNewsPage() {
	const { id } = useParams();

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { data, loading } = useCmsQuery({ variables: { id: id! } });
	
	if (loading) return <Loader loading={loading} />

	return (
		<div className="flex flex-col w-full p-6 bg-white rounded-lg">
			{!!data?.cms && (
				<>
					<div className=""><h3 className="text-2xl font-semibold">{data.cms.name}</h3></div>
					<div className="mt-2 mb-2 border border-gray-100"></div>
					{data.cms?.thumbnail && (
						<div>
							<img src={data.cms?.thumbnail} alt="Thumbnail" />
						</div>
					)}
					<div className="text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: data.cms?.description }}></div>
					<div className="flex justify-end mt-5">
						<div className="flex flex-col space-y-1">
							<p className="text-sm">Last updated at <span className="font-semibold">{formatDate.format(new Date(data.cms.updatedDate))}</span></p>
							<p className="text-sm">Created at <span className="font-semibold">{formatDate.format(new Date(data.cms.createdDate))}</span></p>
						</div>
					</div>
				</>
			)} 
		</div>
	)
}