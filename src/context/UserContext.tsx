import React from "react"
import { useAuthentication } from "./Authentication"
import { GQL } from "../types"

interface Props {}

const UserContext = React.createContext<GQL.User | null | undefined>(null)

function UserProvider(props: Props) {
  const auth = useAuthentication()
  const user = auth?.userData

  return <UserContext.Provider value={user} {...props} />
}

const useUser = () => React.useContext(UserContext)

export { UserProvider, useUser }
