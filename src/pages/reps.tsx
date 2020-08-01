import React from "react"
import Layout from "../components/Layout"
import { Router } from "@reach/router"
import ListRepresentatives from "../views/ListRepresentatives"
import RepresentativeDetails from "../views/RepresentativeDetails"
import WriteLetter from "../views/WriteLetter"

const Representatives = () => {
  return (
    <Layout>
      <Router basepath="/reps">
        <ListRepresentatives path="/" />
        <RepresentativeDetails path="/:repid" />
        <WriteLetter path="/:repid/write/:addressid" />
      </Router>
    </Layout>
  )
}

export default Representatives
