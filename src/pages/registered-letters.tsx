import React from "react"
import Layout from "../components/Layout"
import { Router } from "@reach/router"
import EditTemplate from "../views/EditTemplate"
import NotFound from "../views/NotFound"
import ListTemplateLetters from "../views/ListTemplateLetters"

const RegisteredLetters = () => {
  return (
    <Layout>
      <Router basepath="/registered-letters">
        <EditTemplate path="/:templateId" />
        <ListTemplateLetters path="/" />
        <NotFound default />
      </Router>
    </Layout>
  )
}

export default RegisteredLetters
