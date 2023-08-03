import { gql } from '@apollo/client';

export const CREATE_CMS = gql`
	mutation createCMS($content: CreateCmsInput!) {
		createCms(CreateCmsInput: $content){
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

export const UPLOAD_PDF_FILE = gql`
	mutation uploadPDFFile($file: Upload!) {
		uploadPDFFile(file: $file)
	}
`;