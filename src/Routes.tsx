import React from "react"
import { Route, Switch } from "react-router-dom"
import Location from "./pages/Location"
import Representatives from "./pages/Representatives"
import Representative from "./pages/Representative"
import NotFound from "./pages/NotFound"
import Write from "./pages/Write"
import ContactUs from "./pages/ContactUs"
import PrivacyPolicy from "./pages/PrivacyPolicy"

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Location />
      </Route>
      <Route path="/reps/:repId/write/:addrId" exact>
        <Write />
      </Route>
      <Route path="/reps/:repId" exact>
        <Representative />
      </Route>
      <Route path="/reps">
        <Representatives />
      </Route>
      <Route path="/contact-us">
        <ContactUs />
      </Route>
      <Route path="/privacy-policy">
        <PrivacyPolicy />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}

export default Routes
