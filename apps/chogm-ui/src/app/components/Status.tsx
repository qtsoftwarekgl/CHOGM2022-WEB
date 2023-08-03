export default function Status({ state }: { state: boolean }) {
	return (
		<div className={`${state ? 'bg-green-500' : 'bg-red-500'} w-fit px-3 py-1 text-xs font-medium text-white rounded-full`}>{state ? 'Active' : 'Inactive'}</div>
	)
}