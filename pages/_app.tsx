import React from "react"
import { AppProps } from "next/app"
import NextNProgress from "nextjs-progressbar"
import AppContext from "../src/context/AppContext"
import ErrorReportingBoundary from "../src/common/ErrorReportingBoundry"
import Layout from "../src/common/Layout"
import * as Sentry from "@sentry/browser"
import "./_app.css"

const dsn = process.env.NEXT_PUBLIC_SENTRY
Sentry.init({ dsn })

function VYSApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorReportingBoundary>
      <AppContext>
        <Layout>
          <NextNProgress options={{ easing: "ease" }} color="#344051" />
          <Component {...pageProps} />
        </Layout>
      </AppContext>
    </ErrorReportingBoundary>
  )
}

export default VYSApp
