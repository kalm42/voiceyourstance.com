import React from "react"
import AppContext from "./context/AppContext"
import Layout from "./common/Layout"
import Routes from "./Routes"
import { BrowserRouter } from "react-router-dom"
import ErrorReportingBoundry from "./common/ErrorReportingBoundry"
import Seo from "./common/Seo"

function App() {
  return (
    <ErrorReportingBoundry>
      <BrowserRouter>
        <AppContext>
          <Layout>
            <Seo />
            <Routes />
          </Layout>
        </AppContext>
      </BrowserRouter>
    </ErrorReportingBoundry>
  )
}

export default App
