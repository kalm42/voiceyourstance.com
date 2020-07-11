import React, { useState } from "react"
import { Form, TextInput, PrimaryInputSubmit } from "./elements"
import ErrorMessage from "./ErrorMessage"
import { useAuthentication } from "../context/Authentication"

interface Props {
  done?: () => void
}

const ForgotPassword = (props: Props) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const authentication = useAuthentication()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    if (authentication) {
      authentication.requestPasswordReset(email).then(() => {
        setEmail("")
        setIsLoading(false)
        setIsDone(true)
      })
    } else {
      setIsLoading(false)
      setError(new Error("Please refresh the page and try again."))
    }
  }

  return (
    <div>
      <h2>Request a password reset</h2>
      <ErrorMessage error={error} />
      {isDone ? (
        <div>
          <p>Success. Check your email for more instructions.</p>
        </div>
      ) : (
        <Form method="post" onSubmit={handleSubmit}>
          <TextInput
            type="text"
            name="email"
            id="email"
            placeholder="your@email.address"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <PrimaryInputSubmit type="submit" value="Request a password reset" />
        </Form>
      )}
    </div>
  )
}

export default ForgotPassword
