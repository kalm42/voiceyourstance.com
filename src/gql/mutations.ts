import { gql } from "apollo-boost"

export const INCREMENT_TEMPLATE_USE = gql`
  mutation IncrementTemplateUse($id: String!) {
    incrementTemplateUse(id: $id) {
      id
    }
  }
`
