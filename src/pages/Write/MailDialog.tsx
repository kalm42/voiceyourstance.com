import React, { useEffect, useState, useRef, useCallback } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutForm from "./CheckoutForm"
import { EditorState, convertToRaw } from "draft-js"
import { Address } from "../../types"
import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { format } from "date-fns"
import ErrorMessage from "../../common/ErrorMessage"
import { faSpinner, faVoteYea } from "@fortawesome/free-solid-svg-icons"
import { Input, PrimaryButton, SecondaryButton } from "../../common/elements"
import { useAnalytics } from "../../context/Analytics"
import lzString from "../../common/lzString"
import { useLocation } from "react-router-dom"
import {
  Wrapper,
  H1,
  PaymentWrapper,
  StepsList,
  Step,
  StepIcon,
  Spinner,
  GoldIcon,
  CodeWrapper,
  Code,
} from "./MailDialogStyledComponents"

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
  title?: string
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
  const [shareString, setShareString] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const [createLetter] = useMutation(CREATE_LETTER)
  const [mailLetter] = useMutation(MAIL_LETTER)
  const [updateLetter] = useMutation(UPDATE_LETTER)
  const analytics = useAnalytics()
  const location = useLocation()

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.modalView("mail letter modal")
  }, [analytics])

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
          analytics?.event("MAIL", "Letter mailed", "MAIL_LETTER", true)
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
  }, [analytics, letterId, mailLetter, stripeId])

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
          analytics?.event("MAIL", "Save letter", "SAVE_LETTER", true)
          setLetterId(res.data.createLetter.id as string)
        } else {
          setError(new Error("failed to create letter"))
        }
      })
      .catch(() => setError(new Error("Failed to save the letter. Please try again later.")))
  }, [
    analytics,
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

  /**
   * If the letter id has not been set then the letter has not been saved.
   * So save the letter.
   */
  useEffect(() => {
    if (!letterId) {
      saveTheLetter()
    }
  }, [letterId, saveTheLetter])

  /**
   * When the stripe id has been set the user has paid, then mail the letter
   */
  useEffect(() => {
    if (!mailId && stripeId) {
      mailTheLetter()
    }
  }, [mailId, stripeId, mailTheLetter])

  /**
   * Prepare the share query string
   */
  useEffect(() => {
    const letterState = props.editorState.getCurrentContent()
    const letterJson = convertToRaw(letterState)
    const lz = new lzString()
    const letterTemplate = {
      editorState: letterJson,
      to: props.to,
    }
    const f = lz.compressToEncodedURIComponent(JSON.stringify(letterTemplate))
    setShareString(f)
  }, [props.editorState, props.to])

  /**
   * Handle click outside close
   */
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
          />
          <Input
            type="text"
            name="streetAddress"
            id="street-address"
            placeholder="1600 Pennsylvania Ave"
            aria-label="Street address"
            value={line1}
            onChange={(event) => setLine1(event.target.value)}
          />
          <Input
            type="text"
            name="city"
            id="city"
            placeholder="Washington"
            aria-label="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <Input
            type="text"
            name="state"
            id="state"
            placeholder="DC"
            aria-label="State"
            value={state}
            onChange={(event) => setState(event.target.value)}
          />
          <Input
            type="text"
            name="zipCode"
            id="zipcode"
            placeholder="20003"
            aria-label="Zip code"
            value={zip}
            onChange={(event) => setZip(event.target.value)}
          />
          <PrimaryButton onClick={tryAgain}>Try Again</PrimaryButton>
        </div>
      )}
      {mailDate && (
        <div>
          <h2>Congratulations! Your letter is being printed!</h2>
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
      {shareString.length < 1900 ? (
        <div>
          <h2>Share</h2>
          <p>Share your letter and let other people mail their copy of your letter to {props.to.name} also!</p>
          <p>Copy this url or click the button to copy it. Paste it into the social media of your choice.</p>
          <SecondaryButton>Copy URL</SecondaryButton>
          <CodeWrapper>
            <Code>
              https://voiceyourstance.com{location.pathname}?template={shareString}
            </Code>
          </CodeWrapper>
        </div>
      ) : (
        <div>
          <h2>Share</h2>
          <p>
            I'm sorry your letter too long for us to make it shareable. If you would like to share it you will have to
            remove some and try again.
          </p>
        </div>
      )}
    </Wrapper>
  )
}

export default MailDialog
