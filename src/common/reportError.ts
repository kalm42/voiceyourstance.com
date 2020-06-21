import * as Sentry from "@sentry/browser"
import ReactGA from "react-ga"
import { StripeError } from "@stripe/stripe-js"
const ANALYTICS_KEY = process.env.NEXT_PUBLIC_ANALYTICS_KEY

type AcceptableError = Error | PositionError | StripeError

export default function reportError(error: AcceptableError) {
  Sentry.captureException(error)

  if (!ANALYTICS_KEY) return
  ReactGA.initialize(ANALYTICS_KEY)
  ReactGA.exception({
    description: error.message,
    fatal: false,
  })
}
