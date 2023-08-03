import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query Notifications {
    notifications {
      content
      id
      type
      seen
      payload {
        payloadId
        from {
          id
          avatar
          firstName
          lastName
        }
      }
      createdDate
    }
  }
`;
