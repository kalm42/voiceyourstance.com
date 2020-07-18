import React, { FunctionComponent } from "react"
import PropTypes from "prop-types"
import { AuthenticationProvider } from "./Authentication"
import { RepresentativeProvider } from "./Representatives"
import { UserProvider } from "./UserContext"
import ApolloContext from "./ApolloContext"
import { AnalyticsProvider } from "./Analytics"
import { MetaDataProvider } from "./MetaData"
import { LetterProvider } from "./LetterContext"

const AppContext: FunctionComponent = ({ children }) => {
  return (
    <AnalyticsProvider>
      <ApolloContext>
        <AuthenticationProvider>
          <UserProvider>
            <MetaDataProvider>
              <LetterProvider>
                <RepresentativeProvider>{children}</RepresentativeProvider>
              </LetterProvider>
            </MetaDataProvider>
          </UserProvider>
        </AuthenticationProvider>
      </ApolloContext>
    </AnalyticsProvider>
  )
}

AppContext.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default AppContext
