import { formatDate } from "../utils";

export default function AuditInfo({ createdBy, updatedBy }: { createdBy: any, updatedBy: any[] }) {
	return (
		<div className="flex flex-col mt-2 space-y-1">
			<p className="text-xs">Created  by <span className="text-sm font-semibold">{createdBy.user.firstName} {createdBy.user.lastName}</span>  at <span className="text-sm font-semibold">{formatDate.format(new Date(createdBy.date))}</span></p>
			{
				updatedBy.length > 0 && (
					<div className="">
						<p className="text-xs">Last updated by <span className="text-sm font-semibold">{updatedBy[updatedBy.length - 1].user.firstName} {updatedBy[updatedBy.length - 1].user.lastName}</span> at <span className="text-sm font-semibold">{formatDate.format(new Date(updatedBy[updatedBy.length - 1].date))}</span></p>
					</div>
				)
			}
		</div>
	)
}