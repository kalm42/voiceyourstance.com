import React from "react"
import { RouteComponentProps } from "@reach/router"

interface Props extends RouteComponentProps {
  templateId?: string
}
const WriteTemplate = (props: Props) => {
  const { templateId } = props
  return (
    <div>
      <h2>Write template page</h2>
      <p>{templateId}</p>
    </div>
  )
}

export default WriteTemplate
