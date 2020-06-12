import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCircle, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"

const ProfileIcon = styled(FontAwesomeIcon)`
  height: 4rem !important;
  width: 4rem !important;
  color: ${(props) => props.theme.main};
`
const Rep = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 20px;
  align-items: center;
`
const ChevronRight = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
`
const Dot = styled.span`
  width: 5px;
  height: 5px;
  background: black;
  display: inline-block;
  border-radius: 50%;
  margin: 3px;
`

interface Props {
  title?: string
  name?: string
  party?: string
}

const Representative = (props: Props) => {
  const { title, name, party } = props
  return (
    <Rep>
      <ProfileIcon icon={faUserCircle} />
      <div>
        <p>{title}</p>
        <p>
          {name} <Dot /> {party}
        </p>
      </div>
      <ChevronRight icon={faChevronRight} />
    </Rep>
  )
}

export default Representative
