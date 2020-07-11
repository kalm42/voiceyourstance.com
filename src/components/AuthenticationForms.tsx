import React, { useState, useRef, useCallback, useEffect } from "react"
import styled from "styled-components"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import ForgotPassword from "./ForgotPassword"
import { Divider } from "./elements"

const FormControls = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-evenly;
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

const AuthenticationForms = (props: Props) => {
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
      // props.callback()
    }
    // close()
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
    <div ref={ref}>
      {!isSignUp && !forgotPassword && <SignIn done={handleCallback} />}
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
    </div>
  )
}

export default AuthenticationForms
