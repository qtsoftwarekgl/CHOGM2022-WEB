import { gql } from '@apollo/client';

export const BOOKING_REQUEST = gql`
	subscription bookingRequest {
		bookingRequestEvent {
			id,
			room {
				id,
				name,
				amenities {
					camera,
					conditioner,
					projector,
					microphone,
					wifi
				},
				thumbnail,
				availability,
				venue {
					id,
					name
				}
			},
			startDate,
			endDate,
			status,
			user {
				id,
				firstName,
				lastName,
				avatar,
				role
			}
		}
	}
`;