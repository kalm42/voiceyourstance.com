import React from "react"
import styled from "styled-components"

const PageContent = styled.div`
  max-width: 800px;
  width: 67vw;
  margin: 0 auto;
`
const Form = styled.form`
  display: grid;
  grid-gap: 1rem;
`
const Input = styled.input`
  font-size: 1rem;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.accent};
`
const PrimaryButton = styled.input`
  padding: 1rem;
  background: ${(props) => props.theme.main};
  color: ${(props) => props.theme.background};
  border: 0;
  font-size: 1rem;
  text-transform: lowercase;
  transition: all 200ms ease;
  &:hover {
    background: ${(props) => props.theme.main_dark};
  }
  &:active {
    transform: scale(0.9);
  }
`
const SecondaryButton = styled.button`
  padding: 1rem;
  font-size: 1rem;
  background: white;
  border: 2px solid ${(props) => props.theme.main};
  margin-bottom: 1rem;
  text-transform: lowercase;
  transition: all 200ms ease;
  &:hover {
    background: ${(props) => props.theme.main_dark};
    color: ${(props) => props.theme.background};
  }
  &:active {
    transform: scale(0.9);
  }
`

interface Props {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  disabled: boolean
  getGeoLocation: () => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const LocationDisplay = (props: Props) => {
  const { streetAddress, city, state, zipCode, getGeoLocation, handleChange, disabled } = props
  return (
    <PageContent>
      <p>What is your voter registration address?</p>
      <SecondaryButton onClick={getGeoLocation}>Use my current location</SecondaryButton>
      <Form method="post">
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
        <PrimaryButton type="submit" value="Find my representatives" />
      </Form>
    </PageContent>
  )
}

export default LocationDisplay
