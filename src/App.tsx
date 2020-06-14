import React from "react"
import AppContext from "./context/AppContext"
import Layout from "./common/Layout"
import Routes from "./Routes"
import { BrowserRouter } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <AppContext>
        <Layout>
          <Routes />
        </Layout>
      </AppContext>
    </BrowserRouter>
  )
}

export default App
