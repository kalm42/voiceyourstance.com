import React, { useEffect } from "react"
import styled from "styled-components"
import { useAnalytics } from "../../context/Analytics"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`

const ContactUs = () => {
  const analytics = useAnalytics()

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  return (
    <Wrapper>
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
    </Wrapper>
  )
}

export default ContactUs
