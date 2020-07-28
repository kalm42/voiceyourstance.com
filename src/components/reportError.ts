import * as Sentry from "@sentry/browser"
import { StripeError } from "@stripe/stripe-js"

type AcceptableError = Error | PositionError | StripeError

export default function reportError(error: AcceptableError) {
  Sentry.captureException(error)
}
