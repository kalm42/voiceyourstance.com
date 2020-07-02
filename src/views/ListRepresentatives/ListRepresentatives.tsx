import React, { useEffect } from "react"
import styled from "styled-components"
import { RouteComponentProps } from "@reach/router"
import { useRepresentatives } from "../../context/Representatives"
import { useAnalytics } from "../../context/Analytics"
import ErrorReportingBoundry from "../../components/ErrorReportingBoundry"
import ErrorMessage from "../../components/ErrorMessage"
import SEO from "../../components/SEO"
import { useMetaData } from "../../context/MetaData"
import Division from "./Division"

const Wrapper = styled.div`
  padding: 0 2rem;
  display: grid;
  grid-gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
`

interface Props extends RouteComponentProps {}

const ListRepresentatives = (props: Props) => {
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

  const rgbd = representativeContext?.getRepresentativesGroupedByDivision()
  if (!rgbd || !rgbd.length) {
    return (
      <Wrapper>
        <ErrorMessage error={new Error("No representatives found. Please search for them again.")} />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <SEO description="A list of all of your representatives." title="Representatives" />
      <ErrorReportingBoundry>
        {rgbd.map(division => (
          <Division division={division} key={division.id} />
        ))}
      </ErrorReportingBoundry>
    </Wrapper>
  )
}

export default ListRepresentatives
