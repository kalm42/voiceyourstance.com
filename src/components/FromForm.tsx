import React from "react"
import styled from "styled-components"
import { Input } from "./elements"

const From = styled.div`
  display: grid;
  grid-gap: 1rem;
`

interface Props {
  city: string
  line1: string
  name: string
  disabled: boolean
  setCity: (s: string) => void
  setLine1: (s: string) => void
  setName: (s: string) => void
  setState: (s: string) => void
  setZip: (s: string) => void
  state: string
  zip: string
}

const FromForm = (props: Props) => {
  const { city, line1, name, disabled, setCity, setLine1, setName, setState, setZip, state, zip } = props
  return (
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
          onChange={event => setName(event.target.value)}
          disabled={disabled}
        />
        <Input
          type="text"
          name="streetAddress"
          id="street-address"
          placeholder="1600 Pennsylvania Ave"
          aria-label="Street address"
          value={line1}
          onChange={event => setLine1(event.target.value)}
          disabled={disabled}
        />
        <Input
          type="text"
          name="city"
          id="city"
          placeholder="Washington"
          aria-label="City"
          value={city}
          onChange={event => setCity(event.target.value)}
          disabled={disabled}
        />
        <Input
          type="text"
          name="state"
          id="state"
          placeholder="DC"
          aria-label="State"
          value={state}
          onChange={event => setState(event.target.value)}
          disabled={disabled}
        />
        <Input
          type="text"
          name="zipCode"
          id="zipcode"
          placeholder="20003"
          aria-label="Zip code"
          value={zip}
          onChange={event => setZip(event.target.value)}
          disabled={disabled}
        />
      </From>
    </div>
  )
}

export default FromForm
