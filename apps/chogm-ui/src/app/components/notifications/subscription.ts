import { gql } from '@apollo/client';

export const NOTIFICATION_EVENT = gql`
	subscription NotificationEvent {
		notificationEvent {
			content,
			id,
			type,
			userId,
			payload {
				payloadId
			},
			seen,
			createdDate
		}
	}
`;