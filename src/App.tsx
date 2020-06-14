import React from "react"
import AppContext from "./context/AppContext"
import Layout from "./common/Layout"
import Routes from "./Routes"
import { BrowserRouter } from "react-router-dom"
import ErrorReportingBoundry from "./common/ErrorReportingBoundry"

function App() {
  return (
    <ErrorReportingBoundry>
      <BrowserRouter>
        <AppContext>
          <Layout>
            <Routes />
          </Layout>
        </AppContext>
      </BrowserRouter>
    </ErrorReportingBoundry>
  )
}

export default App
