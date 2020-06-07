import React, { useState } from "react"
import { Editor, EditorState } from "draft-js"
import { RouteComponentProps } from "@reach/router"
import styled from "styled-components"
import { Input, PrimaryInputSubmit } from "../../common/elements"

const Wrapper = styled.div`
  padding: 2rem;
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

const Write = (props: RouteComponentProps) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  return (
    <Wrapper>
      <AddressDetails>
        <div>
          <h2>From</h2>
          <From>
            <Input type="text" name="name" id="name" placeholder="John Doe" aria-label="Full name" />
            <Input
              type="text"
              name="streetAddress"
              id="street-address"
              placeholder="1600 Pennsylvania Ave"
              aria-label="Street address"
              // value={streetAddress}
              // onChange={handleChange}
              // disabled={disabled}
            />
            <Input
              type="text"
              name="city"
              id="city"
              placeholder="Washington"
              aria-label="City"
              // value={city}
              // onChange={handleChange}
              // disabled={disabled}
            />
            <Input
              type="text"
              name="state"
              id="state"
              placeholder="DC"
              aria-label="State"
              // value={state}
              // onChange={handleChange}
              // disabled={disabled}
            />
            <Input
              type="text"
              name="zipCode"
              id="zipcode"
              placeholder="20003"
              aria-label="Zip code"
              // value={zipCode}
              // onChange={handleChange}
              // disabled={disabled}
            />
          </From>
        </div>
        <div>
          <h2>To</h2>
          <p>Barack Obama</p>
          <address>
            1600 Pennsylvania Ave <br />
            Washington DC 20003
          </address>
        </div>
      </AddressDetails>
      <EditorWrapper>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Start writing your letter on the next line. Don't worry, this text will go away."
        />
      </EditorWrapper>
      <PrimaryInputSubmit value="Mail now $5 USD" type="submit" />
    </Wrapper>
  )
}

export default Write
