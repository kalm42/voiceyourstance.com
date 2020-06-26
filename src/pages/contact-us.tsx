import React, { useEffect } from "react"
import styled from "styled-components"
import { useAnalytics } from "../context/Analytics"
import { useMetaData } from "../context/MetaData"
import ErrorReportingBoundry from "../components/ErrorReportingBoundry"
import SEO from "../components/SEO"
import Layout from "../components/Layout"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`

const ContactUsPage = () => {
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
    <Layout>
      <Wrapper>
        <SEO
          description="Contact our small but mighty team to help resolve a problem."
          title="Contact Us | Voice Your Stance"
        />
        <ErrorReportingBoundry>
          <h1>Contact Us</h1>
          <p>
            We're a small crew with big dreams. Feel free to email Kyle Melton, or Wade Harned for support. This is just
            a weekend project for us so be patient.
          </p>
          <p>
            <a href="mailto:me@kylemelton.dev">Kyle</a>
          </p>
          <p>
            <a href="mailto:me@kylemelton.dev">Wade</a>
          </p>
        </ErrorReportingBoundry>
      </Wrapper>
    </Layout>
  )
}

export default ContactUsPage
