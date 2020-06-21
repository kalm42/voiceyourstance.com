import React, { useEffect } from "react"
import styled from "styled-components"
import { useAnalytics } from "../src/context/Analytics"
import ErrorReportingBoundry from "../src/common/ErrorReportingBoundry"
import Seo from "../src/common/Seo"
import { useMetaData } from "../src/context/MetaData"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`

const ContactUs = () => {
  const analytics = useAnalytics()
  const MetaData = useMetaData()

  /**
   * set the title
   */
  if (MetaData && MetaData.safeSetTitle) {
    MetaData.safeSetTitle("Contact Us")
  }

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  return (
    <Wrapper>
      <Seo metaDescription="Contact our small but mighty team to help resolve a problem." title="Contact Us" />
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
