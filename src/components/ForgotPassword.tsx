import React from "react"
import { Form, TextInput, PrimaryInputSubmit } from "./elements"

const ForgotPassword = () => {
  return (
    <div>
      <h2>Request a password reset</h2>
      <Form method="post">
        <TextInput type="text" name="email" id="email" placeholder="your@email.address" />
        <PrimaryInputSubmit type="button" value="Request a password reset" />
      </Form>
    </div>
  )
}

export default ForgotPassword
