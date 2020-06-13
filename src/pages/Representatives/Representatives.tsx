import React from "react"
import { RouteComponentProps, navigate } from "@reach/router"
import styled from "styled-components"
import Representative from "./Representative"
import { Link } from "@reach/router"
import { useRepresentatives } from "../../context/Representatives"

const Wrapper = styled.div`
  padding: 0 2rem;
  display: grid;
  grid-gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
`
const DivisionWrapper = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
interface Rep {
  title: string
  name: string
  party: string
}
interface Div {
  id: string
  name: string
  reps: Rep[]
}
type YourReps = Div[]

const Representatives = (props: RouteComponentProps) => {
  const representativeContext = useRepresentatives()
  if (!representativeContext) {
    const message = encodeURIComponent("Please refresh the page and try again.")
    navigate(`/?error=${message}`)
    return null
  }

  const { civicInfo } = representativeContext
  if (!civicInfo) {
    const message = encodeURIComponent("There was an error and we did not find any representatives for you.")
    navigate(`/?error=${message}`)
    return null
  }

  const scope: YourReps = []
  for (const divisionId in civicInfo.divisions) {
    if (civicInfo.divisions.hasOwnProperty(divisionId)) {
      const division = civicInfo.divisions[divisionId]
      const reps: Rep[] = []

      if (division.officeIndices) {
        division.officeIndices.forEach((officeIndex) => {
          const office = civicInfo.offices[officeIndex]
          const title = office.name

          for (const index of office.officialIndices) {
            const official = civicInfo.officials[index]
            const { name, party } = official
            reps.push({ title, name, party })
          }
        })

        const department: Div = {
          id: divisionId,
          name: division.name,
          reps,
        }
        scope.push(department)
      }
    }
  }

  return (
    <Wrapper>
      {scope.map((division) => (
        <div key={division.id}>
          <h2>{division.name}</h2>
          <DivisionWrapper>
            {division.reps.map((rep, index) => (
              <RepLink to={`/reps/${index}`}>
                <Representative {...rep} />
              </RepLink>
            ))}
          </DivisionWrapper>
        </div>
      ))}
    </Wrapper>
  )
}

export default Representatives
