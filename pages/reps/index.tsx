import React, { useEffect } from "react"
import styled from "styled-components"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCircle, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useRepresentatives } from "../../src/context/Representatives"
import { useAnalytics } from "../../src/context/Analytics"
import ErrorReportingBoundry from "../../src/common/ErrorReportingBoundry"
import ErrorMessage from "../../src/common/ErrorMessage"
import Seo from "../../src/common/Seo"
import { useMetaData } from "../../src/context/MetaData"

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
const RepLink = styled.a`
  color: ${(props) => props.theme.text};
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
  const analytics = useAnalytics()
  const MetaData = useMetaData()

  /**
   * set the title
   */
  if (MetaData && MetaData.safeSetTitle) {
    MetaData.safeSetTitle("Representatives")
  }

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  if (!representativeContext) return null
  const { civicInfo } = representativeContext
  if (!civicInfo) {
    return (
      <Wrapper>
        <ErrorMessage error={new Error("No representatives found. Please search for them again.")} />
      </Wrapper>
    )
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
      <Seo metaDescription="A list of all of your representatives." title="Representatives" />
      <ErrorReportingBoundry>
        {scope.map((division, divisionIndex) => (
          <div key={division.id}>
            <h2>{division.name}</h2>
            <DivisionWrapper>
              {division.reps.map((rep) => (
                <Link href="/reps/[repid]" as={`/reps/${rep.index}`} key={rep.index} passHref>
                  <RepLink>
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
                </Link>
              ))}
            </DivisionWrapper>
          </div>
        ))}
      </ErrorReportingBoundry>
    </Wrapper>
  )
}

export default Representatives
