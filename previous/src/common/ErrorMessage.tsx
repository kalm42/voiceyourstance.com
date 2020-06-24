import React from "react"
import styled from "styled-components"
import { StripeError } from "@stripe/stripe-js"
import reportError from "../common/reportError"

const ErrorBox = styled.div`
  padding: 2rem;
  background: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.error};
`

interface Props {
  error?: Error | PositionError | StripeError
}

const ErrorMessage = (props: Props) => {
  const { error } = props
  if (!error || !error.message) return null

  reportError(error)

  return (
    <ErrorBox>
      <p>
        <em>Shoot! {error.message}</em>
      </p>
    </ErrorBox>
  )
}

export default ErrorMessage
