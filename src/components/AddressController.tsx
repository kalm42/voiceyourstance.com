import React from "react"
import styled from "styled-components"
import ErrorReportingBoundry from "./ErrorReportingBoundry"
import FromForm from "./FromForm"
import { Representative, Address } from "../types"

const AddressDetails = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 1rem;
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`

interface Props {
  disabled: boolean
  to: Representative
  toAddress: Address
  from: {
    name: string
    line1: string
    city: string
    state: string
    zip: string
    setName: (L: string) => void
    setLine1: (L: string) => void
    setCity: (L: string) => void
    setState: (L: string) => void
    setZip: (L: string) => void
    handleSave: (event: React.FormEvent<HTMLFormElement>) => void
  }
}

const AddressController = (props: Props) => {
  const { disabled, to, toAddress, from } = props
  return (
    <AddressDetails>
      <ErrorReportingBoundry>
        <FromForm
          disabled={disabled}
          line1={from.line1}
          setLine1={from.setLine1}
          name={from.name}
          setName={from.setName}
          city={from.city}
          setCity={from.setCity}
          setState={from.setState}
          setZip={from.setZip}
          state={from.state}
          zip={from.zip}
          handleSave={from.handleSave}
        />
      </ErrorReportingBoundry>
      <div>
        <h2>To</h2>
        <p>
          {to.name} <br /> {to.title}
        </p>
        <address>
          {toAddress.locationName} {toAddress.locationName && <br />}
          {toAddress.line1} {toAddress.line1 && <br />}
          {toAddress.line2} {toAddress.line2 && <br />}
          {toAddress.line3} {toAddress.line3 && <br />}
          {toAddress.city}, {toAddress.state}, {toAddress.zip}
        </address>
      </div>
    </AddressDetails>
  )
}

export default AddressController
