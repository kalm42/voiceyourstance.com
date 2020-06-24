import React from "react"
import AppContext from "./src/context/AppContext"

export const wrapRootElement = ({ element }) => <AppContext>{element}</AppContext>
