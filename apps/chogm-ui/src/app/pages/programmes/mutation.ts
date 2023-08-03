import { gql } from '@apollo/client';

export const CREATE_PROGRAMME = gql`
	mutation createProgramme($program: CreateProgrammeInput!) {
		createProgramme(createProgrammeInput: $program) {
			id,
			title,
			startDate,
			endDate,
			broadcastLink,
			description
		}
	}
`;

export const UPDATE_PROGRAMME = gql`
	mutation updateProgramme($program: UpdateProgrammeInput!) {
		updateProgramme(UpdateProgrammeInput: $program) {
			id,
			title,
			startDate,
			endDate,
			broadcastLink,
			description
		}
	}
`;