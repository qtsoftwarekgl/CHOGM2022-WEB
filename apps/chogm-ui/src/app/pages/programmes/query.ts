import { gql } from '@apollo/client';

export const QUERY_PROGRAMMES = gql`
	query Programmes {
		programmes {
			id,
			title
			startDate,
			endDate,
			broadcastLink,
			description,
			forum {
				id,
				name,
				startDate,
				endDate
			},
			room {
				id,
				name,
				availability,
				venue {
          id,
          name
        }
			},
			speakers {
				id,
				firstName,
				lastName
			},
			moderator {
				id,
				firstName,
				lastName
			},
			rating {
				rate,
				rating {
					comment,
					createdDate,
					stars,
					user {
						id,
						firstName,
						lastName,
						avatar,
						role
					}
				}
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

export const QUERY_PROGRAMME = gql`
	query Programme($id: String!) {
		programme(id: $id) {
			id,
			title,
			broadcastLink,
			description,
			startDate,
			endDate,
			forum {
				id,
				name,
				startDate,
				endDate
			},
			room {
				id,
				name,
				availability
			},
			speakers {
				age,
				avatar,
				biography,
				description,
				email,
				firstName,
				id,
				lastName,
				role,
				status
			},
			moderator {
				age,
				avatar,
				biography,
				description,
				email,
				firstName,
				id,
				lastName,
				role,
				status
			},
			rating {
				rate,
				rating {
					comment,
					createdDate,
					stars,
					user {
						id,
						firstName,
						lastName,
						avatar,
						role
					}
				}
			}
		}
	}
`;

export const GET_USERS_BY_ROLE = gql`
	query UsersByRole($role: RolesInput!) {
		usersByRole(RoleInput: $role) {
			age,
			avatar,
			biography,
			description,
			email,
			firstName,
			id,
			lastName,
			role,
			status,
			state
		}
	}
`;

export const QUERY_USERS_BY_IDS = gql`
	query UsersByIds($ids: UserIdsInput!) {
		usersByIds(UserIdsInput: $ids) {
			id,
			firstName,
			lastName
		}
	}
`;