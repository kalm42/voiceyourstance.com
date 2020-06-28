import React from "react"
import { Form, TextInputs, TextInput, PrimaryInputSubmit } from "./elements"

const SignUp = () => {
  return (
    <div>
      <h2>Sign Up</h2>
      <Form method="post">
        <TextInputs>
          <TextInput type="text" name="email" id="email" placeholder="your@email.address" />
          <TextInput type="password" name="password" id="password" placeholder="password" />
        </TextInputs>
        <PrimaryInputSubmit type="button" value="Sign Up" />
      </Form>
    </div>
  )
}

export default SignUp
