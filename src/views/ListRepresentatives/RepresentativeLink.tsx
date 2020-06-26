import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCircle, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { Representative } from "../../types"

const RepLink = styled(Link)`
  color: ${props => props.theme.text};
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`
const ProfileIcon = styled(FontAwesomeIcon)`
  height: 4rem !important;
  width: 4rem !important;
  color: ${props => props.theme.main};
`
const Rep = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 20px;
  align-items: center;
`
const ChevronRight = styled(FontAwesomeIcon)`
  color: ${props => props.theme.accent};
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
  rep: Representative
}

const RepresentativeLink = (props: Props) => {
  const { rep } = props
  return (
    <RepLink to={`/reps/${rep.index}`}>
      <Rep>
        <ProfileIcon icon={faUserCircle} />
        <div>
          <p>{rep.title}</p>
          <p>
            {rep.name} <Dot /> {rep.party}
          </p>
        </div>
        <ChevronRight icon={faChevronRight} />
      </Rep>
    </RepLink>
  )
}

export default RepresentativeLink
