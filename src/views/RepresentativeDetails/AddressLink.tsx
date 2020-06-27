import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faFeather } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"
import { Link } from "gatsby"
import { Address } from "../../types"

const RightArrow = styled(FontAwesomeIcon)`
  color: var(--accent);
`
const AddressDetails = styled.div`
  background: var(--main);
  display: grid;
  padding: 1rem;
  grid-template-columns: 30px 1fr 30px;
  align-items: center;
`
const Feather = styled(FontAwesomeIcon)`
  color: var(--accent);
  align-self: start;
`
const AddrLink = styled(Link)`
  color: var(--background);
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`

interface Props {
  address: Address
  repid: number
  addressId: number
}
const AddressLink = (props: Props) => {
  const { address, addressId, repid } = props
  return (
    <AddrLink to={`/reps/${repid}/write/${addressId}`}>
      <AddressDetails>
        <Feather icon={faFeather} />
        <address>
          {address.locationName} {address.locationName && <br />}
          {address.line1} {address.line1 && <br />}
          {address?.line2} {address.line2 && <br />}
          {address?.line3} {address.line3 && <br />}
          {address.city}, {address.state}, {address.zip}
        </address>
        <RightArrow icon={faArrowRight} />
      </AddressDetails>
    </AddrLink>
  )
}

export default AddressLink
