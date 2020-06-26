import React, { Component } from "react"
import * as Sentry from "@sentry/browser"
import ReactGA from "react-ga"
const ANALYTICS_KEY = process.env.GATSBY_ANALYTICS_KEY

type AcceptableError = Error

export default class ErrorReportingBoundry extends Component {
  state = {
    error: "",
    eventId: "",
    errorInfo: "",
    hasError: false,
  }

  static getDerivedStateFromError(error: AcceptableError) {
    return { hasError: true, error }
  }

  componentDidCatch(error: AcceptableError, errorInfo: object) {
    console.log({ error, errorInfo })
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo)
      const eventId = Sentry.captureException(error)
      this.setState({ eventId, errorInfo })
    })
    ReactGA.exception({
      description: error.message,
      fatal: true,
    })
  }

  componentDidMount() {
    if (!ANALYTICS_KEY) {
      throw new Error("No analytics key!")
    }
    ReactGA.initialize(ANALYTICS_KEY)
  }

  render() {
    const { hasError } = this.state

    if (hasError) {
      return (
        <div>
          <div>
            <p>
              Shoot! An error has occurred.{" "}
              <span
                onClick={() => {
                  window.location.reload()
                }}
              >
                Reload this page
              </span>
            </p>
          </div>
          <button onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</button>
        </div>
      )
    }
    return this.props.children
  }
}
