import React, { FunctionComponent } from "react"
import ApolloCient, { gql, InMemoryCache } from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks"

// GraphQL Type deffinitions
const typeDefs = gql`
  type LetterInput {
    toName: String!
    toAddressLine1: String!
    toAddressLine2: String!
    toAddressCity: String!
    toAddressState: String!
    toAddressZip: String!
    fromName: String!
    fromAddressLine1: String!
    fromAddressLine2: String!
    fromAddressCity: String!
    fromAddressState: String!
    fromAddressZip: String!
    content: Json!
  }
  input AddressInput {
    fromName: String!
    fromAddressLine1: String!
    fromAddressCity: String!
    fromAddressState: String!
    fromAddressZip: String!
  }
  input TemplateInput {
    title: String!
    tags: [String!]!
    content: Json!
  }
`

const uri = process.env.GATSBY_BACKEND
const client = new ApolloCient({ uri: `${uri}/graphql`, typeDefs, credentials: "include", cache: new InMemoryCache() })

const ApolloContext: FunctionComponent = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloContext
