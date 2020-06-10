import React, { useState } from "react"
import { Editor, EditorState } from "draft-js"
import { RouteComponentProps } from "@reach/router"
import styled from "styled-components"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Input, PrimaryInputSubmit } from "../../common/elements"
import { useRepresentatives } from "../../context/Representatives"
import CheckoutForm from "./CheckoutForm"

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
const key = process.env.REACT_APP_STRIPE_KEY
if (!key) {
  throw new Error("No stripe key")
}
const stripePromise = loadStripe(key)

interface Props extends RouteComponentProps {
  repId?: string
  addrId?: string
}

const Write = (props: Props) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const representativeContext = useRepresentatives()

  if (!representativeContext || !props.repId || !props.addrId) return null

  const { civicInfo } = representativeContext
  if (!civicInfo) {
    return null
  }

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

  const handleMail = () => {
    // !Take payment
    // TODO: set backend url via env variables
    const response = fetch("http://localhost:8000/secret")
      .then((response) => response.json())
      .then((data) => {
        const clientSecret = data.client_secret
      })
    // !Save letter to db
    // !When payment completes successfully mail letter
  }

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
      <EditorWrapper>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Start writing your letter on the next line. Don't worry, this text will go away."
        />
      </EditorWrapper>
      <PrimaryInputSubmit value="Mail now $5 USD" type="submit" />
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Wrapper>
  )
}

export default Write
