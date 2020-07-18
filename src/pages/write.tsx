import React from "react"
import Layout from "../components/Layout"
import { Router } from "@reach/router"
import EditLetter from "../views/EditLetter"
import WriteTemplate from "../views/WriteTemplate"
import SharedLetter from "../views/SharedLetter"
import BlankLetter from "../views/BlankLetter"
import NotFound from "../views/NotFound"
import ListDraftLetters from "../views/ListDraftLetters"

const WritePage = () => {
  return (
    <Layout>
      <Router basepath="/write">
        <ListDraftLetters path="/draft" />
        <EditLetter path="/draft/:letterId" />
        <WriteTemplate path="/:templateId" />
        <SharedLetter path="/:templateId/:toId" />
        <BlankLetter path="/" />
        <NotFound default />
      </Router>
    </Layout>
  )
}

export default WritePage
