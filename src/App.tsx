import React from "react"
import AppContext from "./context/AppContext"
import { Router } from "@reach/router"
import Location from "./pages/Location"
import NotFound from "./pages/NotFound"
import Layout from "./common/Layout"

function App() {
  return (
    <div>
      <AppContext>
        <Layout>
          <Router>
            <Location path="/" />
            <NotFound default />
          </Router>
        </Layout>
      </AppContext>
    </div>
  )
}

export default App
