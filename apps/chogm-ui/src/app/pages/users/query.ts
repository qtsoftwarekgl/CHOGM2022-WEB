import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
  query Users($limit: Float!, $skip: Float!) {
    users(limit: $limit, skip: $skip) {
      age
      biography
      description
      email
      firstName
      id
      lastName
      role
      status
      avatar
      state
      showNoc
      phoneNumber
      rating {
        rate
        rating {
          comment
          createdDate
          stars
          user {
            id
            firstName
            lastName
            avatar
            role
          }
        }
      }
    }
    usersCount
  }
`;

export const QUERY_USER = gql`
  query User($id: String!) {
    user(id: $id) {
      age
      biography
      description
      email
      firstName
      id
      lastName
      role
      status
      avatar
      state
      showNoc
      phoneNumber
      rating {
        rate
        rating {
          comment
          createdDate
          stars
          user {
            id
            firstName
            lastName
            avatar
            role
          }
        }
      }
    }
  }
`;

export const SEARCH_USER = gql`
  query userSearch($query: String!) {
    usersSearch(searchInput: $query) {
      age
      biography
      description
      email
      firstName
      id
      lastName
      role
      status
      avatar
      state
      showNoc
      phoneNumber
      rating {
        rate
        rating {
          comment
          createdDate
          stars
          user {
            id
            firstName
            lastName
            avatar
            role
          }
        }
      }
    }
  }
`;
