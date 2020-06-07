import React from "react"
import styled from "styled-components"
import { Link } from "@reach/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faFeather } from "@fortawesome/free-solid-svg-icons"
import { Address } from "../../types"

const RightArrow = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
`
const AddressDetails = styled.div`
  background: ${(props) => props.theme.main};
  display: grid;
  padding: 1rem;
  grid-template-columns: 30px 1fr 30px;
  align-items: center;
`
const Feather = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
  align-self: start;
`
const AddressLink = styled(Link)`
  color: ${(props) => props.theme.background};
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`

interface Props {
  address?: Address
  repId?: string
  addrId: number
}

const DisplayAddress = (props: Props) => {
  const { address, repId, addrId } = props
  if (!address || !repId) return null

  return (
    <AddressLink to={`/reps/${repId}/write/${addrId}`}>
      <AddressDetails>
        <Feather icon={faFeather} />
        <address>
          {address.locationName} {address.locationName && <br />}
          {address.line1} {address.line1 && <br />}
          {address.line2} {address.line2 && <br />}
          {address.line3} {address.line3 && <br />}
          {address.city}, {address.state}, {address.zip}
        </address>
        <RightArrow icon={faArrowRight} />
      </AddressDetails>
    </AddressLink>
  )
}

export default DisplayAddress
