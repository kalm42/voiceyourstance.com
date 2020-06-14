import React, { FunctionComponent } from "react"
import PropTypes from "prop-types"
import { AuthenticationProvider } from "./Authentication"
import { RepresentativeProvider } from "./Representatives"
import { UserProvider } from "./UserContext"
import { VoiceYourStanceThemeProvider } from "./ThemeContext"
import ApolloContext from "./ApolloContext"
import { AnalyticsProvider } from "./Analytics"

const AppContext: FunctionComponent = ({ children }) => {
  return (
    <AnalyticsProvider>
      <VoiceYourStanceThemeProvider>
        <ApolloContext>
          <AuthenticationProvider>
            <UserProvider>
              <RepresentativeProvider>{children}</RepresentativeProvider>
            </UserProvider>
          </AuthenticationProvider>
        </ApolloContext>
      </VoiceYourStanceThemeProvider>
    </AnalyticsProvider>
  )
}

AppContext.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default AppContext
