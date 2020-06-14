import React from "react"
import { CardElement } from "@stripe/react-stripe-js"

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#000000",
      fontWeight: "300",
      "::placeholder": {
        color: "dimgrey",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
}

const CardSection = () => {
  return (
    <label>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
  )
}

export default CardSection
