import React, { FunctionComponent } from "react"
import { ThemeProvider } from "styled-components"

export const VoiceYourStanceThemeProvider: FunctionComponent = ({ children }) => {
  const colors = {
    blue: "rgb(52, 64, 81)",
    darkBlue: "rgb(39, 49, 63)",
    gold: "rgb(169, 136, 96)",
    red: "rgb(226, 0, 32)",
    white: "rgb(255, 255, 255)",
    black: "rgb(50, 58, 69)",
  }
  const theme = {
    main: colors.blue,
    main_dark: colors.darkBlue,
    accent: colors.gold,
    error: colors.red,
    background: colors.white,
    text: colors.black,
    formalFont: `"Playfair Display", Cambria, Cochin, Georgia, Times, "Times New Roman", serif`,
    informalFont: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
    "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
