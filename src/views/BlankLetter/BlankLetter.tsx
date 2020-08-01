import React, { useState, useEffect, useRef, useCallback } from "react"
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
import { useMetaData } from "../../context/MetaData"
import { useLazyQuery } from "@apollo/react-hooks"
import { GET_TEMPLATE_BY_ID } from "../../gql/queries"
import AddressSelection from "./AddressSelection"

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

const BlankLetter = (props: RouteComponentProps) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [loading, setLoading] = useState(false)
  const [characterCount, setCharacterCount] = useState(5000)
  const [letterId, setLetterId] = useState("")
  const [mailId, setMailId] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const [sharedId, setSharedId] = useState("")
  const [templateId, setTemplateId] = useState("")
  const [toAddress, setToAddress] = useState<Address | undefined>(undefined)
  const [toRepresentative, setToRepresentative] = useState<Representative | undefined>(undefined)
  const [isLocked, setIsLocked] = useState(false)
  const ref = useRef<Editor | null>(null)
  const [getTemplateById, tem] = useLazyQuery<GQL.GetTemplateByIdData, GQL.GetTemplateByIdVars>(GET_TEMPLATE_BY_ID)
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
  // error
  const [error, setError] = useState<Error | undefined>(undefined)
  // contexts
  const user = useUser()
  const letterContext = useLetter()
  const MetaData = useMetaData()
  const [hasReps, setHasReps] = useState(false)

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
   * Set template
   */
  useEffect(() => {
    if (templateId) {
      getTemplateById({ variables: { id: templateId } })
    }
  }, [templateId])
  useEffect(() => {
    const template = tem.data?.getTemplateById
    if (template) {
      const newState = convertFromRaw(template.content)
      setEditorState(EditorState.createWithContent(newState))
    }
  }, [tem])

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
   * Check that user has located reps
   */
  useEffect(() => {
    const repCheck = localStorage.getItem("vys-representatives")
    if (!repCheck) {
      navigate(
        `/?error=${encodeURIComponent("You must find your representatives before you can write a letter to them.")}`,
      )
    } else {
      setHasReps(true)
    }
  }, [])
  if (!hasReps) {
    return null
  }

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
      setError(new Error("You must enter a valid address"))
      return
    }

    if (!letterContext) {
      setError(
        new Error("There has been an internal error. Copy your letter, refresh the page, and paste your letter back."),
      )
      return
    }

    if (!toRepresentative || !toAddress) {
      setError(new Error("You must choose a representative to mail the letter to."))
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
      .catch(err => setError(err))
  }

  /**
   * Validate before mail
   */
  const shouldMailLetter = () => {
    // Is there a proper from?
    if (!name || !line1 || !city || !state || !zip) {
      setError(new Error("You cannot mail a letter without all From fields filled out."))
      return
    }
    // Is there a proper to?
    if (!toRepresentative || !toAddress) {
      setError(new Error("You cannot mail a letter without a recepient. Choose a representative."))
      return
    }
    // Is there content in the letter?
    if (characterCount >= 5000) {
      setError(
        new Error("You cannot mail a blank letter. Please write something or select a letter from the registry."),
      )
      return
    }
    // Lock form from changes
    setIsLocked(true)
    // Open mail dialog
    setMailDialogIsOpen(true)
  }

  /**
   * safe open dialog
   */
  const openRepresentativeDialog = useCallback(() => {
    setChooseRepresentativeDialogIsOpen(true)
  }, [])

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
        <AddressSelection address={toAddress} representative={toRepresentative} openDialog={openRepresentativeDialog} />
      </MetaWrapper>
      <TitleWrapper>
        <Title>What do you want to say?</Title>
        <SecondaryButton style={{ flex: 1 }} onClick={() => setRegistryDrawerIsOpen(true)} id="open-registry-button">
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
      <ErrorMessage error={error} />
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
      <RegistryDrawer
        close={() => setRegistryDrawerIsOpen(false)}
        isOpen={registryDrawerIsOpen}
        callback={setTemplateId}
      />
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
          setTemplateId={setTemplateId}
        />
      )}
    </Wrapper>
  )
}

export default BlankLetter
