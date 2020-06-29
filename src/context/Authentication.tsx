import React from "react"
import { gql, ExecutionResult } from "apollo-boost"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { GQL } from "../types"

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
  userData: GQL.MeData | undefined
  login: (email: string, password: string) => Promise<ExecutionResult<GQL.SigninData>>
  logout: () => Promise<ExecutionResult<GQL.SignoutData>>
  register: (email: string, password: string) => Promise<ExecutionResult<GQL.SignupData>>
  requestPasswordReset: (email: string) => Promise<ExecutionResult<GQL.RequestResetData>>
  changePassword: (
    resetToken: string,
    password: string,
    confirmPassword: string,
  ) => Promise<ExecutionResult<GQL.ResetPasswordData>>
}

interface Props {}

const AuthenticationContext = React.createContext<AuthenticationContextInterface | null>(null)

function AuthenticationProvider(props: Props) {
  // TODO Type out the functions and their return values
  const { data, loading, error } = useQuery<GQL.MeData, GQL.MeVars>(ME)
  const [signin] = useMutation<GQL.SigninData, GQL.SigninVars>(SIGNIN)
  const [signup] = useMutation<GQL.SignupData, GQL.SignupVars>(SIGNUP)
  const [signout] = useMutation<GQL.SignoutData, GQL.SignoutVars>(SIGNOUT)
  const [requestReset] = useMutation<GQL.RequestResetData, GQL.RequestResetVars>(REQUEST_RESET)
  const [resetPassword] = useMutation<GQL.ResetPasswordData, GQL.ResetPasswordVars>(RESET_PASSWORD)

  const login = (email: string, password: string) => {
    return signin({ variables: { email, password } })
  }
  const logout = () => {
    return signout({ refetchQueries: [{ query: ME }] })
  }
  const register = (email: string, password: string) => {
    return signup({ variables: { email, password }, refetchQueries: [{ query: ME }] })
  }
  const requestPasswordReset = (email: string) => {
    return requestReset({ variables: { email } })
  }
  const changePassword = (resetToken: string, password: string, confirmPassword: string) => {
    return resetPassword({ variables: { resetToken, password, confirmPassword }, refetchQueries: [{ query: ME }] })
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
