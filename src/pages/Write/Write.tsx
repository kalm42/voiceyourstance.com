import React, { useState, useEffect } from "react"
import { Editor, EditorState, convertToRaw } from "draft-js"
import { RouteComponentProps } from "@reach/router"
import styled from "styled-components"
import { Input, PrimaryInputSubmit } from "../../common/elements"
import { useRepresentatives } from "../../context/Representatives"
import MailDialog from "./MailDialog"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`
const AddressDetails = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 1rem;
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`
const From = styled.div`
  display: grid;
  grid-gap: 1rem;
`
const EditorWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.accent};
  margin: 2rem 0;
  padding: 1rem;
  font-family: ${(props) => props.theme.formalFont};
`
interface PageWrapperProps {
  pay: boolean
}
const PageWrapper = styled.div`
  transition: all 200ms ease;
  ${(props: PageWrapperProps) => {
    if (props.pay) {
      return `
        filter: blur(5px) grayscale(50%);
        transform: scale(0.9);
      `
    }
  }}
`

interface Props extends RouteComponentProps {
  repId?: string
  addrId?: string
}

const Write = (props: Props) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [characterCount, setCharacterCount] = useState(5000)
  const [name, setName] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [pay, setPay] = useState(false)
  const representativeContext = useRepresentatives()

  useEffect(() => {
    const contentState = editorState.getCurrentContent()
    const content = convertToRaw(contentState)
    const charCount = content.blocks.reduce((acc, val) => acc + val.text.length, 0)
    setCharacterCount(5000 - charCount)
  }, [editorState])

  if (!representativeContext || !props.repId || !props.addrId) return null

  const { civicInfo } = representativeContext
  if (!civicInfo) return null

  const reps = []

  for (const office of civicInfo.offices) {
    const title = office.name

    for (const index of office.officialIndices) {
      const official = civicInfo.officials[index]
      const { name, party, address, emails } = official
      reps.push({ title, name, party, address, emails })
    }
  }

  const rep = reps[(props.repId as unknown) as number]
  const address = rep.address[(props.addrId as unknown) as number]

  return (
    <Wrapper>
      <PageWrapper pay={pay}>
        <AddressDetails>
          <div>
            <h2>From</h2>
            <From>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                aria-label="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={pay}
              />
              <Input
                type="text"
                name="streetAddress"
                id="street-address"
                placeholder="1600 Pennsylvania Ave"
                aria-label="Street address"
                value={line1}
                onChange={(event) => setLine1(event.target.value)}
                disabled={pay}
              />
              <Input
                type="text"
                name="city"
                id="city"
                placeholder="Washington"
                aria-label="City"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                disabled={pay}
              />
              <Input
                type="text"
                name="state"
                id="state"
                placeholder="DC"
                aria-label="State"
                value={state}
                onChange={(event) => setState(event.target.value)}
                disabled={pay}
              />
              <Input
                type="text"
                name="zipCode"
                id="zipcode"
                placeholder="20003"
                aria-label="Zip code"
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                disabled={pay}
              />
            </From>
          </div>
          <div>
            <h2>To</h2>
            <p>
              {rep.name} <br /> {rep.title}
            </p>
            <address>
              {address.locationName} {address.locationName && <br />}
              {address.line1} {address.line1 && <br />}
              {address.line2} {address.line2 && <br />}
              {address.line3} {address.line3 && <br />}
              {address.city}, {address.state}, {address.zip}
            </address>
          </div>
        </AddressDetails>
        {characterCount < 100 && (
          <div>
            <p>You have {characterCount} characters left. There is a 5,000 character limit.</p>
          </div>
        )}
        <EditorWrapper>
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            placeholder="Start writing your letter on the next line. Don't worry, this text will go away."
          />
        </EditorWrapper>
        <PrimaryInputSubmit
          value="Mail now $5 USD"
          type="submit"
          onClick={() => setPay(!pay)}
          disabled={characterCount < 1}
        />
      </PageWrapper>
      {pay && (
        <MailDialog
          editorState={editorState}
          to={{ ...address, name: rep.name }}
          from={{ name, line1, city, state, zip }}
        />
      )}
    </Wrapper>
  )
}

export default Write
