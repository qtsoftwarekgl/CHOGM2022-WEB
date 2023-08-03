import React, { useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { AUTH_TOKEN } from '../../constants';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function AdminLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const token = localStorage.getItem(AUTH_TOKEN);

	if (!token) {
    return <Navigate to="/" replace />;
  }

	return (
		<div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
			<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

			{/* Content area */}
			<div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
				<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				<main>
					<div className="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-9xl">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	)
}

export default AdminLayout;