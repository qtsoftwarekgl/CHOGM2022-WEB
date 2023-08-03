// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NetworkDetector from './hoc/NetworkDetector';
import AdminLayout from './layouts/AdminLayout';
import About from './pages/about/About';
import Bookings from './pages/bookings/Bookings';
import ChangePassword from './pages/change-password/ChangePassword';
import Chat from './pages/chat/Chat';
import CreateCMS from './pages/create/CreateCMS';
import Dashboard from './pages/dashboard/Dashboard';
import FAQ from './pages/faq/FAQ';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import CreateForum from './pages/forums/CreateForum';
import Forums from './pages/forums/Forums';
import UpdateForum from './pages/forums/UpdateForum';
import InformationCentre from './pages/information-centre/InformationCentre';
import Login from './pages/login/Login';
import Media from './pages/media/Media';
import News from './pages/news/News';
import SingleNewsPage from './pages/news/SingleNewsPage';
import NotFound from './pages/not-found/NotFound';
import CreateProgramme from './pages/programmes/CreateProgramme';
import Programmes from './pages/programmes/Programmes';
import UpdateProgramme from './pages/programmes/UpdateProgramme';
import CreateRoom from './pages/rooms/CreateRoom';
import Rooms from './pages/rooms/Rooms';
import UpdateRoom from './pages/rooms/UpdateRoom';
import Success from './pages/success/Success';
import Transport from './pages/transport/Transport';
import UpdateCMS from './pages/update/UpdateCMS';
import CreateUser from './pages/users/CreateUser';
import UpdateUser from './pages/users/UpdateUser';
import Users from './pages/users/Users';
import CreateVenue from './pages/venues/CreateVenue';
import UpdateVenue from './pages/venues/UpdateVenue';
import Venues from './pages/venues/Venues';
import VisitRwanda from './pages/visit-rwanda/VisitRwanda';


export function App() {
  return (
    <>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
			{/* Feel free to move and update them to fit your needs */}

			<Routes>
				<Route path="/success" element={<Success />} />
				<Route path="/" element={<Login />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/change-password" element={<ChangePassword />} />
        <Route path="/admin" element={<AdminLayout/>}>
					<Route
						path="dashboard"
						element={
							<React.Suspense fallback={<>...</>}>
								<Dashboard />
							</React.Suspense>
						}
					/>
					<Route
						path="about"
						element={
							<React.Suspense fallback={<>...</>}>
								<About />
							</React.Suspense>
						}
					/>
					<Route
						path="about/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="about/:cat/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="events"
						element={
							<React.Suspense fallback={<>...</>}>
								<Forums />
							</React.Suspense>
						}
					/>
					<Route
						path="events/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateForum />
							</React.Suspense>
						}
					/>
					<Route
						path="events/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateForum />
							</React.Suspense>
						}
					/>
					<Route
						path="venues"
						element={
							<React.Suspense fallback={<>...</>}>
								<Venues />
							</React.Suspense>
						}
					/>
					<Route
						path="venues/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateVenue />
							</React.Suspense>
						}
					/>
					<Route
						path="venues/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateVenue />
							</React.Suspense>
						}
					/>
					<Route
						path="programmes"
						element={
							<React.Suspense fallback={<>...</>}>
								<Programmes />
							</React.Suspense>
						}
					/>
					<Route
						path="programmes/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateProgramme />
							</React.Suspense>
						}
					/>
					<Route
						path="programmes/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateProgramme />
							</React.Suspense>
						}
					/>
					<Route
						path="users"
						element={
							<React.Suspense fallback={<>...</>}>
								<Users />
							</React.Suspense>
						}
					/>
					<Route
						path="users/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateUser />
							</React.Suspense>
						}
					/>
					<Route
						path="users/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateUser />
							</React.Suspense>
						}
					/>
					<Route
						path="rooms"
						element={
							<React.Suspense fallback={<>...</>}>
								<Rooms />
							</React.Suspense>
						}
					/>
					<Route
						path="rooms/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateRoom />
							</React.Suspense>
						}
					/>
					<Route
						path="rooms/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateRoom />
							</React.Suspense>
						}
					/>
					<Route
						path="information-centre"
						element={
							<React.Suspense fallback={<>...</>}>
								<InformationCentre />
							</React.Suspense>
						}
					/>
					<Route
						path="information-centre/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="information-centre/:cat/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="faqs"
						element={
							<React.Suspense fallback={<>...</>}>
								<FAQ />
							</React.Suspense>
						}
					/>
					<Route
						path="faqs/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="faqs/:cat/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="visit-rwanda"
						element={
							<React.Suspense fallback={<>...</>}>
								<VisitRwanda />
							</React.Suspense>
						}
					/>
					<Route
						path="visit-rwanda/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="visit-rwanda/:cat/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="media"
						element={
							<React.Suspense fallback={<>...</>}>
								<Media />
							</React.Suspense>
						}
					/>
					<Route
						path="media/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="media/:cat/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="news"
						element={
							<React.Suspense fallback={<>...</>}>
								<News />
							</React.Suspense>
						}
					/>
					<Route
						path="news/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="news/:cat/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="news/view/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<SingleNewsPage />
							</React.Suspense>
						}
					/>
					<Route
						path="transport"
						element={
							<React.Suspense fallback={<>...</>}>
								<Transport />
							</React.Suspense>
						}
					/>
					<Route
						path="transport/create"
						element={
							<React.Suspense fallback={<>...</>}>
								<CreateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="transport/:cat/:id"
						element={
							<React.Suspense fallback={<>...</>}>
								<UpdateCMS />
							</React.Suspense>
						}
					/>
					<Route
						path="bookings"
						element={
							<React.Suspense fallback={<>...</>}>
								<Bookings />
							</React.Suspense>
						}
					/>
					{/* <Route
						path="messages"
						element={
							<React.Suspense fallback={<>...</>}>
								<Chat />
							</React.Suspense>
						}
					/> */}
					<Route
						path="*"
						element={<NotFound />}
					/>
				</Route>
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default NetworkDetector(App);
