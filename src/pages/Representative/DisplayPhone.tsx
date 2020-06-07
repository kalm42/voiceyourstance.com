import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPhoneAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons"

const RightArrow = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
`
const PhoneLink = styled.a`
  color: ${(props) => props.theme.background};
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`
const PhoneIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
`
const PhoneDetails = styled.div`
  background: ${(props) => props.theme.main};
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  align-items: center;
  padding: 0.5rem 1rem;
`

interface Props {
  phoneNumber?: string
}

const DisplayPhone = (props: Props) => {
  const { phoneNumber = "5551235555" } = props
  return (
    <PhoneLink href={`tel:${phoneNumber}`}>
      <PhoneDetails>
        <PhoneIcon icon={faPhoneAlt} />
        <p>{phoneNumber}</p>
        <RightArrow icon={faArrowRight} />
      </PhoneDetails>
    </PhoneLink>
  )
}

export default DisplayPhone
