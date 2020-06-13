import React, { useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import styled from "styled-components"
import CheckoutForm from "./CheckoutForm"
import { EditorState, convertToRaw } from "draft-js"
import { Address } from "../../types"
import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { format } from "date-fns"
import ErrorMessage from "../../common/ErrorMessage"

/**
 * GraphQL
 */
const CREATE_LETTER = gql`
  mutation CreateLetter($letter: LetterInput!) {
    createLetter(letter: $letter) {
      id
    }
  }
`
const MAIL_LETTER = gql`
  mutation MailLetter($letterId: String!, $stripeId: String!) {
    mailLetter(letterId: $letterId, stripeId: $stripeId) {
      id
      expectedDeliveryDate
    }
  }
`

/**
 * Styles
 */
const Wrapper = styled.div`
  position: fixed;
  top: 10vh;
  left: calc(50vw - 250px - 2rem);
  width: 80vw;
  background: white;
  padding: 2rem;
  max-width: 500px;
  border: 1px solid ${(props) => props.theme.accent};
`
const H1 = styled.h1`
  font-variation-settings: "wght" 600;
  text-align: center;
`
const PaymentWrapper = styled.div`
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.accent};
  background: ${(props) => props.theme.main};
`

/**
 * Stripe Setup
 */
const key = process.env.REACT_APP_STRIPE_KEY
if (!key) {
  throw new Error("No stripe key")
}
const stripePromise = loadStripe(key)

/**
 * Types
 */
interface LetterInput {
  toName: string
  toAddressLine1: string
  toAddressLine2: string
  toAddressCity: string
  toAddressState: string
  toAddressZip: string
  fromName: string
  fromAddressLine1: string
  fromAddressLine2: string
  fromAddressCity: string
  fromAddressState: string
  fromAddressZip: string
  content: string
}
interface Person extends Address {
  name: string
}
interface Props {
  editorState: EditorState
  to: Person
  from: Person
}

const MailDialog = (props: Props) => {
  const [letterId, setLetterId] = useState<null | string>(null)
  const [stripeId, setStripeId] = useState<null | string>(null)
  const [mailId, setMailId] = useState<null | string>(null)
  const [mailDate, setMailDate] = useState<null | string>(null)
  const [error, setError] = useState<undefined | Error>(undefined)
  const [createLetter] = useMutation(CREATE_LETTER)
  const [mailLetter] = useMutation(MAIL_LETTER)

  useEffect(() => {
    if (!letterId) {
      const letterState = props.editorState.getCurrentContent()
      const letterJson = convertToRaw(letterState)
      const letter: LetterInput = {
        content: (letterJson as unknown) as string,
        fromAddressCity: props.from.city,
        fromAddressLine1: props.from.line1,
        fromAddressLine2: "",
        fromAddressState: props.from.state,
        fromAddressZip: props.from.zip,
        fromName: props.from.name,
        toAddressCity: props.to.city,
        toAddressLine1: props.to.line1,
        toAddressLine2: props.to.line2 ? props.to.line2 : "",
        toAddressState: props.to.state,
        toAddressZip: props.to.zip,
        toName: props.to.name,
      }
      createLetter({ variables: { letter } }).then((res) => {
        if (res.data?.createLetter?.id) {
          setLetterId(res.data.createLetter.id as string)
        } else {
          setError(new Error("failed to create letter"))
        }
      })
    }
  }, [
    createLetter,
    letterId,
    props.editorState,
    props.from.city,
    props.from.line1,
    props.from.name,
    props.from.state,
    props.from.zip,
    props.to.city,
    props.to.line1,
    props.to.line2,
    props.to.name,
    props.to.state,
    props.to.zip,
  ])

  useEffect(() => {
    if (!mailId && stripeId) {
      mailLetter({ variables: { letterId, stripeId } }).then((res) => {
        if (res.data.mailLetter.id) {
          setMailId(res.data.mailLetter.id)
          setMailDate(res.data.mailLetter.expectedDeliveryDate)
        } else {
          setError(new Error("failed to mail letter"))
        }
      })
    }
  }, [mailId, stripeId])

  // TODO dialog offset < 500px
  return (
    <Wrapper>
      <H1>Mailing your letter</H1>
      <p>Mailing a letter has never been this easy. 3 simple steps.</p>
      <ErrorMessage error={error} />
      <ul>
        <li>
          <span>{letterId ? "yes" : "no"}</span>
          <span>Save letter</span>
        </li>
        <li>
          <span>{stripeId ? "yes" : "no"}</span>
          <span>Pay for mailing</span>
        </li>
        <li>
          <span>{mailId ? "yes" : "no"}</span>
          <span>Mail letter</span>
        </li>
      </ul>
      {mailDate && (
        <div>
          <h3>Congratulations! Your letter is being printed!</h3>
          <p>The expected delivery date for your letter is {format(new Date(mailDate), "MM/dd/yyyy")}</p>
        </div>
      )}
      {!stripeId && (
        <PaymentWrapper>
          <Elements stripe={stripePromise}>
            <CheckoutForm callback={setStripeId} />
          </Elements>
        </PaymentWrapper>
      )}
    </Wrapper>
  )
}

export default MailDialog
