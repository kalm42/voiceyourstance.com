import styled, { keyframes } from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Wrapper = styled.div`
  position: fixed;
  top: 10vh;
  left: calc(50vw - 250px - 2rem);
  width: 80vw;
  background: white;
  padding: 2rem;
  max-width: 500px;
  border: 1px solid var(--accent);
  max-height: 80vh;
  overflow-x: scroll;

  @media (max-width: 600px) {
    left: 1vw;
    top: 5vh;
  }
`
export const H1 = styled.h1`
  font-variation-settings: "wght" 600;
  text-align: center;
`
export const PaymentWrapper = styled.div`
  padding: 1rem;
`
export const StepsList = styled.ul`
  list-style: none;
  padding: 1rem;
`
export const Step = styled.li`
  padding: 0.5rem;
`
export const StepIcon = styled.span`
  padding: 0.7rem;
`
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
export const Spinner = styled(FontAwesomeIcon)`
  animation: ${rotate} 750ms linear infinite;
`
export const GoldIcon = styled(FontAwesomeIcon)`
  color: var(--accent);
`
export const CodeWrapper = styled.div`
  padding: 1rem;
  background: grey;
`
export const Code = styled.code`
  display: block;
  max-width: 400px;
  overflow: hidden;
  margin: 0 auto;
`
