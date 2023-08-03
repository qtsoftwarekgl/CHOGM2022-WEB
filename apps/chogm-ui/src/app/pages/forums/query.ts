import { gql } from '@apollo/client';

export const QUERY_FORUMS = gql`
  query Forums {
    forums {
      id
      name
      description
      status
      startDate
      endDate
      attendees
      thumbnail
      venue {
        id
        name
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

export const QUERY_FORUM = gql`
  query Forum($id: String!) {
    forum(id: $id) {
      id
      name
      description
      status
      startDate
      endDate
      attendees
      thumbnail
      venue {
        id
        name
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
