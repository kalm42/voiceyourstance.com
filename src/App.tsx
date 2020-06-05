import React from "react"
import AppContext from "./context/AppContext"
import { Router } from "@reach/router"
import Location from "./pages/Location"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <div>
      <AppContext>
        <Router>
          <Location path="/" />
          <NotFound default />
        </Router>
      </AppContext>
    </div>
  )
}

export default App
