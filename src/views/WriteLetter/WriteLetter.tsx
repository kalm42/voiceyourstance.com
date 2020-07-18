import React, { useState, useEffect } from "react"
import { RouteComponentProps } from "@reach/router"
import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { Editor, EditorState, convertToRaw } from "draft-js"
import styled from "styled-components"
import { useAnalytics } from "../../context/Analytics"
import { useMetaData } from "../../context/MetaData"
import { useRepresentatives } from "../../context/Representatives"
import { useUser } from "../../context/UserContext"
import ErrorReportingBoundry from "../../components/ErrorReportingBoundry"
import SEO from "../../components/SEO"
import { PrimaryInputSubmit, SecondaryButton } from "../../components/elements"
import { Wrapper, PageWrapper, AddressDetails, EditorWrapper } from "./WriteStyledComponents"
import MailDialog from "../../components/MailDialog"
import { GQL } from "../../types"
import { navigate } from "gatsby"
import AuthenticationForms from "../../components/AuthenticationForms"
import ErrorMessage from "../../components/ErrorMessage"
import FromForm from "../../components/FromForm"
import RegistryDrawer from "./RegistryDrawer"

const SAVE_LETTER = gql`
  mutation SaveLetter($letter: LetterInput!) {
    createLetter(letter: $letter) {
      id
    }
  }
`

const TitleWrapper = styled.div`
  display: flex;
`
const Title = styled.h2`
  flex: 3;
  margin: 0;
  align-self: flex-end;
`
const LetterControls = styled.div`
  display: flex;
  justify-content: space-between;
`
const AuthenticationDialog = styled.div`
  position: fixed;
  top: calc(100vh / 3 / 2);
  left: 0;
  right: 0;
  margin: auto;
  background: var(--background);
  border: 1px solid var(--accent);
  padding: 2rem;
  max-height: 67vh;
  width: calc((100vw / 3 / 2) * 4);
  transition: all 200ms ease-in;
`

interface Props extends RouteComponentProps {
  repid?: string
  addressid?: string
}

const WriteLetter = (props: Props) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [registryIsOpen, setRegistryIsOpen] = useState(false)
  const [characterCount, setCharacterCount] = useState(5000)
  const [name, setName] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [pay, setPay] = useState(false)
  const [shouldDisplayAuthenticationDialog, setShouldDisplayAuthenticationDialog] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [letterId, setLetterId] = useState<string | undefined>(undefined)
  const [mailId, setMailId] = useState<string | undefined>(undefined)
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined)
  const [sharedId, setSharedId] = useState<string | undefined>(undefined)
  const [templateId, setTemplateId] = useState<string | undefined>(undefined)
  const representativeContext = useRepresentatives()
  const analytics = useAnalytics()
  const MetaData = useMetaData()
  const user = useUser()
  const [saveLetter] = useMutation<GQL.CreateLetterData, GQL.CreateLetterVars>(SAVE_LETTER)
  const { repid, addressid } = props

  /**
   * set the title
   */
  useEffect(() => {
    MetaData?.safeSetTitle("Write a letter")
  }, [MetaData])

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  /**
   * On state change calcuate the number of characters remaining.
   */
  useEffect(() => {
    const contentState = editorState.getCurrentContent()
    const content = convertToRaw(contentState)
    const charCount = content.blocks.reduce((acc, val) => acc + val.text.length, 0)
    setCharacterCount(5000 - charCount)
  }, [editorState])

  /**
   * Clear error after some time
   */
  useEffect(() => {
    let timeoutId: number
    if (error) {
      timeoutId = setTimeout(() => setError(undefined), 10000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [error])

  /**
   * Validate from
   */
  const isValidAddress = () => {
    return !name.length || !line1.length || !city.length || state.length !== 2 || zip.length !== 5 ? false : true
  }

  /**
   * Save the letter
   */
  const save = () => {
    if (user) {
      // is the from address set?
      if (!isValidAddress()) {
        setError(new Error("You must enter a valid address"))
        return
      }

      // save the letter
      const contentState = editorState.getCurrentContent()
      const content = convertToRaw(contentState)
      saveLetter({
        variables: {
          letter: {
            fromName: name,
            fromAddressLine1: line1,
            fromAddressLine2: "",
            fromAddressCity: city,
            fromAddressState: state,
            fromAddressZip: zip,
            toName: to.name,
            toAddressLine1: to.line1,
            toAddressLine2: to.line2 || "",
            toAddressCity: to.city,
            toAddressState: to.state,
            toAddressZip: to.zip,
            content: content,
          },
        },
      })
        .then(res => {
          return res.data?.createLetter.id
        })
        .then(id => {
          navigate(`/write/draft/${id}`)
        })
        .catch(err => setError(err))
    } else {
      setShouldDisplayAuthenticationDialog(true)
    }
  }

  /**
   * Handled auth
   */
  const handledAuthNowSave = () => save()

  /**
   * Group representatives by division
   */
  const rep = representativeContext?.getRepresentativeById((repid as unknown) as number)
  if (!rep) {
    return (
      <Wrapper>
        <p>No representative was found. Please try again</p>
      </Wrapper>
    )
  }

  const address = rep.address[(addressid as unknown) as number]
  const to = {
    name: rep.name,
    title: rep.title,
    ...address,
  }

  return (
    <Wrapper>
      <SEO title="Mail a letter to your representative" description="Write and mail a letter to your representative." />
      <RegistryDrawer isOpen={registryIsOpen} close={() => setRegistryIsOpen(false)} />
      <PageWrapper pay={pay || shouldDisplayAuthenticationDialog}>
        <AddressDetails>
          <ErrorReportingBoundry>
            <FromForm
              line1={line1}
              setLine1={setLine1}
              name={name}
              setName={setName}
              city={city}
              setCity={setCity}
              setState={setState}
              setZip={setZip}
              state={state}
              zip={zip}
              disabled={pay}
            />
          </ErrorReportingBoundry>
          <div>
            <h2>To</h2>
            <p>
              {to.name} <br /> {to.title}
            </p>
            <address>
              {to.locationName} {to.locationName && <br />}
              {to.line1} {to.line1 && <br />}
              {to.line2} {to.line2 && <br />}
              {to.line3} {to.line3 && <br />}
              {to.city}, {to.state}, {to.zip}
            </address>
          </div>
        </AddressDetails>
        {characterCount < 100 && (
          <div>
            <p>You have {characterCount} characters left. There is a 5,000 character limit.</p>
          </div>
        )}
        <ErrorMessage error={error} />
        <TitleWrapper>
          <Title>Write your letter here</Title>
          <SecondaryButton style={{ flex: 1 }} onClick={() => setRegistryIsOpen(true)}>
            Use a letter from the registry
          </SecondaryButton>
        </TitleWrapper>
        <ErrorReportingBoundry>
          <EditorWrapper>
            <Editor editorState={editorState} onChange={setEditorState} />
          </EditorWrapper>
        </ErrorReportingBoundry>
        <LetterControls>
          <PrimaryInputSubmit
            value="Mail now $5 USD"
            type="submit"
            onClick={() => setPay(!pay)}
            disabled={characterCount < 1}
          />
          <SecondaryButton onClick={save}>Save</SecondaryButton>
        </LetterControls>
      </PageWrapper>
      {shouldDisplayAuthenticationDialog && (
        <ErrorReportingBoundry>
          <AuthenticationDialog>
            <AuthenticationForms
              isOpen={shouldDisplayAuthenticationDialog}
              close={() => setShouldDisplayAuthenticationDialog(false)}
              callback={handledAuthNowSave}
            />
          </AuthenticationDialog>
        </ErrorReportingBoundry>
      )}
      {pay && (
        <ErrorReportingBoundry>
          <MailDialog
            editorState={editorState}
            to={{ ...to }}
            from={{ name, line1, city, state, zip }}
            close={() => setPay(false)}
            letterId={letterId}
            setLetterId={setLetterId}
            mailId={mailId}
            setMailId={setMailId}
            paymentId={paymentId}
            setPaymentId={setPaymentId}
            sharedId={sharedId}
            setSharedId={setSharedId}
            templateId={templateId}
            setTemplateId={setTemplateId}
          />
        </ErrorReportingBoundry>
      )}
    </Wrapper>
  )
}

export default WriteLetter
