import React from "react"
import { Form, TextInputs, TextInput, PrimaryInputSubmit } from "./elements"

const SignIn = () => {
  // Have this also handle password reset requests
  return (
    <div>
      <h2>Please Sign In</h2>
      <Form method="post">
        <TextInputs>
          <TextInput type="text" name="email" id="email" placeholder="your@email.address" />
          <TextInput type="password" name="password" id="password" placeholder="password" />
        </TextInputs>
        <PrimaryInputSubmit type="button" value="Sign In" />
      </Form>
    </div>
  )
}

export default SignIn
