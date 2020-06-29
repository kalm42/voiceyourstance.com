import React, { useState } from "react"
import { Form, TextInputs, TextInput, PrimaryInputSubmit } from "./elements"
import { useAuthentication } from "../context/Authentication"

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const authentication = useAuthentication()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // validate email
    // validate password
    // validate context
    if (!authentication) throw new Error("You can't register an account from outside the authentication context.")
    setIsLoading(true)
    authentication.register(email, password)
  }
  return (
    <div>
      <h2>Sign Up</h2>
      <Form method="post" onSubmit={handleSubmit}>
        <TextInputs>
          <TextInput
            type="text"
            name="email"
            id="email"
            placeholder="your@email.address"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <TextInput
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </TextInputs>
        <PrimaryInputSubmit type="button" value="Sign Up" />
      </Form>
    </div>
  )
}

export default SignUp
