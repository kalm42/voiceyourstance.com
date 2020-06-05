import React, { FunctionComponent } from "react"
import PropTypes from "prop-types"
import { AuthenticationProvider } from "./Authentication"
import { RepresentativeProvider } from "./Representatives"
import { UserProvider } from "./UserContext"
import { VoiceYourStanceThemeProvider } from "./ThemeContext"

const AppContext: FunctionComponent = ({ children }) => {
  return (
    <VoiceYourStanceThemeProvider>
      <AuthenticationProvider>
        <UserProvider>
          <RepresentativeProvider>{children}</RepresentativeProvider>
        </UserProvider>
      </AuthenticationProvider>
    </VoiceYourStanceThemeProvider>
  )
}

AppContext.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default AppContext
