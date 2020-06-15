import React, { useEffect, useCallback } from "react"
import styled from "styled-components"
import { useAnalytics } from "../../context/Analytics"
import ErrorReportingBoundry from "../../common/ErrorReportingBoundry"
import { useMetaData } from "../../context/MetaData"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`

const ContactUs = () => {
  const analytics = useAnalytics()
  const MetaData = useMetaData()

  const setMetaData = useCallback(() => {
    if (!MetaData) return
    MetaData.setMetaDescription("Contact our small but mighty team to help resolve a problem.")
    MetaData.setTitle("Contact Us")
  }, [MetaData])

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
    setMetaData()
  }, [analytics, setMetaData])

  return (
    <Wrapper>
      <ErrorReportingBoundry>
        <h1>Contact Us</h1>
        <p>
          We're a small crew with big dreams. Feel free to email Kyle Melton, or Wade Harned for support. This is just a
          weekend project for us so be patient.
        </p>
        <p>
          <a href="mailto:me@kylemelton.dev">Kyle</a>
        </p>
        <p>
          <a href="mailto:me@kylemelton.dev">Wade</a>
        </p>
      </ErrorReportingBoundry>
    </Wrapper>
  )
}

export default ContactUs
