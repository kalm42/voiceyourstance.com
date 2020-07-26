import { gql } from "apollo-boost"

export const GET_TEMPLATE_BY_ID = gql`
  query GetTemplateById($id: String!) {
    getTemplateById(id: $id) {
      id
      title
      tags
      content
    }
  }
`
