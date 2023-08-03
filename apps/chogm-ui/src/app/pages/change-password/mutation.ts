import { gql } from '@apollo/client';

export const RESET_PASSWORD = gql`
	mutation resetPassword($newPassword: String!, $verificationCode: Float!) {
		resetPassword(newPassword: $newPassword, verificationCode: $verificationCode)
	}
`;