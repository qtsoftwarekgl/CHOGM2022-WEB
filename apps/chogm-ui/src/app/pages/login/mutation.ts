import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($payload: UserLoginInput!) {
    UserLogin(UserLoginInput: $payload) {
      user {
        email
        lastName
        firstName
        role
      }
      token
    }
  }
`;
