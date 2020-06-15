import React, { useEffect, useCallback } from "react"
import styled from "styled-components"
import { useAnalytics } from "../context/Analytics"
import { useMetaData } from "../context/MetaData"

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
`

const NotFound = () => {
  const analytics = useAnalytics()
  const MetaData = useMetaData()

  const setMetaData = useCallback(() => {
    if (!MetaData) return
    MetaData.setMetaDescription("The page you were looking for is not here.")
    MetaData.setTitle("Not Found")
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

  return (
    <Wrapper>
      <h1>Error: 404</h1>
      <p>I'm sorry but the route you're looking for does not exist. Do not try again. It still won't be there.</p>
    </Wrapper>
  )
}

export default NotFound
