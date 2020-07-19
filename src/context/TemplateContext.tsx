import React from "react"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { QueryResult } from "@apollo/react-common"
import { GQL } from "../types"

const GET_USERS_TEMPLATES = gql`
  query GetUsersTemplates {
    getUsersTemplates {
      id
      title
      tags
      content
      updatedAt
    }
  }
`

interface TemplateContextInterface {
  getUsersTemplates: () => QueryResult<GQL.GetUsersTemplatesData, GQL.GetUsersTemplatesVars>
}

interface Props {}

const TemplateContext = React.createContext<TemplateContextInterface | null>(null)

function TemplateProvider(props: Props) {
  const getUsersTemplates = () => {
    return useQuery<GQL.GetUsersTemplatesData, GQL.GetUsersTemplatesVars>(GET_USERS_TEMPLATES)
  }

  return <TemplateContext.Provider value={{ getUsersTemplates }} {...props} />
}

const useTemplate = () => React.useContext(TemplateContext)

export { TemplateProvider, useTemplate }
