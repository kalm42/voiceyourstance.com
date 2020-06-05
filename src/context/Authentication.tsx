import React, { useState } from "react"

interface AuthenticationContextInterface {
  userData: UserData | null
  login: () => void
  logout: () => void
  register: () => void
}

export interface UserData {
  name: string
}

interface Props {}

const AuthenticationContext = React.createContext<AuthenticationContextInterface | null>(null)

function AuthenticationProvider(props: Props) {
  const [userData, setUserData] = useState<UserData | null>(null)

  // TODO: Make these real functions
  const login = () => setUserData({ name: "Bob" })
  const logout = () => setUserData(null)
  const register = () => login()
  return <AuthenticationContext.Provider value={{ userData, login, logout, register }} {...props} />
}

const useAuthentication = () => React.useContext(AuthenticationContext)

export { AuthenticationProvider, useAuthentication }
