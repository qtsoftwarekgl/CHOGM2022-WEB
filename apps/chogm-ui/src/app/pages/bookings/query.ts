import { gql } from '@apollo/client';

export const QUERY_BOOKINGS = gql`
	query bookings {
		bookings {
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
			},
			createdDate
		}
	}
`;