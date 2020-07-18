import React, { useState, useRef, useCallback, useEffect } from "react"
import styled from "styled-components"
import SignIn from "../../components/SignIn"
import SignUp from "../../components/SignUp"
import ForgotPassword from "../../components/ForgotPassword"

interface WrapperProps {
  isOpen: boolean
}
const Wrapper = styled.div`
  position: fixed;
  top: calc(100vh / 3 / 2);
  left: 0;
  right: 0;
  margin: auto;
  background: var(--background);
  border: 1px solid var(--accent);
  padding: 2rem;
  max-height: 67vh;
  width: calc((100vw / 3 / 2) * 4);
  transition: all 200ms ease-in;
`
const FormControls = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-evenly;
`
const Divider = styled.hr`
  border: 1px dashed var(--accent);
  margin: 1rem;
`
const Controls = styled.button`
  border: none;
  background: none;
  padding: 1rem;
  font-size: 1rem;
  font-variation-settings: "wght" 300;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    background: var(--main);
    color: var(--background);
  }
  &:active {
    transform: scale(0.95);
  }
`

interface Props {
  isOpen: boolean
  close: () => void
  callback?: () => void
}

const AuthenticationDialog = (props: Props) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { close } = props

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!ref.current || !event.target) return

      if (ref.current.contains(event.target as Node)) {
        return
      } else {
        close()
      }
    },
    [props],
  )

  const handleCallback = () => {
    if (props.callback) {
      props.callback()
    }
    close()
  }

  /**
   * Handle click outside close
   */
  useEffect(() => {
    document.addEventListener("mousedown", handleClick, false)
    return () => {
      document.removeEventListener("mousedown", handleClick, false)
    }
  }, [handleClick])

  const toggleViewForgotPassword = () => {
    if (forgotPassword) {
      setForgotPassword(false)
      setIsSignUp(false)
    } else {
      setForgotPassword(true)
      setIsSignUp(false)
    }
  }

  const toggleViewSignup = () => {
    if (isSignUp) {
      setIsSignUp(false)
      setForgotPassword(false)
    } else {
      setIsSignUp(true)
      setForgotPassword(false)
    }
  }

  return (
    <Wrapper ref={ref}>
      {!isSignUp && !forgotPassword && <SignIn />}
      {isSignUp && <SignUp done={handleCallback} />}
      {forgotPassword && <ForgotPassword />}
      <Divider />
      <FormControls>
        <li>
          <Controls onClick={() => toggleViewSignup()}>{isSignUp ? "Login" : "Sign up"}</Controls>
        </li>
        <li>
          <Controls onClick={() => toggleViewForgotPassword()}>
            {forgotPassword ? "Nevermind I remember" : "Forgot your password?"}
          </Controls>
        </li>
      </FormControls>
    </Wrapper>
  )
}

export default AuthenticationDialog
