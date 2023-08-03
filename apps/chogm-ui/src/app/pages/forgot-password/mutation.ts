import { gql } from '@apollo/client';

export const VERIFY_EMAIL = gql`
	mutation verifyEmail($email: String!) {
		verifyEmail(email: $email)
	}
`;