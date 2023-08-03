import { gql } from '@apollo/client';

export const CREATE_FORUM = gql`
	mutation createForum($forum: CreateForumInput!) {
		createForum(createForumInput: $forum) {
			id,
			name,
			description,
			status,
			startDate,
			endDate,
			attendees,
			thumbnail
		}
	}
`;

export const UPDATE_FORUM = gql`
	mutation updateForum($forum: UpdateForumInput!) {
		updateForum(createForumInput: $forum) {
			id,
			name,
			description,
			status,
			startDate,
			endDate,
			attendees,
			thumbnail
		}
	}
`;