import React from 'react';
import { NavLink } from 'react-router-dom';
import notFound from '../../../assets/img/not-found.svg';

export default function NotFound() {
	return (
		<div className="flex flex-col justify-center">
			<div className="flex justify-center mb-6">
				<img src={notFound} alt="404 illustration" />
			</div>
			<div className="flex flex-col justify-center space-y-3">
				<p className="text-3xl font-semibold text-center">We couldn't connect the dots.</p>
				<p className="text-lg text-center">This page was not found. You may have mistyped the address or the page may have moved.</p>
				<div className="text-center">
					<NavLink end to="/admin/dashboard" className="text-blue-500 cursor-pointer text hover:underline">Take me to the dashboard</NavLink>
				</div>
			</div>
		</div>
	)
}