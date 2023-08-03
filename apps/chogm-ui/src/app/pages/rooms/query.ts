import { gql } from '@apollo/client';

export const QUERY_ROOMS = gql`
  query Rooms {
		rooms {
			id,
			name,
			isMediaRoom,
			availability,
			bookable,
			thumbnail,
			description,
			capacity,
			venue {
				id,
				name,
				shortDescription
			},
			amenities {
				camera,
				conditioner,
				microphone,
				projector,
				wifi
			},
			state,
			createdBy {
				date,
				user {
					id,
					firstName,
					lastName
				}
			},
			updatedBy {
				date,
				user {
					id,
					firstName,
					lastName
				}
			}
		}
	}
`;

export const QUERY_ROOM = gql`
	query Room($id: String!) {
		room(id: $id) {
			id,
			name,
			isMediaRoom,
			availability,
			bookable,
			thumbnail,
			description,
			capacity,
			venue {
				id,
				name,
				shortDescription
			},
			amenities {
				camera,
				conditioner,
				microphone,
				projector,
				wifi
			}
		}
	}
`;

export const AVAILABLE_ROOMS = gql`
	query availableRooms {
		availableRooms {
			id,
			name,
			availability,
			description,
			thumbnail
		}
	}
`;

export const AVAILABLE_ROOMS_BY_DATE_RANGE = gql`
	query availableRoomsByDateRange($range: DateRangeInput!) {
		availableRoomsDateRange(dateRangeInput: $range) {
			id,
			name,
			availability,
			description,
			thumbnail
		}
	}
`;