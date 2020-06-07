import React from "react"
import AppContext from "./context/AppContext"
import { Router } from "@reach/router"
import Location from "./pages/Location"
import Representatives from "./pages/Representatives"
import Representative from "./pages/Representative"
import NotFound from "./pages/NotFound"
import Layout from "./common/Layout"
import Write from "./pages/Write"

function App() {
  return (
    <div>
      <AppContext>
        <Layout>
          <Router>
            <Location path="/" />
            <Representatives path="/reps" />
            <Representative path="/reps/:repId" />
            <Write path="/reps/:repId/write" />
            <NotFound default />
          </Router>
        </Layout>
      </AppContext>
    </div>
  )
}

export default App
