import React from "react"
import styled from "styled-components"
import { Form, Input, PrimaryInputSubmit, SecondaryButton } from "../../common/elements"

const PageContent = styled.div`
  max-width: 800px;
  width: 67vw;
  margin: 0 auto;
`
interface Props {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  disabled: boolean
  getGeoLocation: () => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const LocationDisplay = (props: Props) => {
  const { streetAddress, city, state, zipCode, getGeoLocation, handleChange, handleSubmit, disabled } = props
  return (
    <PageContent>
      <p>What is your voter registration address?</p>
      <SecondaryButton onClick={getGeoLocation}>Use my current location</SecondaryButton>
      <Form method="post" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="streetAddress"
          id="street-address"
          placeholder="1600 Pennsylvania Ave"
          aria-label="Street address"
          value={streetAddress}
          onChange={handleChange}
          disabled={disabled}
        />
        <Input
          type="text"
          name="city"
          id="city"
          placeholder="Washington"
          aria-label="City"
          value={city}
          onChange={handleChange}
          disabled={disabled}
        />
        <Input
          type="text"
          name="state"
          id="state"
          placeholder="DC"
          aria-label="State"
          value={state}
          onChange={handleChange}
          disabled={disabled}
        />
        <Input
          type="text"
          name="zipCode"
          id="zipcode"
          placeholder="20003"
          aria-label="Zip code"
          value={zipCode}
          onChange={handleChange}
          disabled={disabled}
        />
        <PrimaryInputSubmit type="submit" value="Find my representatives" />
      </Form>
    </PageContent>
  )
}

export default LocationDisplay
