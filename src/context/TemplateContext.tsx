import React from "react"
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { QueryResult, ExecutionResult } from "@apollo/react-common"
import { GQL } from "../types"
import { RawDraftContentState } from "draft-js"

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

const GET_TEMPLATE_BY_ID = gql`
  query GetTemplateById($id: String!) {
    getTemplateById(id: $id) {
      id
      title
      tags
      content
      isSearchable
      updatedAt
    }
  }
`

const UPDATE_TEMPLATE = gql`
  mutation UpdateTemplate($id: String!, $template: TemplateInput!) {
    updateTemplate(template: $template, id: $id) {
      id
    }
  }
`

interface TemplateContextInterface {
  getUsersTemplates: () => QueryResult<GQL.GetUsersTemplatesData, GQL.GetUsersTemplatesVars>
  getTemplateById: (id: string) => QueryResult<GQL.GetTemplateByIdData, GQL.GetTemplateByIdVars>
  updateTemplateMutation: (
    id: string,
    content: RawDraftContentState,
    title: string,
    tags: string[],
    isSearchable: boolean,
  ) => Promise<ExecutionResult<GQL.UpdateTemplateData>>
}

interface Props {}

const TemplateContext = React.createContext<TemplateContextInterface | null>(null)

function TemplateProvider(props: Props) {
  const getUsersTemplates = () => {
    return useQuery<GQL.GetUsersTemplatesData, GQL.GetUsersTemplatesVars>(GET_USERS_TEMPLATES)
  }

  const getTemplateById = (id: string) => {
    return useQuery<GQL.GetTemplateByIdData, GQL.GetTemplateByIdVars>(GET_TEMPLATE_BY_ID, { variables: { id } })
  }

  const [updateTemplate] = useMutation<GQL.UpdateTemplateData, GQL.UpdateTemplateVars>(UPDATE_TEMPLATE)
  const updateTemplateMutation = (
    id: string,
    content: RawDraftContentState,
    title: string,
    tags: string[],
    isSearchable: boolean,
  ) => {
    return updateTemplate({ variables: { id, template: { content, isSearchable, tags, title } } })
  }

  return <TemplateContext.Provider value={{ getUsersTemplates, getTemplateById, updateTemplateMutation }} {...props} />
}

const useTemplate = () => React.useContext(TemplateContext)

export { TemplateProvider, useTemplate }
