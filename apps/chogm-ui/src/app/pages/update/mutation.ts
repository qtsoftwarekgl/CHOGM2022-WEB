import { gql } from '@apollo/client';

export const UPDATE_CMS = gql`
	mutation updateCMS($content: UpdateCmsInput!) {
		updateCms(UpdateCmsInput: $content){
			id,
			name,
			category,
			description,
			qaType,
			thumbnail,
			createdDate,
			updatedDate
		}
	}
`;