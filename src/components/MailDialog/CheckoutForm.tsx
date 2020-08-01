import React, { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import styled from "styled-components"
import { StripeError } from "@stripe/stripe-js"
import ErrorMessage from "../../components/ErrorMessage"
import { Input } from "../../components/elements"
import CardSection from "./CardSection"

const Button = styled.button`
  padding: 1rem;
  background: var(--main);
  border: none;
  color: var(--background);
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
  border: 1px solid var(--accent);
`

interface Props {
  callback: (id: string) => void
  loading: boolean
  setLoading: (b: boolean) => void
  letterId: string | undefined
}

const CheckoutForm = (props: Props) => {
  const [error, setError] = useState<undefined | StripeError | Error>(undefined)
  const [name, setName] = useState("")
  const stripe = useStripe()
  const elements = useElements()
  const { loading, setLoading, letterId } = props

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements || !letterId) return
    setLoading(true)

    const body = JSON.stringify({ letterId })
    const uri = process.env.GATSBY_BACKEND
    const clientSecret = await fetch(`${uri}/secret`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then(response => response.json())
      .then(json => json.client_secret)
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
            name,
          },
        },
      })
      .catch(error => {
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
      }
      setLoading(false)
    }
  }
  return (
    <Form onSubmit={handleSubmit} id="checkout-form">
      <ErrorMessage error={error} />
      <Input
        placeholder="Your name"
        type="text"
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
      />
      <PaymentWrapper>
        <CardSection />
      </PaymentWrapper>
      <Button disabled={!stripe}>{loading ? "Processing..." : "Confirm order"}</Button>
    </Form>
  )
}

export default CheckoutForm
