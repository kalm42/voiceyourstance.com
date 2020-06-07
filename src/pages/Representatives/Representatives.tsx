import React from "react"
import { RouteComponentProps } from "@reach/router"
import styled from "styled-components"
import Representative from "./Representative"
import { Link } from "@reach/router"
import { useRepresentatives } from "../../context/Representatives"

const Wrapper = styled.div`
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 2rem;
`
const RepLink = styled(Link)`
  color: ${(props) => props.theme.text};
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`

const Representatives = (props: RouteComponentProps) => {
  const representativeContext = useRepresentatives()
  if (!representativeContext) {
    return null
  }
  const { civicInfo } = representativeContext
  if (!civicInfo) {
    return null
  }

  const reps = []

  for (const office of civicInfo.offices) {
    const title = office.name

    for (const index of office.officialIndices) {
      const official = civicInfo.officials[index]
      const { name, party } = official
      reps.push({ title, name, party })
    }
  }

  return (
    <Wrapper>
      {reps.map((rep, index) => (
        <RepLink to={`/reps/${index}`}>
          <Representative {...rep} />
        </RepLink>
      ))}
    </Wrapper>
  )
}

export default Representatives
