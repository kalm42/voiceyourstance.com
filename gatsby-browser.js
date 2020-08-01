import React from "react"
import AppContext from "./src/context/AppContext"
import "./src/global.css"

export const wrapRootElement = ({ element }) => <AppContext>{element}</AppContext>
