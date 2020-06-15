import React, { useEffect, useCallback } from "react"
import styled from "styled-components"
import Representative from "./Representative"
import { Link, useHistory } from "react-router-dom"
import { useRepresentatives } from "../../context/Representatives"
import { useAnalytics } from "../../context/Analytics"
import ErrorReportingBoundry from "../../common/ErrorReportingBoundry"
import { useMetaData } from "../../context/MetaData"

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
  index: number
}
interface Div {
  id: string
  name: string
  reps: Rep[]
}
type YourReps = Div[]

const Representatives = () => {
  const representativeContext = useRepresentatives()
  const history = useHistory()
  const analytics = useAnalytics()
  const MetaData = useMetaData()

  const setMetaData = useCallback(() => {
    if (!MetaData) return
    MetaData.setMetaDescription("A list of all of your representatives.")
    MetaData.setTitle("Representatives")
  }, [MetaData])

  useEffect(() => {
    setMetaData()
  }, [setMetaData])

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  if (!representativeContext) {
    const message = encodeURIComponent("Please refresh the page and try again.")
    history.push(`/?error=${message}`)
    return null
  }

  const { civicInfo } = representativeContext
  if (!civicInfo) {
    const message = encodeURIComponent("There was an error and we did not find any representatives for you.")
    history.push(`/?error=${message}`)
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
            reps.push({ title, name, party, index })
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
      <ErrorReportingBoundry>
        {scope.map((division, divisionIndex) => (
          <div key={division.id}>
            <h2>{division.name}</h2>
            <DivisionWrapper>
              {division.reps.map((rep) => (
                <RepLink to={`/reps/${rep.index}`} key={rep.index}>
                  <Representative {...rep} />
                </RepLink>
              ))}
            </DivisionWrapper>
          </div>
        ))}
      </ErrorReportingBoundry>
    </Wrapper>
  )
}

export default Representatives
