import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`
const Icon = styled(FontAwesomeIcon)`
  color: var(--accent);
  height: 20px !important;
  width: 20px !important;
`
interface Props {
  handleClick: () => void
}

const CloseButton = (props: Props) => {
  const { handleClick } = props
  return (
    <Button onClick={handleClick}>
      <Icon icon={faTimes} />
    </Button>
  )
}

export default CloseButton
