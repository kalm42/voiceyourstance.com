import React, { FunctionComponent } from "react"
import PropTypes from "prop-types"
import { AuthenticationProvider } from "./Authentication"
import { RepresentativeProvider } from "./Representatives"
import { UserProvider } from "./UserContext"

const AppContext: FunctionComponent = ({ children }) => {
  return (
    <AuthenticationProvider>
      <UserProvider>
        <RepresentativeProvider>{children}</RepresentativeProvider>
      </UserProvider>
    </AuthenticationProvider>
  )
}

AppContext.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default AppContext
