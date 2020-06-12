import React from "react"
import { RouteComponentProps } from "@reach/router"

const NotFound = (props: RouteComponentProps) => {
  return (
    <div>
      <h1>Error: 404</h1>
      <p>I'm sorry but the route you're looking for does not exist. Do not try again. It still won't be there.</p>
    </div>
  )
}

export default NotFound
