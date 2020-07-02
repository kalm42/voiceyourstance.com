import React from "react"
import styled from "styled-components"
import { StripeError } from "@stripe/stripe-js"
import reportError from "./reportError"

const ErrorBox = styled.div`
  padding: 2rem;
  background: var(--background);
  border: 1px solid var(--error);
`

interface Props {
  error?: Error | PositionError | StripeError
}

const ErrorMessage = (props: Props) => {
  const { error } = props
  if (!error || !error.message) return null

  reportError(error)

  // Check to see if this is a GQL error
  if (error.graphQLErrors) {
    error.graphQLErrors.forEach(e => console.log("GraphQL Error: ", e))
    console.log("Network Error: ", error.networkError)
    console.log("Extra Info: ", error.extraInfo)
  }

  return (
    <ErrorBox>
      <p>
        <em>Shoot! {error.message}</em>
      </p>
    </ErrorBox>
  )
}

export default ErrorMessage
