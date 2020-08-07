import React from "react"
import styled from "styled-components"
import { useNotifications } from "../context/Notifications"

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 25vw;
  width: 50vw;
  background: var(--success);
  padding: 1rem;
  display: grid;
  align-items: center;
  justify-items: center;
`

const Notification = () => {
  const { notification } = useNotifications()

  if (!notification) return null
  return (
    <Wrapper>
      <p>{notification}</p>
    </Wrapper>
  )
}

export default Notification
