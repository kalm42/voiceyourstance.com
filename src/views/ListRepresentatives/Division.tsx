import React from "react"
import styled from "styled-components"
import RepresentativeLink from "./RepresentativeLink"
import { DivisionWithRepresentatives } from "../../types"

const DivisionWrapper = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`

interface Props {
  division: DivisionWithRepresentatives
}

const Division = (props: Props) => {
  const { division } = props
  return (
    <div>
      <h2>{division.name}</h2>
      <DivisionWrapper>
        {division.reps.map(rep => (
          <RepresentativeLink rep={rep} key={rep.index} />
        ))}
      </DivisionWrapper>
    </div>
  )
}

export default Division
