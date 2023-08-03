import { gql } from '@apollo/client';

export const QUERY_CMS_STATS = gql`
  query cmsStats {
    cmsStats {
      women {
        registered
        categories {
          name
          count
        }
        gender {
          total
          male
          female
          other
          none
        }
      }
      youth {
        registered
        categories {
          name
          count
        }
        gender {
          total
          male
          female
          other
          none
        }
      }

      business {
        registered
        categories {
          name
          count
        }
        gender {
          total
          male
          female
          other
          none
        }
      }

      chogm {
        registered
        categories {
          name
          count
        }
        gender {
          total
          male
          female
          other
          none
        }
      }

      people {
        registered
        categories {
          name
          count
        }
        gender {
          total
          male
          female
          other
          none
        }
      }
    }
  }
`;
