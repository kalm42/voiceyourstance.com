import React, { useState, useEffect } from "react"
import { Form, TextInputs, TextInput, PrimaryInputSubmit } from "./elements"
import { useAuthentication } from "../context/Authentication"
import ErrorMessage from "./ErrorMessage"

interface Props {
  done?: () => void
}

const SignUp = (props: Props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const authentication = useAuthentication()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!authentication) throw new Error("You can't register an account from outside the authentication context.")
    setIsLoading(true)
    authentication
      .register(email, password)
      .then(res => {
        setIsLoading(false)
        setEmail("")
        setPassword("")
      })
      .then(() => props.done && props.done())
      .catch(error => {
        setIsLoading(false)
        setError(error)
      })
  }

  /**
   * Clear errors after some time
   */
  useEffect(() => {
    let timerId: number
    if (error) {
      timerId = setTimeout(() => {
        setError(undefined)
      }, 3000)
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [error])

  return (
    <div>
      <h2>Sign Up</h2>
      <ErrorMessage error={error} />
      <Form method="post" onSubmit={handleSubmit}>
        <TextInputs>
          <TextInput
            type="text"
            name="email"
            id="email"
            placeholder="your@email.address"
            value={email}
            onChange={event => setEmail(event.target.value)}
            disabled={isLoading}
          />
          <TextInput
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            disabled={isLoading}
          />
        </TextInputs>
        <PrimaryInputSubmit type="submit" value="Sign Up" disabled={isLoading} />
      </Form>
    </div>
  )
}

export default SignUp
