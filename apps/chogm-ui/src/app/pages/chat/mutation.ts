import { gql } from '@apollo/client';

export const SEND_NEW_CHAT = gql`
	mutation sendNewChat($chat: CreateChatInput!) {
		sendNewChat(createChatInput: $chat) {
			chatType,
			id,
			createdDate
		}
	}
`;

export const REPLY_CHAT = gql`
	mutation replyChat($reply: ReplyChatInput!) {
		replyChat(ReplyChatInput: $reply) {
			createdDate,
			messages {
				createdDate,
				message,
				sender
			}
		}
	}
`;

export const BROADCAST_MESSAGE = gql`
	mutation broadcastMessage($message: String!, $title: String!) {
		BroadcastMessage(message: $message, title: $title)
	}
`;