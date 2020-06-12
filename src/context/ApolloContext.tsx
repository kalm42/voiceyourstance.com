import React, { FunctionComponent } from "react"
import ApolloCient, { gql } from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks"

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
`

const uri = process.env.REACT_APP_BACKEND
const client = new ApolloCient({ uri, typeDefs })

const ApolloContext: FunctionComponent = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloContext
