import { gql } from '@apollo/client';

export const QUERY_VENUES = gql`
  query Venues {
    venues {
      id
      name
      thumbnail
      shortDescription
      description
      venueCategory
      venueInfo {
        contactEmail
        contactPhone
        locationLink
        venueLocationName
        venueStreetAddress
        venueWebsite
        hotelRanking
      }
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
      state
      createdBy {
        date
        user {
          id
          firstName
          lastName
        }
      }
      updatedBy {
        date
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const QUERY_VENUE = gql`
  query Venue($id: String!) {
    venue(id: $id) {
      id
      name
      thumbnail
      shortDescription
      description
      venueCategory
      venueInfo {
        contactEmail
        contactPhone
        locationLink
        venueLocationName
        venueStreetAddress
        venueWebsite
        hotelRanking
      }
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

export const QUERY_VENUES_BY_CATEGORY = gql`
  query VenuesByCategory($type: VenueCategoryInput!) {
    venuesByCategoy(VenueCategoryInput: $type) {
      id
      name
      thumbnail
      shortDescription
      description
      venueCategory
      venueInfo {
        contactEmail
        contactPhone
        locationLink
        venueLocationName
        venueStreetAddress
        venueWebsite
        hotelRanking
      }
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

export const QUERY_TAKEN_RANKING = gql`
  query takenRanks($type: VenueCategoryInput!) {
    takenRanks(VenueCategoryInput: $type)
  }
`;
