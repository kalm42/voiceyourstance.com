import React from "react"
import { RouteComponentProps } from "@reach/router"

interface Props extends RouteComponentProps {
  templateId?: string
  toId?: string
}
const SharedLetter = (props: Props) => {
  const { templateId, toId } = props
  return (
    <div>
      <h2>Shared Letter page</h2>
      <p>{templateId}</p>
      <p>{toId}</p>
    </div>
  )
}

export default SharedLetter
