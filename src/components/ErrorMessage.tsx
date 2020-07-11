import React from "react"
import styled from "styled-components"
import { StripeError } from "@stripe/stripe-js"
import reportError from "./reportError"
import { GQL } from "../types"

const ErrorBox = styled.div`
  padding: 2rem;
  background: var(--background);
  border: 1px solid var(--error);
`

interface Props {
  error?: Error | PositionError | StripeError | GQL.GQLError
}

const ErrorMessage = (props: Props) => {
  const { error } = props
  if (!error || !error.message) return null

  reportError(error)

  // Check to see if this is a GQL error
  if (error.graphQLErrors) {
    return (
      <ErrorBox>
        <p>
          <em>Shoot!</em>
        </p>
        <ul>
          {error.graphQLErrors.map((err, index) => (
            <li key={index}>
              <em>{err.message}</em>
            </li>
          ))}
        </ul>
      </ErrorBox>
    )
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
