import { gql } from '@apollo/client';

export const CREATE_ROOM = gql`
	mutation createRoom($room: CreateRoomInput!) {
		createRoom(createRoomInput: $room) {
			id,
			thumbnail,
			description,
			amenities {
				camera,
				conditioner,
				microphone,
				projector,
				wifi
			}
		}
	}
`;

export const UPDATE_ROOM = gql`
	mutation updateRoom($room: UpdateRoomInput!) {
		updateRoom(UpdateRoomInput: $room) {
			id,
			thumbnail,
			description,
			amenities {
				camera,
				conditioner,
				microphone,
				projector,
				wifi
			}
		}
	}
`;