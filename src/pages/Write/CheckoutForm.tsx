import React, { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import CardSection from "./CardSection"
import styled from "styled-components"
import ErrorMessage from "../../common/ErrorMessage"
import { StripeError } from "@stripe/stripe-js"

const Button = styled.button`
  padding: 1rem;
  background: ${(props) => props.theme.main_dark};
  border: none;
  margin: 1rem 0 0 0;
  color: ${(props) => props.theme.background};
  font-size: 0.9rem;
  text-transform: lowercase;
  font-variation-settings: "wght" 600;
`

interface Props {
  callback: (id: string) => void
}

const CheckoutForm = (props: Props) => {
  const [error, setError] = useState<undefined | StripeError>(undefined)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements) return

    const uri = process.env.REACT_APP_BACKEND
    const clientSecret = await fetch(`${uri}/secret`)
      .then((response) => response.json())
      .then((json) => json.client_secret)

    const card = elements.getElement(CardElement)
    if (!card) return
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: "Name string goes here",
        },
      },
    })
    if (result.error) {
      setError(result.error)
    } else {
      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        props.callback(result.paymentIntent.id)
      }
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <ErrorMessage error={error} />
      <CardSection />
      <Button disabled={!stripe}>Confirm order</Button>
    </form>
  )
}

export default CheckoutForm
