import React, { useState, useEffect } from "react"
import { Editor, EditorState, convertToRaw, RawDraftContentState, convertFromRaw } from "draft-js"
import { PrimaryInputSubmit } from "../../common/elements"
import MailDialog from "./MailDialog"
import { Wrapper, PageWrapper, AddressDetails, EditorWrapper } from "./WriteStyledComponents"
import FromForm from "./FromForm"
import { Address } from "../../types"
import ErrorReportingBoundry from "../../common/ErrorReportingBoundry"
import Seo from "../../common/Seo"

interface To extends Address {
  name: string
  title: string
}
interface Template {
  editorState: RawDraftContentState
  to: To
}
interface Props {
  template: Template
}

const WriteTemplateLetter = (props: Props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(convertFromRaw(props.template.editorState)),
  )
  const [characterCount, setCharacterCount] = useState(5000)
  const [name, setName] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [pay, setPay] = useState(false)

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
   * On load, set content state
   */

  const to = {
    ...props.template.to,
  }

  return (
    <Wrapper>
      <Seo metaDescription="Write and mail a letter to your representative." title="Write a letter" />
      <PageWrapper pay={pay}>
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
        <h2>Write your letter here</h2>
        <ErrorReportingBoundry>
          <EditorWrapper>
            <Editor editorState={editorState} onChange={setEditorState} />
          </EditorWrapper>
        </ErrorReportingBoundry>
        <PrimaryInputSubmit
          value="Mail now $5 USD"
          type="submit"
          onClick={() => setPay(!pay)}
          disabled={characterCount < 1}
        />
      </PageWrapper>
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
  )
}

export default WriteTemplateLetter
