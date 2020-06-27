import React from "react"
import { gql, ExecutionResult } from "apollo-boost"
import { useMutation, useQuery } from "@apollo/react-hooks"

const SIGNIN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
    }
  }
`
const SIGNOUT = gql`
  mutation SignOut {
    signout {
      message
    }
  }
`
const SIGNUP = gql`
  mutation SignUp($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      id
    }
  }
`
const REQUEST_RESET = gql`
  mutation RequestReset($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`
const RESET_PASSWORD = gql`
  mutation ResetPassword($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
    }
  }
`
const ME = gql`
  query Me {
    me {
      id
      email
      address {
        name
        line1
        city
        state
        zip
      }
      letters {
        id
        toAddress {
          id
          name
        }
        fromAddress {
          id
          name
        }
        content
        payment {
          id
          createdAt
        }
        mail {
          id
          expectedDeliveryDate
          createdAt
        }
        template {
          id
          title
          tags
        }
      }
      templates {
        id
        title
        tags
      }
    }
  }
`

interface AuthenticationContextInterface {
  userData: UserData | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string) => void
  requestPasswordReset: (email: string) => Promise<ExecutionResult<any>>
  changePassword: (resetToken: string, password: string, confirmPassword: string) => void
}

export interface UserData {
  name: string
}

interface Props {}

const AuthenticationContext = React.createContext<AuthenticationContextInterface | null>(null)

function AuthenticationProvider(props: Props) {
  // TODO Type out the functions and their return values
  const { data, loading, error } = useQuery(ME)
  const [signin] = useMutation(SIGNIN)
  const [signup] = useMutation(SIGNUP)
  const [signout] = useMutation(SIGNOUT)
  const [requestReset] = useMutation(REQUEST_RESET)
  const [resetPassword] = useMutation(RESET_PASSWORD)

  const login = async (email: string, password: string) => {
    const data = await signin({ variables: { email, password } })
    console.log("Signin: ", data)
  }
  const logout = () => {
    signout({ refetchQueries: [{ query: ME }] })
  }
  const register = (email: string, password: string) => {
    signup({ variables: { email, password }, refetchQueries: [{ query: ME }] })
  }
  const requestPasswordReset = (email: string) => {
    return requestReset({ variables: { email } })
  }
  const changePassword = (resetToken: string, password: string, confirmPassword: string) => {
    resetPassword({ variables: { resetToken, password, confirmPassword }, refetchQueries: [{ query: ME }] })
  }
  return (
    <AuthenticationContext.Provider
      value={{ userData: data, login, logout, register, requestPasswordReset, changePassword }}
      {...props}
    />
  )
}

const useAuthentication = () => React.useContext(AuthenticationContext)

export { AuthenticationProvider, useAuthentication }
