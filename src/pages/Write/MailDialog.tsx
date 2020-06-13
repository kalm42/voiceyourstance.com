import React, { useEffect, useState, useRef, useCallback } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import styled, { keyframes } from "styled-components"
import CheckoutForm from "./CheckoutForm"
import { EditorState, convertToRaw } from "draft-js"
import { Address } from "../../types"
import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { format } from "date-fns"
import ErrorMessage from "../../common/ErrorMessage"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faVoteYea } from "@fortawesome/free-solid-svg-icons"
import { Input, PrimaryButton } from "../../common/elements"

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
const UPDATE_LETTER = gql`
  mutation UpdateLetter($letterId: String!, $letter: AddressInput!) {
    updateLetter(letterId: $letterId, letter: $letter) {
      id
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
  max-height: 80vh;
  overflow-x: scroll;

  @media (max-width: 600px) {
    left: 1vw;
    top: 5vh;
  }
`
const H1 = styled.h1`
  font-variation-settings: "wght" 600;
  text-align: center;
`
const PaymentWrapper = styled.div`
  padding: 1rem;
`
const StepsList = styled.ul`
  list-style: none;
  padding: 1rem;
`
const Step = styled.li`
  padding: 0.5rem;
`
const StepIcon = styled.span`
  padding: 0.7rem;
`
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const Spinner = styled(FontAwesomeIcon)`
  animation: ${rotate} 750ms linear infinite;
`
const GoldIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
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
interface GraphQLError {
  graphQLErrors: object
  networkError: object
  message: string
  extraInfo: undefined
}
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
  close: () => void
}

const MailDialog = (props: Props) => {
  const [letterId, setLetterId] = useState<null | string>(null)
  const [stripeId, setStripeId] = useState<null | string>(null)
  const [mailId, setMailId] = useState<null | string>(null)
  const [mailDate, setMailDate] = useState<null | string>(null)
  const [error, setError] = useState<undefined | Error>(undefined)
  const [wrongAddress, setWrongAddress] = useState(false)
  const [name, setName] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const [createLetter] = useMutation(CREATE_LETTER)
  const [mailLetter] = useMutation(MAIL_LETTER)
  const [updateLetter] = useMutation(UPDATE_LETTER)

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!ref.current || !event.target) return

      if (ref.current.contains(event.target as Node)) {
        return
      } else {
        props.close()
      }
    },
    [props],
  )

  const tryAgain = () => {
    setWrongAddress(false)
    setError(undefined)
    updateLetter({
      variables: {
        letterId,
        letter: {
          fromName: name,
          fromAddressLine1: line1,
          fromAddressCity: city,
          fromAddressState: state,
          fromAddressZip: zip,
        },
      },
    })
      .then(() => {
        mailTheLetter()
      })
      .catch((error: GraphQLError) => {
        setError(new Error("Failed to mail the letter."))
        if (error.message.includes("from.")) {
          setWrongAddress(true)
        }
      })
  }

  const mailTheLetter = useCallback(() => {
    mailLetter({ variables: { letterId, stripeId } })
      .then((res) => {
        if (res.data.mailLetter.id) {
          setMailId(res.data.mailLetter.id)
          setMailDate(res.data.mailLetter.expectedDeliveryDate)
        } else {
          setError(new Error("failed to mail letter"))
        }
      })
      .catch((error: GraphQLError) => {
        setError(new Error("Failed to mail the letter."))
        if (error.message.includes("from.")) {
          setWrongAddress(true)
        }
      })
  }, [letterId, mailLetter, stripeId])

  const saveTheLetter = useCallback(() => {
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
    createLetter({ variables: { letter } })
      .then((res) => {
        if (res.data?.createLetter?.id) {
          setLetterId(res.data.createLetter.id as string)
        } else {
          setError(new Error("failed to create letter"))
        }
      })
      .catch(() => setError(new Error("Failed to save the letter. Please try again later.")))
  }, [
    createLetter,
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
    if (!letterId) {
      saveTheLetter()
    }
  }, [letterId, saveTheLetter])

  useEffect(() => {
    if (!mailId && stripeId) {
      mailTheLetter()
    }
  }, [mailId, stripeId, mailTheLetter])

  useEffect(() => {
    document.addEventListener("mousedown", handleClick, false)
    return () => {
      document.removeEventListener("mousedown", handleClick, false)
    }
  }, [handleClick])

  return (
    <Wrapper ref={ref}>
      <H1>Mailing your letter</H1>
      <p>Mailing a letter has never been this easy. 3 simple steps.</p>
      <StepsList>
        <Step>
          <StepIcon>{letterId ? <GoldIcon icon={faVoteYea} /> : <Spinner icon={faSpinner} />}</StepIcon>
          <span>Save letter</span>
        </Step>
        <Step>
          <StepIcon>{stripeId ? <GoldIcon icon={faVoteYea} /> : <Spinner icon={faSpinner} />}</StepIcon>
          <span>Pay for mailing</span>
        </Step>
        <Step>
          <StepIcon>{mailId ? <GoldIcon icon={faVoteYea} /> : <Spinner icon={faSpinner} />}</StepIcon>
          <span>Mail letter</span>
        </Step>
      </StepsList>
      <ErrorMessage error={error} />
      {wrongAddress && (
        <div>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="John Doe"
            aria-label="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            // disabled={pay}
          />
          <Input
            type="text"
            name="streetAddress"
            id="street-address"
            placeholder="1600 Pennsylvania Ave"
            aria-label="Street address"
            value={line1}
            onChange={(event) => setLine1(event.target.value)}
            // disabled={pay}
          />
          <Input
            type="text"
            name="city"
            id="city"
            placeholder="Washington"
            aria-label="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            // disabled={pay}
          />
          <Input
            type="text"
            name="state"
            id="state"
            placeholder="DC"
            aria-label="State"
            value={state}
            onChange={(event) => setState(event.target.value)}
            // disabled={pay}
          />
          <Input
            type="text"
            name="zipCode"
            id="zipcode"
            placeholder="20003"
            aria-label="Zip code"
            value={zip}
            onChange={(event) => setZip(event.target.value)}
            // disabled={pay}
          />
          <PrimaryButton onClick={tryAgain}>Try Again</PrimaryButton>
        </div>
      )}
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
