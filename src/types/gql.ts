import { RawDraftContentState } from "draft-js"

export namespace GQL {
  /**
   * error
   */
  export interface GQLError extends Error {
    graphQLErrors: Error[]
  }
  /**
   * Inputs
   */
  export interface TemplateSearchInput {
    title?: string
    tags?: string[]
  }

  export interface TemplateInput {
    title: string
    tags: string[]
    content: RawDraftContentState
    isSearchable: boolean
  }

  export interface LetterInput {
    toName: string
    toAddressLine1: string
    toAddressLine2: string
    toAddressCity: string
    toAddressState: string
    toAddressZip: string
    fromName: string
    fromAddressLine1: string
    fromAddressLine2: string
    fromAddressCity: string
    fromAddressState: string
    fromAddressZip: string
    content: RawDraftContentState
  }

  export interface AddressInput {
    fromName: string
    fromAddressLine1: string
    fromAddressCity: string
    fromAddressState: string
    fromAddressZip: string
  }

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
    content: RawDraftContentState
    user?: User
    isSearchable: boolean
    createdAt: string
    updatedAt: string
  }

  export interface PaginatedTemplates {
    nodes: Template[]
    meta: PaginatedTemplatesMeta
  }

  export interface PaginatedTemplatesMeta {
    nodeCount: number
    pageCount: number
    pageCurrent: number
    nodesPerPage: number
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
    content: RawDraftContentState
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

  // SignIn
  export interface SigninData {
    signin: User
  }
  export interface SigninVars {
    email: string
    password: string
  }

  // Signout
  export interface SignoutData {
    signout: SuccessMessage
  }
  export interface SignoutVars {}

  // Signup
  export interface SignupData {
    signup: User
  }
  export interface SignupVars {
    email: string
    password: string
  }

  // RequestReset
  export interface RequestResetData {
    requestReset: SuccessMessage
  }
  export interface RequestResetVars {
    email: string
  }

  // ResetPassword
  export interface ResetPasswordData {
    resetPassword: User
  }
  export interface ResetPasswordVars {
    resetToken: string
    password: string
    confirmPassword: string
  }

  // createLetter(letter: LetterInput): Letter!
  export interface CreateLetterVars {
    letter: LetterInput
  }

  export interface CreateLetterData {
    createLetter: Letter
  }

  // updateLetter(letterId: String!, from: AddressInput, content: Json): Letter!
  export interface UpdateLetterVars {
    letterId: string
    from?: AddressInput
    content?: RawDraftContentState
  }
  export interface UpdateLetterData {
    updateLetter: Letter
  }

  // mailLetter(letterId: String!, stripeId: String!): Mail!
  export interface MailLetterVars {
    letterId: string
    stripeId: string
  }
  export interface MailLetterData {
    mailLetter: Mail
  }

  // CreateTemplate
  export interface CreateTemplateData {
    createTemplate: Template
  }
  export interface CreateTemplateVars {
    template: TemplateInput
  }

  // UpdateTemplate
  export interface UpdateTemplateData {
    updateTemplate: Template
  }
  export interface UpdateTemplateVars {
    template: TemplateInput
    id: string
  }

  // Increment template use
  export interface IncrementTemplateUseData {
    incrementTemplateUse: Template
  }
  export interface IncrementTemplateUseVars {
    id: string
  }
  /**
   * Queries
   */

  // Me
  export interface MeData {
    me: User
  }
  export interface MeVars {}

  // GetDraftLetters
  export interface GetDraftLettersData {
    getDraftLetters: Letter[]
  }
  export interface GetDraftLettersVars {}

  // GetLetterById
  export interface GetLetterByIdData {
    getLetterById: Letter
  }
  export interface GetLetterByIdVars {
    id: string
  }

  // GetSentLetters
  export interface GetSentLettersData {
    getSentLetters: Letter[]
  }
  export interface GetSentLettersVars {}

  // GetTemplateById
  export interface GetTemplateByIdData {
    getTemplateById: Template
  }
  export interface GetTemplateByIdVars {
    id: string
  }

  // GetAddressById
  export interface GetAddressByIdData {
    getAddressById: Address
  }
  export interface GetAddressByIdVars {
    id: string
  }

  // GetUsersTemplates
  export interface GetUsersTemplatesData {
    getUsersTemplates: Template[]
  }
  export interface GetUsersTemplatesVars {}

  // Search Templates
  export interface SearchTemplatesData {
    templates: PaginatedTemplates
  }
  export interface SearchTemplatesVars {
    text: string
    page: number
  }
}
