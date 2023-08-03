import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { LOGIN } from "./mutation";
import { AUTH_TOKEN, ROLE, USERNAME } from "../../../constants";
import { roles } from "../../@data";

interface IUser {
	email: string;
	password: string;
}

export default function Login() {
	const navigate = useNavigate();
	const routeChange = (route: string) => {
		navigate(`/admin/${route}`);
	}

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const [login, { loading }] = useMutation(LOGIN, {
		onCompleted: (data) => {
			if (!data?.UserLogin?.token) return;
			
			localStorage.setItem(AUTH_TOKEN, data?.UserLogin?.token);
			localStorage.setItem(USERNAME, data?.UserLogin?.user.firstName + ' ' + data?.UserLogin?.user?.lastName);
			localStorage.setItem(ROLE, data?.UserLogin?.user.role[0]);
			
			const permissions:string[] = roles.find(r => r.value === data?.UserLogin?.user.role[0])?.permissions || [];
			const route = permissions?.includes('all') ? 'dashboard' : permissions[0]; 

			routeChange(route);
		},
		onError(err) { console.log(err) }
	})

	const payload: IUser = {
		email,
		password
	}

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (email.trim() === '' || password.trim() === '') return;

		login({ variables: { payload } });
	}

	const togglePassword = () => (setShowPassword(!showPassword));

	return (
		<div className="flex items-center justify-center min-h-screen bg-sky-900">
    <div className="absolute z-0 hidden transform rotate-45 bg-pink-600 w-60 h-60 rounded-xl -top-5 -left-16 md:block"></div>
    {/* <div className="absolute hidden w-48 h-48 transform bg-purple-300 rounded-xl -bottom-6 -right-10 rotate-12 md:block"></div> */}
    <div className="z-20 w-full px-6 pt-12 pb-6 bg-white shadow-xl md:w-fit md:px-12 rounded-2xl">
			<div>
				<h1 className="mb-4 text-3xl font-bold text-center cursor-pointer">Sign In</h1>
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
					<div className="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder="Password"
							className="block w-full px-4 py-3 text-sm border rounded-lg outline-none"
							required
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<span className="absolute inset-y-0 right-0 flex items-center pl-2">
							<button type="button" className="p-1 focus:outline-none focus:shadow-outline" onClick={togglePassword}>
								{ showPassword ? <EyeOff /> : <Eye/> }
							</button>
						</span>
					</div>
				</div>
				<div className="mt-6 text-center">
					<button className="flex items-center justify-center w-full py-3 text-xl text-white transition duration-150 ease-in-out bg-teal-500 rounded-xl disabled:bg-teal-700" type="submit" disabled={loading}>
						<span className={`${loading && 'text-gray-300'}`}>Login</span>
						{loading && (	
							<span className="ml-2">
								<svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							</span>
						)}
						</button>
						<Link to={"/forgot-password"}>
							<p className="pt-2 text-sm text-blue-500 underline">Forgot Password?</p>
						</Link>
				</div>
			</form>
    </div>
    <div className="absolute top-0 hidden w-40 h-40 bg-green-400 rounded-full right-12 md:block"></div>
    <div className="absolute hidden w-20 h-40 transform rotate-45 bg-orange-400 rounded-full bottom-20 left-10 md:block"></div>
	</div>
	)
}

const Eye = () => (
	<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
	</svg>
)

const EyeOff = () => (
	<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
	</svg>
)