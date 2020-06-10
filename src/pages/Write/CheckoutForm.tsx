import React from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import CardSection from "./CardSection"

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements) return

    const clientSecret = await fetch("http://localhost:8000/secret")
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
      console.log(result.error)
      // TODO: handle error
    } else {
      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // TODO handle success
      }
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <CardSection />
      <button disabled={!stripe}>Confirm order</button>
    </form>
  )
}

export default CheckoutForm
