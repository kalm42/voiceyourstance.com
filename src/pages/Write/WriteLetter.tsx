import React, { useState, useEffect } from "react"
import { Editor, EditorState, convertToRaw } from "draft-js"
import { PrimaryInputSubmit } from "../../common/elements"
import { useRepresentatives } from "../../context/Representatives"
import MailDialog from "./MailDialog"
import { useParams } from "react-router-dom"
import { Wrapper, PageWrapper, AddressDetails, EditorWrapper } from "./WriteStyledComponents"
import FromForm from "./FromForm"
import ErrorReportingBoundry from "../../common/ErrorReportingBoundry"

interface Params {
  repId?: string
  addrId?: string
}

const WriteLetter = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [characterCount, setCharacterCount] = useState(5000)
  const [name, setName] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [pay, setPay] = useState(false)
  const representativeContext = useRepresentatives()
  const { repId, addrId } = useParams<Params>()

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
   * Guard statements
   */
  if (!representativeContext || !repId || !addrId) return null

  const { civicInfo } = representativeContext
  if (!civicInfo) return null

  /**
   * Group representatives by division
   */
  const reps = []
  for (const office of civicInfo.offices) {
    const title = office.name
    for (const index of office.officialIndices) {
      const official = civicInfo.officials[index]
      const { name, party, address, emails } = official
      reps.push({ title, name, party, address, emails })
    }
  }
  const rep = reps[(repId as unknown) as number]
  const address = rep.address[(addrId as unknown) as number]

  const to = {
    name: rep.name,
    title: rep.title,
    ...address,
  }

  return (
    <Wrapper>
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

export default WriteLetter
