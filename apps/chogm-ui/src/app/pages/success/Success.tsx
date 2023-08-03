
export default function Success() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-sky-900">
    <div className="absolute z-0 hidden transform rotate-45 bg-pink-600 w-60 h-60 rounded-xl -top-5 -left-16 md:block"></div>
    {/* <div className="absolute hidden w-48 h-48 transform bg-purple-300 rounded-xl -bottom-6 -right-10 rotate-12 md:block"></div> */}
    <div className="z-20 px-12 pt-12 pb-6 text-green-700 bg-green-100 shadow-xl rounded-2xl">
			<div>
				<h1 className="mb-4 text-3xl font-bold text-center cursor-pointer">Success</h1>
				<p className="mb-8 text-sm font-semibold tracking-wide text-center text-gray-700 cursor-pointer w-80">We have sent you a recovery link, check your email to proceed.</p>
			</div>
    </div>
    <div className="absolute top-0 hidden w-40 h-40 bg-green-400 rounded-full right-12 md:block"></div>
    <div className="absolute hidden w-20 h-40 transform rotate-45 bg-orange-400 rounded-full bottom-20 left-10 md:block"></div>
	</div>
	);
}