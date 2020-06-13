import React from "react"
import styled from "styled-components"
import { StripeError } from "@stripe/stripe-js"

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
  // if (error.networkError?.result?.errors?.length) {
  //   return error.networkError.result.errors.map((error: Error, index) => (
  //     <ErrorBox>
  //       <p>
  //         <em>Shoot!</em> {error.message.replace("GraphQL error: ", "")}
  //       </p>
  //     </ErrorBox>
  //   ))
  // }
  return (
    <ErrorBox>
      <p>
        <em>Shoot! {error.message}</em>
      </p>
    </ErrorBox>
  )
}

export default ErrorMessage
