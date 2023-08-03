import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/img/chogm-2022.png';
import { ROLE } from '../../constants';
import { roles } from '../@data';
import carIcon from '../../assets/img/car.svg';
import mediaIcon from '../../assets/img/media.svg';
import newsIcon from '../../assets/img/news.svg';
import bookingsIcon from '../../assets/img/bookings.svg';

function Sidebar ({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean, setSidebarOpen: any }) {
	const location = useLocation();
  const { pathname } = location;

  const trigger: any = useRef(null);
  const sidebar: any = useRef(null);
  const [role, setRole] = useState('');

	const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
	const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

	// close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: any }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current?.contains(target) || trigger.current?.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
		localStorage.setItem('sidebar-expanded', sidebarExpanded?.toString());
		if (sidebarExpanded) {
			document.querySelector('body')?.classList.add('sidebar-expanded');
		} else {
			document?.querySelector('body')?.classList.remove('sidebar-expanded');
		}
  }, [sidebarExpanded]);

	useEffect(() => {
		const role_ = localStorage.getItem(ROLE);
    if (role_) {
      setRole(role_)
    }
	}, []);

  const routeGuard = (route: string): boolean => {
    const permissions = roles.find(r => r.value === role)?.permissions;
    return permissions && permissions?.length > 0 ? permissions?.includes(route) || permissions?.includes('all') : false
  }

	return (
		<div>
			 {/* Sidebar backdrop (mobile only) */}
			<div className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden="true"></div>
			
			<div
				id="sidebar"
        ref={sidebar}
				className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}
			>
				{/* Sidebar header */}
        <div className="flex justify-between pr-3 mb-10 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/admin/dashboard" className="block">
            <img src={logo} alt="Logo" />
          </NavLink>
				</div>

				{/* Links */}
				<div className="space-y-8">
					{/* Pages group */}
					<div>
						<h3 className="pl-3 text-xs font-semibold uppercase text-slate-500">
              <span className="hidden w-6 text-center lg:block lg:sidebar-expanded:hidden 2xl:hidden" aria-hidden="true">•••</span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
						</h3>
						<ul className="mt-3">
							{/* Dashboard */}
              {routeGuard('dashboard') && (
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('dashboard') && 'bg-slate-900'}`}>
                  <NavLink end to="/admin/dashboard" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('dashboard') && 'hover:text-slate-200'}`}>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                        <path className={`fill-current text-slate-400 ${pathname.includes('dashboard') && '!text-indigo-500'}`} d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" />
                        <path className={`fill-current text-slate-600 ${pathname.includes('dashboard') && 'text-indigo-600'}`} d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z" />
                        <path className={`fill-current text-slate-400 ${pathname.includes('dashboard') && 'text-indigo-200'}`} d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z" />
                      </svg>
                      <span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">Dashboard</span>
                    </div>
                  </NavLink>
                </li>
              )}
							{/* About CHOGM 2022 */}
              {routeGuard('about') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('about') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/about" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('about') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
											<circle className={`fill-current text-slate-400 ${pathname.includes('about') && 'text-indigo-300'}`} cx="18.5" cy="5.5" r="4.5" />
											<circle className={`fill-current text-slate-600 ${pathname.includes('about') && 'text-indigo-500'}`} cx="5.5" cy="5.5" r="4.5" />
											<circle className={`fill-current text-slate-600 ${pathname.includes('about') && 'text-indigo-500'}`} cx="18.5" cy="18.5" r="4.5" />
											<circle className={`fill-current text-slate-400 ${pathname.includes('about') && 'text-indigo-300'}`} cx="5.5" cy="18.5" r="4.5" />
										</svg>
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											About CHOGM 2022</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* Venues */}
              {routeGuard('venues') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('venues') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/venues" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('venues') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
											<path className={`fill-current text-slate-600 ${pathname.includes('venues') && 'text-indigo-500'}`} d="M19.714 14.7l-7.007 7.007-1.414-1.414 7.007-7.007c-.195-.4-.298-.84-.3-1.286a3 3 0 113 3 2.969 2.969 0 01-1.286-.3z" />
											<path className={`fill-current text-slate-400 ${pathname.includes('venues') && 'text-indigo-300'}`} d="M10.714 18.3c.4-.195.84-.298 1.286-.3a3 3 0 11-3 3c.002-.446.105-.885.3-1.286l-6.007-6.007 1.414-1.414 6.007 6.007z" />
											<path className={`fill-current text-slate-600 ${pathname.includes('venues') && 'text-indigo-500'}`} d="M5.7 10.714c.195.4.298.84.3 1.286a3 3 0 11-3-3c.446.002.885.105 1.286.3l7.007-7.007 1.414 1.414L5.7 10.714z" />
											<path className={`fill-current text-slate-400 ${pathname.includes('venues') && 'text-indigo-300'}`} d="M19.707 9.292a3.012 3.012 0 00-1.415 1.415L13.286 5.7c-.4.195-.84.298-1.286.3a3 3 0 113-3 2.969 2.969 0 01-.3 1.286l5.007 5.006z" />
										</svg>
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											Venues</span>
                  </div>
                </NavLink>
              </li>
              )}
							{/* Events */}
              {routeGuard('events') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('events') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/events" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('events') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
											<path className={`fill-current text-slate-400 ${pathname.includes('events') && 'text-indigo-300'}`} d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z" />
											<path className={`fill-current text-slate-700 ${pathname.includes('events') && '!text-indigo-600'}`} d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z" />
											<path className={`fill-current text-slate-600 ${pathname.includes('events') && 'text-indigo-500'}`} d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z" />
										</svg>
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											Events</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* Users */}
              {routeGuard('users') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('users') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/users" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('users') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
											<path className={`fill-current text-slate-600 ${pathname.includes('users') && 'text-indigo-500'}`} d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z" />
											<path className={`fill-current text-slate-400 ${pathname.includes('users') && 'text-indigo-300'}`} d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z" />
										</svg>
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											Users</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* Rooms */}
              {routeGuard('rooms') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('rooms') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/rooms" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('rooms') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path className={`fill-current text-slate-600 ${pathname.includes('rooms') && 'text-indigo-500'}`} d="M1 3h22v20H1z" />
                      <path className={`fill-current text-slate-400 ${pathname.includes('rooms') && 'text-indigo-300'}`} d="M21 3h2v4H1V3h2V1h4v2h10V1h4v2Z" />
                    </svg>
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											Rooms</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* Programmes */}
              {routeGuard('programmes') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('programmes') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/programmes" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('programmes') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path className={`fill-current text-slate-600 ${pathname.includes('programmes') && 'text-indigo-500'}`} d="M0 20h24v2H0z" />
                      <path className={`fill-current text-slate-400 ${pathname.includes('programmes') && 'text-indigo-300'}`} d="M4 18h2a1 1 0 001-1V8a1 1 0 00-1-1H4a1 1 0 00-1 1v9a1 1 0 001 1zM11 18h2a1 1 0 001-1V3a1 1 0 00-1-1h-2a1 1 0 00-1 1v14a1 1 0 001 1zM17 12v5a1 1 0 001 1h2a1 1 0 001-1v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1z" />
                    </svg>
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											Programmes</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* Information Centre */}
              {routeGuard('information-centre') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('information-centre') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/information-centre" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('information-centre') && 'hover:text-slate-200'}`}>
									<div className="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
											<path className={`fill-current text-slate-600 ${pathname.includes('information-centre') && 'text-indigo-500'}`} fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
										</svg>
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											Information Centre</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* FAQs */}
              {routeGuard('faqs') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('faqs') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/faqs" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('faqs') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path className={`fill-current text-slate-600 ${pathname.includes('faqs') && 'text-indigo-500'}`} d="M8 1v2H3v19h18V3h-5V1h7v23H1V1z" />
                      <path className={`fill-current text-slate-600 ${pathname.includes('faqs') && 'text-indigo-500'}`} d="M1 1h22v23H1z" />
                      <path className={`fill-current text-slate-400 ${pathname.includes('faqs') && 'text-indigo-300'}`} d="M15 10.586L16.414 12 11 17.414 7.586 14 9 12.586l2 2zM5 0h14v4H5z" />
                    </svg>
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											FAQs</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* Visit Rwanda */}
              {routeGuard('visit-rwanda') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('visit-rwanda') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/visit-rwanda" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('visit-rwanda') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path className={`fill-current text-slate-600 ${pathname.includes('visit-rwanda') && 'text-indigo-500'}`} d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z" />
                      <path className={`fill-current text-slate-400 ${pathname.includes('visit-rwanda') && 'text-indigo-300'}`} d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z" />
                    </svg>
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											Visit Rwanda</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* Media */}
              {routeGuard('media') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('media') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/media" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('media') && 'hover:text-slate-200'}`}>
										<div className="flex items-center">
										<img src={mediaIcon} alt="media icon" className="w-6 h-6" />
                    {/* <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path className={`fill-current text-slate-600 ${pathname.includes('media') && 'text-indigo-500'}`} d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z" />
                      <path className={`fill-current text-slate-400 ${pathname.includes('media') && 'text-indigo-300'}`} d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z" />
                    </svg> */}
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											Media</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* News */}
              {routeGuard('news') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('news') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/news" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('news') && 'hover:text-slate-200'}`}>
										<div className="flex items-center">
										<img src={newsIcon} alt="news icon" />
                    {/* <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path className={`fill-current text-slate-600 ${pathname.includes('news') && 'text-indigo-500'}`} d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z" />
                      <path className={`fill-current text-slate-400 ${pathname.includes('news') && 'text-indigo-300'}`} d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z" />
                    </svg> */}
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											News</span>
                  </div>
                </NavLink>
							</li>
              )}
							{/* Transport */}
              {routeGuard('transport') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('transport') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/transport" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('transport') && 'hover:text-slate-200'}`}>
										<div className="flex items-center">
										<img src={carIcon} alt="car icon" className="w-6 h-6" />
                    {/* <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path className={`fill-current text-slate-600 ${pathname.includes('transport') && 'text-indigo-500'}`} d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z" />
                      <path className={`fill-current text-slate-400 ${pathname.includes('transport') && 'text-indigo-300'}`} d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z" />
                    </svg> */}
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
											Transport</span>
                  </div>
                </NavLink>
							</li>
							)}
							{/* Bookings */}
              {routeGuard('bookings') && (
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('bookings') && 'bg-slate-900'}`}>
                <NavLink end to="/admin/bookings" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('bookings') && 'hover:text-slate-200'}`}>
									<div className="flex items-center">
										<img src={bookingsIcon} alt="car icon" className="w-6 h-6" />
										<span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">Bookings</span>
                  </div>
                </NavLink>
							</li>
              )}
						</ul>
					</div>
				</div>
				
				{/* Expand / collapse button */}
        <div className="justify-end hidden pt-3 mt-auto lg:inline-flex 2xl:hidden">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
			</div>
		</div>
	)
}

export default Sidebar;