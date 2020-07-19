import React, { FunctionComponent } from "react"
import PropTypes from "prop-types"
import { AuthenticationProvider } from "./Authentication"
import { RepresentativeProvider } from "./Representatives"
import { UserProvider } from "./UserContext"
import ApolloContext from "./ApolloContext"
import { AnalyticsProvider } from "./Analytics"
import { MetaDataProvider } from "./MetaData"
import { LetterProvider } from "./LetterContext"
import { TemplateProvider } from "./TemplateContext"

const AppContext: FunctionComponent = ({ children }) => {
  return (
    <AnalyticsProvider>
      <ApolloContext>
        <AuthenticationProvider>
          <UserProvider>
            <MetaDataProvider>
              <LetterProvider>
                <TemplateProvider>
                  <RepresentativeProvider>{children}</RepresentativeProvider>
                </TemplateProvider>
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
