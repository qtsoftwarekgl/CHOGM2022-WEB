import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROLE } from '../../constants';
import { EUserRole } from '../enums';
import UMenu from './header/UMenu';
import Notifications from './notifications/Notifications';

function Header({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean, setSidebarOpen: any }) {
	const location = useLocation();
	const { pathname } = location;
	
	const navigate = useNavigate();
	const routeChange = (url: string) => navigate(url);

	const role = localStorage.getItem(ROLE);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">

          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          {/* Header: Right side */}
					<div className="flex items-center">
						{/* <div className="relative inline-flex">
							<button
								className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ${pathname.includes('messages') && 'bg-slate-200'}`}
								aria-haspopup="true"
								onClick={() => routeChange('messages')}
							>
								<span className="sr-only">Messages</span>
								<svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
									<path className="fill-current text-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V12l2.699-1.542A7.454 7.454 0 006.5 11c3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0z" />
									<path className="fill-current text-slate-400" d="M16 9.5c0-.987-.429-1.897-1.147-2.639C14.124 10.348 10.66 13 6.5 13c-.103 0-.202-.018-.305-.021C7.231 13.617 8.556 14 10 14c.449 0 .886-.04 1.307-.11L15 16v-4h-.012C15.627 11.285 16 10.425 16 9.5z" />
								</svg>
								<div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></div>
							</button>
						</div> */}

						{(role === EUserRole.COMMAND_POST || role === EUserRole.ADMIN) && (<Notifications/>)}

            {/*  Divider */}
            <hr className="w-px h-6 mx-3 bg-slate-200" />
						<UMenu />
						{/* <UserMenu/> */}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;