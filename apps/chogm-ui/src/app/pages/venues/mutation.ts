import { gql } from '@apollo/client';

export const CREATE_VENUE = gql`
	mutation createVenue($venue: CreateVenueInput!) {
		createVenue(createVenueInput: $venue) {
			id,
			name,
			thumbnail,
			description,
			shortDescription,
			venueCategory
		}
	}
`;

export const UPDATE_VENUE = gql`
	mutation updateVenue($venue: UpdateVenueInput!) {
		updateVenue(UpdateVenueInput: $venue) {
			id,
			name,
			thumbnail,
			description,
			shortDescription,
			venueCategory
		}
	}
`;