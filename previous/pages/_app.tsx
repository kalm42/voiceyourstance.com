import React from "react"
import { AppProps } from "next/app"
import AppContext from "../src/context/AppContext"
import ErrorReportingBoundary from "../src/common/ErrorReportingBoundry"
import Layout from "../src/common/Layout"
import ProgressBar from "../src/common/ProgressBar"
import * as Sentry from "@sentry/browser"
import "./_app.css"

const dsn = process.env.NEXT_PUBLIC_SENTRY
Sentry.init({ dsn })

function VYSApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorReportingBoundary>
      <AppContext>
        <Layout>
          <ProgressBar options={{ easing: "ease" }} color="#344051" />
          <Component {...pageProps} />
        </Layout>
      </AppContext>
    </ErrorReportingBoundary>
  )
}

export default VYSApp
