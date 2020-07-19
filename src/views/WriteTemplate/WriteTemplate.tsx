import React, { useState, useEffect, useRef } from "react"
import { RouteComponentProps, navigate } from "@reach/router"
import styled from "styled-components"
import { Editor, EditorState, convertToRaw, convertFromRaw } from "draft-js"
import FromForm from "../../components/FromForm"
import { PrimaryButton, SecondaryButton } from "../../components/elements"
import RegistryDrawer from "../../components/RegistryDrawer"
import SEO from "../../components/SEO"
import { useUser } from "../../context/UserContext"
import { useLetter } from "../../context/LetterContext"
import MailDialog from "../../components/MailDialog"
import ChooseRepresentative from "../../components/ChooseRepresentative"
import { Address, Representative, GQL } from "../../types"
import ErrorMessage from "../../components/ErrorMessage"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { useMetaData } from "../../context/MetaData"
import { useAnalytics } from "../../context/Analytics"

const GET_TEMPLATE_BY_ID = gql`
  query GetTemplateById($id: String!) {
    getTemplateById(id: $id) {
      content
    }
  }
`

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`
const TitleWrapper = styled.div`
  display: flex;
`
const Title = styled.h2`
  flex: 3;
  margin: 0;
  align-self: flex-end;
`
const MetaWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  align-items: center;
`
interface ToWrapperProps {
  selected: boolean
}
const ToWrapper = styled.div`
  justify-self: center;
  ${(props: ToWrapperProps) => props.selected && "align-self: start;"}
`
interface EditorWrapperProps {
  disabled: boolean
}
const EditorWrapper = styled.div`
  border: 1px solid var(--accent);
  margin: 1rem 0;
  padding: 1rem;
  font-family: var(--formalFont);
  ${(props: EditorWrapperProps) =>
    props.disabled &&
    `
  background: lightgrey;
  color: darkgrey;
  `}
`
const LetterControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0;
`

interface Props extends RouteComponentProps {
  templateId?: string
}

const WriteTemplate = (props: Props) => {
  const { templateId } = props
  const { data, error, loading } = useQuery<GQL.GetTemplateByIdData, GQL.GetTemplateByIdVars>(GET_TEMPLATE_BY_ID, {
    variables: { id: templateId || "" },
  })
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [characterCount, setCharacterCount] = useState(5000)
  const [letterId, setLetterId] = useState("")
  const [mailId, setMailId] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const [sharedId, setSharedId] = useState("")
  const [toAddress, setToAddress] = useState<Address | undefined>(undefined)
  const [toRepresentative, setToRepresentative] = useState<Representative | undefined>(undefined)
  const [isLocked, setIsLocked] = useState(false)
  const [localError, setLocalError] = useState<Error | undefined>(undefined)
  const ref = useRef<Editor | null>(null)
  // Dialogs and modals
  const [registryDrawerIsOpen, setRegistryDrawerIsOpen] = useState(false)
  const [loginDialogIsOpen, setLoginDialogIsOpen] = useState(false)
  const [mailDialogIsOpen, setMailDialogIsOpen] = useState(false)
  const [chooseRepresentativeDialogIsOpen, setChooseRepresentativeDialogIsOpen] = useState(false)
  // Address
  const [name, setName] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  // contexts
  const user = useUser()
  const letterContext = useLetter()
  const MetaData = useMetaData()
  const analytics = useAnalytics()

  const from = { city, line1, name, state, zip }
  const to = {
    name: toRepresentative?.name || "",
    title: toRepresentative?.title || "",
    line1: toAddress?.line1 || "",
    city: toAddress?.city || "",
    state: toAddress?.state || "",
    zip: toAddress?.zip || "",
  }

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
   * Clear error after some time
   */
  useEffect(() => {
    let timeoutId: number
    if (error) {
      timeoutId = setTimeout(() => setLocalError(undefined), 10000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [error])

  /**
   * Load the template into the editor
   */
  useEffect(() => {
    if (data) {
      const newEditorState = EditorState.createWithContent(convertFromRaw(data.getTemplateById.content))
      setEditorState(newEditorState)
    }
  }, [data])

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
   * Handle editor state change
   */
  const handleEditorStateChange = (editorState: EditorState) => {
    if (isLocked) {
      ref.current?.blur()
    }
    setEditorState(editorState)
  }

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
    if (!user) {
      setLoginDialogIsOpen(true)
      return
    }

    // is the from address set?
    if (!isValidAddress()) {
      setLocalError(new Error("You must enter a valid address"))
      return
    }

    if (!letterContext) {
      setLocalError(
        new Error("There has been an internal error. Copy your letter, refresh the page, and paste your letter back."),
      )
      return
    }

    if (!toRepresentative || !toAddress) {
      setLocalError(new Error("You must choose a representative to mail the letter to."))
      return
    }

    const { saveNewLetter } = letterContext
    const contentState = editorState.getCurrentContent()
    const content = convertToRaw(contentState)
    saveNewLetter({ name, line1, city, state, zip }, { name: toRepresentative.name, ...toAddress }, content)
      .then(res => {
        return res.data?.createLetter.id
      })
      .then(id => {
        navigate(`/write/draft/${id}`)
      })
      .catch(err => setLocalError(err))
  }

  /**
   * Validate before mail
   */
  const shouldMailLetter = () => {
    // Is there a proper from?
    if (!name || !line1 || !city || !state || !zip) {
      setLocalError(new Error("You cannot mail a letter without all From fields filled out."))
      return
    }
    // Is there a proper to?
    if (!toRepresentative || !toAddress) {
      setLocalError(new Error("You cannot mail a letter without a recepient. Choose a representative."))
      return
    }
    // Is there content in the letter?
    if (characterCount >= 5000) {
      setLocalError(
        new Error("You cannot mail a blank letter. Please write something or select a letter from the registry."),
      )
      return
    }
    // Lock form from changes
    setIsLocked(true)
    // Open mail dialog
    setMailDialogIsOpen(true)
  }

  return (
    <Wrapper>
      <SEO title="Mail a letter to your representative" description="Write and mail a letter to your representative." />
      <MetaWrapper>
        <FromForm
          city={city}
          line1={line1}
          name={name}
          setCity={setCity}
          setLine1={setLine1}
          setName={setName}
          setState={setState}
          setZip={setZip}
          state={state}
          zip={zip}
          disabled={loading || isLocked}
        />
        <ToWrapper selected={!!toRepresentative}>
          {toAddress ? (
            <div>
              <h2>To</h2>
              <p>
                {toRepresentative?.name} <br /> {toRepresentative?.title}
              </p>
              <address>
                {toAddress.locationName}
                {toAddress.locationName && <br />}
                {toAddress.line1}
                {toAddress.line1 && <br />}
                {toAddress.line2}
                {toAddress.line2 && <br />}
                {toAddress.line3}
                {toAddress.line3 && <br />}
                {toAddress.city}, {toAddress.state} {toAddress.zip}
                <br />
              </address>
            </div>
          ) : (
            <PrimaryButton onClick={() => setChooseRepresentativeDialogIsOpen(true)}>
              choose a representative
            </PrimaryButton>
          )}
        </ToWrapper>
      </MetaWrapper>
      <TitleWrapper>
        <Title>What do you want to say?</Title>
        <SecondaryButton style={{ flex: 1 }} onClick={() => setRegistryDrawerIsOpen(true)}>
          Use a letter from the registry
        </SecondaryButton>
      </TitleWrapper>
      <EditorWrapper disabled={isLocked}>
        <Editor ref={ref} editorState={editorState} onChange={handleEditorStateChange} />
      </EditorWrapper>
      <LetterControls>
        <PrimaryButton onClick={shouldMailLetter} disabled={characterCount >= 5000}>
          mail $5
        </PrimaryButton>
        <SecondaryButton onClick={save}>save</SecondaryButton>
      </LetterControls>
      <ErrorMessage error={error || localError} />
      {isLocked && (
        <p>
          <small>
            If you would like to make a change to your letter click the save button and you will be able to make changes
            again.
          </small>
        </p>
      )}
      {chooseRepresentativeDialogIsOpen && (
        <ChooseRepresentative
          setToAddress={setToAddress}
          setToRepresentative={setToRepresentative}
          close={() => setChooseRepresentativeDialogIsOpen(false)}
        />
      )}
      <RegistryDrawer close={() => setRegistryDrawerIsOpen(false)} isOpen={registryDrawerIsOpen} />
      {mailDialogIsOpen && (
        <MailDialog
          close={() => setMailDialogIsOpen(false)}
          editorState={editorState}
          to={to}
          from={from}
          letterId={letterId}
          mailId={mailId}
          paymentId={paymentId}
          sharedId={sharedId}
          templateId={templateId}
          setLetterId={setLetterId}
          setMailId={setMailId}
          setPaymentId={setPaymentId}
          setSharedId={setSharedId}
        />
      )}
    </Wrapper>
  )
}
interface Props extends RouteComponentProps {
  templateId?: string
}
export default WriteTemplate
