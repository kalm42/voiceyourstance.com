import React, { useState } from "react"
import { Form, TextInputs, TextInput, PrimaryInputSubmit } from "./elements"
import { useAuthentication } from "../context/Authentication"
import ErrorMessage from "./ErrorMessage"

interface Props {
  done?: () => void
}

const SignIn = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<Error | undefined>(undefined)
  const authentication = useAuthentication()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    if (authentication) {
      authentication
        .login(email, password)
        .then(() => {
          setIsLoading(false)
          setEmail("")
          setPassword("")
          if (props.done) {
            props.done()
          }
        })
        .catch(error => {
          setError(error)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
      setError(new Error("Please refresh the page and try again."))
    }
  }
  return (
    <div>
      <h2>Please Sign In</h2>
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
        <PrimaryInputSubmit type="submit" value="Sign In" disabled={isLoading} />
      </Form>
    </div>
  )
}

export default SignIn
