import React from "react"
import { useAuthentication, UserData } from "./Authentication"

interface Props {}

const UserContext = React.createContext<UserData | null | undefined>(null)

function UserProvider(props: Props) {
  const auth = useAuthentication()
  const user = auth?.userData

  return <UserContext.Provider value={user} {...props} />
}

function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`)
  }
  return context
}

export { UserProvider, useUser }
