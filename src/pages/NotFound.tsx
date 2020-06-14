import React, { useEffect } from "react"
import { useAnalytics } from "../context/Analytics"

const NotFound = () => {
  const analytics = useAnalytics()

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  return (
    <div>
      <h1>Error: 404</h1>
      <p>I'm sorry but the route you're looking for does not exist. Do not try again. It still won't be there.</p>
    </div>
  )
}

export default NotFound
