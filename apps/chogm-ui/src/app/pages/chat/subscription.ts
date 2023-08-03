import { gql } from '@apollo/client';

export const CHAT_EVENT = gql`
	subscription ChatEvent {
		chatEvent {
			id,
			chatType,
			messages {
				message,
				sender,
				createdDate
			},
			users {
				id,
				lastName,
				firstName
			}
		}
	}
`;