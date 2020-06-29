import React, { useState, useEffect } from "react"
import { RouteComponentProps } from "@reach/router"
import { useAnalytics } from "../../context/Analytics"
import { useMetaData } from "../../context/MetaData"
import { Editor, EditorState, convertToRaw } from "draft-js"
import styled from "styled-components"
import { PrimaryInputSubmit, SecondaryButton } from "../../components/elements"
import { useRepresentatives } from "../../context/Representatives"
import MailDialog from "./MailDialog"
import { Wrapper, PageWrapper, AddressDetails, EditorWrapper } from "./WriteStyledComponents"
import FromForm from "./FromForm"
import ErrorReportingBoundry from "../../components/ErrorReportingBoundry"
import SEO from "../../components/SEO"
import RegistryDrawer from "./RegistryDrawer"
import AuthenticationDialog from "./AuthenticationDialog"
import { useUser } from "../../context/UserContext"
import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { Address } from "../../types"

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

interface Props extends RouteComponentProps {
  repid?: string
  addressid?: string
}

interface GQL_Letter {
  id: string
  fromAddress: Address
  toAddress: Address
  content: object
  payment?: object
  mail?: object
  user?: object
  createdAt: string
  updatedAt: string
}

interface GQL_LetterData {
  createLetter: GQL_Letter
}

interface GQL_LetterVars {
  letter: {
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
    content: object
  }
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
  const representativeContext = useRepresentatives()
  const analytics = useAnalytics()
  const MetaData = useMetaData()
  const user = useUser()
  const [saveLetter] = useMutation<GQL_LetterData, GQL_LetterVars>(SAVE_LETTER)
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
   * Save the letter
   */
  const save = () => {
    if (user) {
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
            content: content
          }
        }
      })
    } else {
      setShouldDisplayAuthenticationDialog(true)
    }
  }


  /**
   * Group representatives by division
   */
  const rep = representativeContext?.getRepresentativeById((repid as unknown) as number)
  if (!rep) {
    return (<Wrapper><p>No representative was found. Please try again</p></Wrapper>)
  }

  const address = rep.address[(addressid as unknown) as number]
  const to = {
    name: rep.name,
    title: rep.title,
    ...address,
  }

  return (
    <Wrapper>
      <SEO
        title="Mail a letter to your representative | Voice Your Stance"
        description="Write and mail a letter to your representative."
      />
      <RegistryDrawer isOpen={registryIsOpen} close={() => setRegistryIsOpen(false)} />
      <PageWrapper pay={pay || shouldDisplayAuthenticationDialog}>
        <AddressDetails>
          <ErrorReportingBoundry>
            <FromForm
              pay={pay}
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
          <AuthenticationDialog
            isOpen={shouldDisplayAuthenticationDialog}
            close={() => setShouldDisplayAuthenticationDialog(false)}
          />
        </ErrorReportingBoundry>
      )}
      {pay && (
        <ErrorReportingBoundry>
          <MailDialog
            editorState={editorState}
            to={{ ...to }}
            from={{ name, line1, city, state, zip }}
            close={() => setPay(false)}
          />
        </ErrorReportingBoundry>
      )}
    </Wrapper>

}

export default WriteLetter
