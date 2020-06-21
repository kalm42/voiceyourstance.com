import React, { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import CardSection from "./CardSection"
import styled from "styled-components"
import ErrorMessage from "../../common/ErrorMessage"
import { StripeError } from "@stripe/stripe-js"
import { useAnalytics } from "../../context/Analytics"

const Button = styled.button`
  padding: 1rem;
  background: ${(props) => props.theme.main};
  border: none;
  color: ${(props) => props.theme.background};
  font-size: 0.9rem;
  text-transform: lowercase;
  font-variation-settings: "wght" 600;
  cursor: pointer;
`
const Form = styled.form`
  display: grid;
  grid-gap: 1rem;
`
const PaymentWrapper = styled.div`
  font-size: 1rem;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.accent};
`

interface Props {
  callback: (id: string) => void
}

const CheckoutForm = (props: Props) => {
  const [error, setError] = useState<undefined | StripeError | Error>(undefined)
  const [loading, setLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const analytics = useAnalytics()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    analytics?.event("MAIL", "Attempt payment", "PAYMENT_ATTEMPT")
    if (!stripe || !elements) return
    setLoading(true)

    const uri = process.env.NEXT_PUBLIC_BACKEND
    const clientSecret = await fetch(`${uri}/secret`)
      .then((response) => response.json())
      .then((json) => json.client_secret)
      .catch(() => {
        setLoading(false)
        setError(new Error("The server is not responding. Try again in a bit."))
      })
    if (!clientSecret) return

    const card = elements.getElement(CardElement)
    if (!card) return
    const result = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: "Name string goes here",
          },
        },
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
        return error
      })

    if (result.error) {
      setLoading(false)
      setError(result.error)
    } else {
      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        props.callback(result.paymentIntent.id)
        analytics?.event("MAIL", "Payment successful", "PAYMENT_SUCCESS")
      }
      setLoading(false)
    }
  }
  return (
    <Form onSubmit={handleSubmit}>
      <ErrorMessage error={error} />
      <PaymentWrapper>
        <CardSection />
      </PaymentWrapper>
      <Button disabled={!stripe}>{loading ? "Processing..." : "Confirm order"}</Button>
    </Form>
  )
}

export default CheckoutForm
