import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faPhoneAlt } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"

const RightArrow = styled(FontAwesomeIcon)`
  color: ${props => props.theme.accent};
`
const PLink = styled.a`
  color: ${props => props.theme.background};
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`
const PhoneIcon = styled(FontAwesomeIcon)`
  color: ${props => props.theme.accent};
`
const PhoneDetails = styled.div`
  background: ${props => props.theme.main};
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  align-items: center;
  padding: 0.5rem 1rem;
`

interface Props {
  phone: string
}

const PhoneLink = (props: Props) => {
  const { phone } = props
  return (
    <PLink href={`tel:${phone}`}>
      <PhoneDetails>
        <PhoneIcon icon={faPhoneAlt} />
        <p>{phone}</p>
        <RightArrow icon={faArrowRight} />
      </PhoneDetails>
    </PLink>
  )
}

export default PhoneLink
