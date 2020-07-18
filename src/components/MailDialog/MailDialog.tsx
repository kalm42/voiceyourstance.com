import React, { useEffect, useState, useRef, useCallback } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import styled from "styled-components"
import { EditorState, convertToRaw } from "draft-js"
import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { format } from "date-fns"
import { faSpinner, faVoteYea, faHandPointRight, faTimes } from "@fortawesome/free-solid-svg-icons"
import CheckoutForm from "./CheckoutForm"
import ErrorMessage from "../../components/ErrorMessage"
import RegistryForm from "../../components/RegistryForm"
import { Address, GQL } from "../../types"
import { Input, PrimaryButton, SecondaryButton } from "../../components/elements"
import { useAnalytics } from "../../context/Analytics"
import lzString from "../../components/lzString"
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
import reportError from "../../components/reportError"
import { useLocation } from "@reach/router"

interface RegistryDialogProps {
  open: boolean
}
const RegistryDialog = styled.div`
  position: fixed;
  top: 10vh;
  left: ${(props: RegistryDialogProps) => (props.open ? "20vw" : "100vw")};
  background: var(--background);
  border: 1px solid var(--accent);
  padding: 2rem;
  max-width: 60vw;
  max-height: 80vh;
  overflow-x: scroll;
`
const LetterPreview = styled.div`
  font-family: var(--formalFont);
  border: 1px solid var(--accent);
  width: 30vw;
  padding: 2rem;
  margin: 0 auto;
  transform: scale(0.8);
`
const ShareWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0;
`
const WrongAddressWrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  padding: 1rem 0;
`
const RegistryDialogTitle = styled.div`
  display: flex;

  & h2 {
    flex: 1;
  }
`
const IconButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  & svg {
    height: 1rem !important;
    width: 1rem !important;
  }
`

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
  mutation UpdateLetter($letterId: String!, $from: AddressInput!) {
    updateLetter(letterId: $letterId, from: $from) {
      id
    }
  }
`
/**
 * Stripe Setup
 */
const key = process.env.GATSBY_STRIPE_KEY
if (!key) {
  throw new Error("No stripe key")
}
const stripePromise = loadStripe(key)

/**
 * Types
 */
interface Person extends Address {
  name: string
  title?: string
}
interface Props {
  editorState: EditorState
  to: Person
  from: Person
  close: () => void
  letterId: string | undefined
  setLetterId: (id: string) => void
  mailId: string | undefined
  setMailId: (id: string) => void
  paymentId: string | undefined
  setPaymentId: (id: string) => void
  sharedId: string | undefined
  setSharedId: (id: string) => void
  templateId: string | undefined
  setTemplateId: (id: string) => void
}

const MailDialog = (props: Props) => {
  const [mailDate, setMailDate] = useState<null | string>(null)
  const [error, setError] = useState<undefined | Error>(undefined)
  const [wrongAddress, setWrongAddress] = useState(false)
  const [name, setName] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [shareString, setShareString] = useState("")
  const [cpyMsg, setCpyMsg] = useState("")
  const [registryDialogIsOpen, setRegistryDialogIsOpen] = useState(false)
  const [loadingSaveLetter, setLoadingSaveLetter] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [loadingMail, setLoadingMail] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const shareUrlRef = useRef<HTMLDivElement>(null)
  const [createLetter] = useMutation<GQL.CreateLetterData, GQL.CreateLetterVars>(CREATE_LETTER)
  const [mailLetter] = useMutation<GQL.MailLetterData, GQL.MailLetterVars>(MAIL_LETTER)
  const [updateLetter] = useMutation<GQL.UpdateLetterData, GQL.UpdateLetterVars>(UPDATE_LETTER)
  const analytics = useAnalytics()
  const location = useLocation()
  const {
    editorState,
    to,
    from,
    close,
    letterId,
    setLetterId,
    mailId,
    setMailId,
    paymentId,
    setPaymentId,
    sharedId,
    setSharedId,
    templateId,
    setTemplateId,
  } = props

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.modalView("mail letter modal")
  }, [analytics])

  /**
   * Close on outside click
   */
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

  /**
   * Handle click outside close
   */
  useEffect(() => {
    document.addEventListener("mousedown", handleClick, false)
    return () => {
      document.removeEventListener("mousedown", handleClick, false)
    }
  }, [handleClick])

  /**
   * Attempt to mail the letter again, this time with a corrected address.
   */
  const tryAgain = () => {
    setWrongAddress(false)
    setError(undefined)
    if (letterId) {
      setLoadingSaveLetter(true)
      updateLetter({
        variables: {
          letterId,
          from: {
            fromName: name,
            fromAddressLine1: line1,
            fromAddressCity: city,
            fromAddressState: state,
            fromAddressZip: zip,
          },
        },
      })
        .then(() => {
          setLoadingSaveLetter(false)
          mailTheLetter()
        })
        .catch((error: GQL.GQLError) => {
          setLoadingSaveLetter(false)
          setError(new Error("Failed to mail the letter."))
          if (error.message.includes("from.")) {
            setWrongAddress(true)
          }
        })
    }
  }

  /**
   * Mail the letter
   */
  const mailTheLetter = useCallback(() => {
    if (letterId && paymentId) {
      setLoadingMail(true)
      mailLetter({ variables: { letterId, stripeId: paymentId } })
        .then(res => {
          setLoadingMail(false)
          if (res?.data?.mailLetter?.id) {
            analytics?.event("MAIL", "Letter mailed", "MAIL_LETTER", true)
            setMailId(res.data.mailLetter.id)
            setMailDate(res.data.mailLetter.expectedDeliveryDate)
          } else {
            setError(new Error("failed to mail letter"))
          }
        })
        .catch((err: GQL.GQLError) => {
          setLoadingMail(false)
          setError(err)
          if (err.message.includes("from.")) {
            setWrongAddress(true)
          }
        })
    }
  }, [analytics, letterId, mailLetter, paymentId])

  /**
   * Save the letter
   */
  const saveTheLetter = useCallback(() => {
    const letterState = editorState.getCurrentContent()
    const letterJson = convertToRaw(letterState)

    const letter: GQL.LetterInput = {
      content: letterJson,
      fromAddressCity: from.city,
      fromAddressLine1: from.line1,
      fromAddressLine2: "",
      fromAddressState: from.state,
      fromAddressZip: from.zip,
      fromName: from.name,
      toAddressCity: to.city,
      toAddressLine1: to.line1,
      toAddressLine2: to.line2 ? to.line2 : "",
      toAddressState: to.state,
      toAddressZip: to.zip,
      toName: to.name,
    }
    setLoadingSaveLetter(true)
    createLetter({ variables: { letter } })
      .then(res => {
        setLoadingSaveLetter(false)
        if (res.data?.createLetter?.id) {
          analytics?.event("MAIL", "Save letter", "SAVE_LETTER", true)
          setLetterId(res.data.createLetter.id)
        } else {
          setError(new Error("failed to create letter"))
        }
      })
      .catch(err => {
        setLoadingSaveLetter(false)
        setError(err)
      })
  }, [
    analytics,
    createLetter,
    editorState,
    from.city,
    from.line1,
    from.name,
    from.state,
    from.zip,
    to.city,
    to.line1,
    to.line2,
    to.name,
    to.state,
    to.zip,
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
    if (!mailId && paymentId) {
      mailTheLetter()
    }
  }, [mailId, paymentId, mailTheLetter])

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

  const copyToClipboard = () => {
    // select the text
    const range = document.createRange()
    if (shareUrlRef.current) {
      range.selectNode(shareUrlRef.current)
      const selection = window.getSelection()
      if (selection) {
        selection.addRange(range)
        try {
          // Now that we've selected the anchor text, execute the copy command
          var successful = document.execCommand("copy")
          var msg = successful ? "successful" : "unsuccessful"
          setCpyMsg("Copy email command was " + msg)
        } catch (error) {
          setCpyMsg("Oops, unable to copy")
        }
        selection.removeAllRanges()
      }
    }
  }

  return (
    <Wrapper ref={ref}>
      <H1>Mailing your letter</H1>
      <p>Mailing a letter has never been this easy. 3 simple steps.</p>
      <StepsList>
        <Step>
          <StepIcon>
            {letterId ? (
              <GoldIcon icon={faVoteYea} />
            ) : loadingSaveLetter ? (
              <Spinner icon={faSpinner} />
            ) : (
              <GoldIcon icon={faHandPointRight} />
            )}
          </StepIcon>
          <span>Save letter</span>
        </Step>
        <Step>
          <StepIcon>
            {paymentId ? (
              <GoldIcon icon={faVoteYea} />
            ) : loadingPayment ? (
              <Spinner icon={faSpinner} />
            ) : (
              <GoldIcon icon={faHandPointRight} />
            )}
          </StepIcon>
          <span>Pay for mailing</span>
        </Step>
        <Step>
          <StepIcon>
            {mailId ? (
              <GoldIcon icon={faVoteYea} />
            ) : loadingMail ? (
              <Spinner icon={faSpinner} />
            ) : (
              <GoldIcon icon={faHandPointRight} />
            )}
          </StepIcon>
          <span>Mail letter</span>
        </Step>
      </StepsList>
      <ErrorMessage error={error} />
      {wrongAddress && (
        <WrongAddressWrapper>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="John Doe"
            aria-label="Full name"
            value={name}
            onChange={event => setName(event.target.value)}
          />
          <Input
            type="text"
            name="streetAddress"
            id="street-address"
            placeholder="1600 Pennsylvania Ave"
            aria-label="Street address"
            value={line1}
            onChange={event => setLine1(event.target.value)}
          />
          <Input
            type="text"
            name="city"
            id="city"
            placeholder="Washington"
            aria-label="City"
            value={city}
            onChange={event => setCity(event.target.value)}
          />
          <Input
            type="text"
            name="state"
            id="state"
            placeholder="DC"
            aria-label="State"
            value={state}
            onChange={event => setState(event.target.value)}
          />
          <Input
            type="text"
            name="zipCode"
            id="zipcode"
            placeholder="20003"
            aria-label="Zip code"
            value={zip}
            onChange={event => setZip(event.target.value)}
          />
          <PrimaryButton onClick={tryAgain}>Try Again</PrimaryButton>
        </WrongAddressWrapper>
      )}
      {mailDate && (
        <div>
          <h2>Congratulations! Your letter is being printed!</h2>
          <p>The expected delivery date for your letter is {format(new Date(mailDate), "MM/dd/yyyy")}</p>
        </div>
      )}
      {!paymentId && (
        <PaymentWrapper>
          <Elements stripe={stripePromise}>
            <CheckoutForm callback={setPaymentId} loading={loadingPayment} setLoading={setLoadingPayment} />
          </Elements>
        </PaymentWrapper>
      )}
      {paymentId && mailId && letterId && (
        <ShareWrapper>
          <SecondaryButton>Share</SecondaryButton>
          <PrimaryButton onClick={() => setRegistryDialogIsOpen(true)}>add to the registry</PrimaryButton>
        </ShareWrapper>
      )}
      <RegistryDialog open={registryDialogIsOpen}>
        <RegistryDialogTitle>
          <h2>Save your letter in our letter registry</h2>
          <IconButton onClick={() => setRegistryDialogIsOpen(false)}>
            <GoldIcon icon={faTimes} />
          </IconButton>
        </RegistryDialogTitle>
        <p>
          Since you're adding your letter to the registry after mailing it we assume there is some of your personal
          information in the letter. For that reason your letter will not be made public by default. You will need to
          update your letter once it is saved. That way you have a chance to remove any personal details you would like
          to remove.
        </p>
        <RegistryForm
          letterContent={convertToRaw(props.editorState.getCurrentContent())}
          close={() => setRegistryDialogIsOpen(false)}
          templateId={templateId}
          setTemplateId={setTemplateId}
        />
        <div>
          <h3>Your letter</h3>
          <p>It's here just in case you wanted to be able to double check things.</p>
          <LetterPreview>
            {convertToRaw(props.editorState.getCurrentContent()).blocks.map(block => (
              <p key={block.key}>{block.text}</p>
            ))}
          </LetterPreview>
        </div>
      </RegistryDialog>
    </Wrapper>
  )
}

export default MailDialog
