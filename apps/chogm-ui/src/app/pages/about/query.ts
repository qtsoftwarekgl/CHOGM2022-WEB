import { gql } from '@apollo/client';

export const GET_CMS = gql`
	query cmsByCategory($category: CmsCategoryInput!) {
		cmsByCategory(CmsCategoryInput: $category){
			id,
			name,
			category,
			description,
			qaType,
    	thumbnail,
			createdDate,
			updatedDate,
			otherInfo {
				contactEmail,
				contactPhone,
				website,
				pdfFile
			},
			state,
			createdBy {
				date,
				user {
					id,
					firstName,
					lastName
				}
			},
			updatedBy {
				date,
				user {
					id,
					firstName,
					lastName
				}
			}
		}
	}
`;

export const GET_CMS_BY_ID = gql`
	query cms($id: String!) {
		cms(id: $id){
			id,
			name,
			category,
			description,
			qaType,
    	thumbnail,
			createdDate,
			updatedDate,
			otherInfo {
				contactEmail,
				contactPhone,
				website,
				pdfFile
			},
			state,
			createdBy {
				date,
				user {
					id,
					firstName,
					lastName
				}
			},
			updatedBy {
				date,
				user {
					id,
					firstName,
					lastName
				}
			}
		}
	}
`;