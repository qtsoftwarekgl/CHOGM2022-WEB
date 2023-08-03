import { gql } from '@apollo/client';

export const GET_CHATS_BY_ID = gql`
  query getChats($id: String!) {
    chats(userId: $id) {
      id
			queryType
      chatType
      messages {
        message
        sender
        createdDate
      }
      users {
        id
        lastName
        firstName
        avatar
      }
    }
  }
`;

export const GET_CHATS_BY_NOC = gql`
  query getChatsByNOC {
    chatsByNOC {
      id
      chatType
			queryType
			createdDate
      messages {
        message
        sender
        createdDate
      }
      users {
        id
        lastName
        firstName
        avatar
      }
    }
  }
`;

export const GET_CATEGORIZED_CHATS = gql`
	query categorizedChats($type: queryTypeInput!) {
		categorizedChats(queryTypeInput: $type) {
			id
      chatType
			queryType
      messages {
        message
        sender
        createdDate
      }
      users {
        id
        lastName
        firstName
        avatar
      }
		}
	}
`;

export const BROADCASTED_MESSAGES = gql`
	query broacastedMessages {
		broadcastedMessages {
			id,
			content,
			payload {
				title
			},
			createdDate
		}
	}
`;