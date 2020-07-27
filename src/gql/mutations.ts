import { gql } from "apollo-boost"

export const INCREMENT_TEMPLATE_USE = gql`
  mutation IncrementTemplateUse($id: String!) {
    IncrementTemplateUse(id: $id) {
      id
    }
  }
`
