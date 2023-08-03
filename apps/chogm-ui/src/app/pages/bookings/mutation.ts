import { gql } from '@apollo/client';

export const APPROVE_BOOKING = gql`
	mutation approveBooking($booking: ApproveBookingInput!) {
		approveBooking(ApproveBookingInput: $booking) {
			id,
			startDate,
			endDate,
			status,
			message
		}
	}
`;