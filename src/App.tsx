import React from "react"
import AppContext from "./context/AppContext"
import { Router } from "@reach/router"
import Location from "./pages/Location"
import Representatives from "./pages/Representatives"
import Representative from "./pages/Representative"
import NotFound from "./pages/NotFound"
import Layout from "./common/Layout"
import Write from "./pages/Write"
import ContactUs from "./pages/ContactUs"
import PrivacyPolicy from "./pages/PrivacyPolicy"

function App() {
  return (
    <div>
      <AppContext>
        <Layout>
          <Router>
            <Location path="/" />
            <Representatives path="/reps" />
            <Representative path="/reps/:repId" />
            <Write path="/reps/:repId/write/:addrId" />
            <ContactUs path="/contact-us" />
            <PrivacyPolicy path="/privacy-policy" />
            <NotFound default />
          </Router>
        </Layout>
      </AppContext>
    </div>
  )
}

export default App
