import { gql } from '@apollo/client';

export const UPDATE_NOTIFICATION = gql`
	mutation updateNotification($ids: UpdateSeenNotificationInput!) {
		updateNotification(UpdateSeenNotificationInput: $ids)
	}
`;