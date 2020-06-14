import React, { useEffect } from "react"
import styled from "styled-components"
import { useAnalytics } from "../context/Analytics"

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
`

const NotFound = () => {
  const analytics = useAnalytics()

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  return (
    <Wrapper>
      <h1>Error: 404</h1>
      <p>I'm sorry but the route you're looking for does not exist. Do not try again. It still won't be there.</p>
    </Wrapper>
  )
}

export default NotFound
