import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { VERIFY_EMAIL } from "./mutation";

export default function ForgotPassword() {
	const [email, setEmail] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();
	const routeChange = (route: string) => {
		navigate(route);
	}

	const [forgotPassword] = useMutation(VERIFY_EMAIL, {
		onCompleted: (data) => {
			if (data?.verifyEmail) routeChange('/success');
		},
		onError(err) {
			console.log(err);
		}
	})

	const handleSubmit = (e: any) => {
		e.preventDefault();

		forgotPassword({ variables: { email } });
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-sky-900">
    <div className="absolute z-0 hidden transform rotate-45 bg-pink-600 w-60 h-60 rounded-xl -top-5 -left-16 md:block"></div>
    {/* <div className="absolute hidden w-48 h-48 transform bg-purple-300 rounded-xl -bottom-6 -right-10 rotate-12 md:block"></div> */}
    <div className="z-20 w-full px-6 pt-12 pb-6 bg-white shadow-xl md:w-fit md:px-12 rounded-2xl">
			<div>
				<h1 className="mb-4 text-3xl font-bold text-center cursor-pointer">Forgot Password</h1>
				<p className="mb-8 text-sm font-semibold tracking-wide text-center text-gray-700 cursor-pointer w-80">Thrilled to have you here!</p>
			</div>
			<form onSubmit={handleSubmit}>
				<div className="space-y-4">
					<input
						type="text"
						placeholder="Email Address"
						className="block w-full px-4 py-3 text-sm border rounded-lg outline-none"
						required
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<div className="mt-6 text-center">
					<button className="flex items-center justify-center w-full py-3 text-xl text-white transition duration-150 ease-in-out bg-teal-500 rounded-xl disabled:bg-teal-700" type="submit" disabled={loading}>
						<span className={`${loading && 'text-gray-300'}`}>Send Link</span>
						{loading && (	
							<span className="ml-2">
								<svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
							</span>
						)}
						</button>
						<Link to={"/"}>
							<p className="pt-2 text-sm text-blue-500 underline">Have an account already?</p>
						</Link>
				</div>
			</form>
    </div>
    <div className="absolute top-0 hidden w-40 h-40 bg-green-400 rounded-full right-12 md:block"></div>
    <div className="absolute hidden w-20 h-40 transform rotate-45 bg-orange-400 rounded-full bottom-20 left-10 md:block"></div>
	</div>
	)
}