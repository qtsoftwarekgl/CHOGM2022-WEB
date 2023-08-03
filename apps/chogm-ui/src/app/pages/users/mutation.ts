import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($user: CreateUserInput!) {
    createUser(createUserInput: $user) {
      age
      avatar
      biography
      description
      email
      firstName
      id
      lastName
      role
      status
      showNoc
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($user: UpdateUserInput!) {
    updateUser(UpdateUserInput: $user) {
      age
      avatar
      biography
      description
      email
      firstName
      id
      lastName
      role
      status
      showNoc
    }
  }
`;
