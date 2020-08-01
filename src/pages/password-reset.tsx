import React, { useState, useEffect } from "react"
import { RouteComponentProps, navigate } from "@reach/router"
import { useAuthentication } from "../context/Authentication"
import Layout from "../components/Layout"
import ErrorMessage from "../components/ErrorMessage"
import { Form, TextInput, TextInputs, PrimaryInputSubmit } from "../components/elements"
import styled from "styled-components"
import { GQL } from "../types"
import { useUser } from "../context/UserContext"

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 700px;
  padding: 0 2rem;
`

const PasswordResetPage = (props: RouteComponentProps) => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<GQL.GQLError | Error | undefined>(undefined)
  const authentication = useAuthentication()
  const queryParams = new URLSearchParams(props.location?.search)
  const resetToken = queryParams.get("resetToken")
  const user = useUser()

  // No logged in users
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!authentication) {
      setError(new Error("There has been an internal error. Please refresh the page."))
      return
    }
    if (resetToken) {
      authentication.changePassword(resetToken, password, confirmPassword).catch((err: GQL.GQLError) => {
        setError(err)
      })
    } else {
      setError(new Error("You do not have a reset token. How did you get here?"))
    }
  }

  return (
    <Layout>
      <Wrapper>
        <h1>Reset Your Password</h1>
        <p>
          We have only one password requirement. Your password must never have been compromised in a data breach. We
          highly suggest that you use a password manager to make and store your passwords.
        </p>
        <ErrorMessage error={error} />
        <Form method="post" onSubmit={handleSubmit}>
          <TextInputs>
            <TextInput
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
            <TextInput
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
            />
          </TextInputs>
          <PrimaryInputSubmit type="submit" value="Chnage your password" />
        </Form>
      </Wrapper>
    </Layout>
  )
}

export default PasswordResetPage
