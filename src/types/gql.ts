export namespace GQL {
  /**
   * Data models
   */
  export interface SuccessMessage {
    message: string
  }

  export interface Template {
    id: string
    title: string
    tags: string
    content: object
    user?: User
    createdAt: string
    updatedAt: string
  }

  export interface Address {
    id: string
    hash: string
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    createdAt: string
    updatedAt: string
  }

  export interface Payment {
    id: string
    stripeId: string
    letter: Letter
    createdAt: string
    updatedAt: string
  }

  export interface Mail {
    id: string
    lobId: string
    letter: Letter
    expectedDeliveryDate: string
    createdAt: string
    updatedAt: string
  }

  export interface Letter {
    id: string
    fromAddress: Address
    toAddress: Address
    content: object
    payment?: Payment
    mail?: Mail
    user?: User
    createdAt: string
    updatedAt: string
  }

  export interface User {
    id: string
    email: string
    letters?: Letter[]
    templates?: Template[]
    createdAt: string
    updatedAt: string
  }

  /**
   * Mutations
   */
  export interface SigninData {
    signin: User
  }

  export interface SigninVars {
    email: string
    password: string
  }

  export interface SignoutData {
    signout: SuccessMessage
  }

  export interface SignoutVars {}

  export interface SignupData {
    signup: User
  }

  export interface SignupVars {
    email: string
    password: string
  }

  export interface RequestResetData {
    requestReset: SuccessMessage
  }

  export interface RequestResetVars {
    email: string
  }

  export interface ResetPasswordData {
    resetPassword: User
  }

  export interface ResetPasswordVars {
    resetToken: string
    password: string
    confirmPassword: string
  }

  /**
   * Queries
   */
  export interface MeData {
    me: User
  }

  export interface MeVars {}
}
