import React from "react"
import { gql, ExecutionResult } from "apollo-boost"
import { useMutation, useQuery } from "@apollo/react-hooks"
import { QueryResult } from "@apollo/react-common"
import { RawDraftContentState } from "draft-js"
import { GQL } from "../types"

const CREATE_LETTER = gql`
  mutation CreateLetter($letter: LetterInput!) {
    createLetter(letter: $letter) {
      id
    }
  }
`

const GET_DRAFT_LETTERS = gql`
  query GetDraftLetters {
    getDraftLetters {
      id
      toAddress {
        id
        name
        line1
        line2
        city
        state
        zip
      }
      content
      updatedAt
    }
  }
`

interface AddressInput {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
}

interface LetterContextInterface {
  saveNewLetter: (
    from: AddressInput,
    to: AddressInput,
    content: RawDraftContentState,
  ) => Promise<ExecutionResult<GQL.CreateLetterData>>
  getMyDrafts: () => QueryResult<GQL.GetDraftLettersData, GQL.GetDraftLettersVars>
}

const LetterContext = React.createContext<LetterContextInterface | null>(null)

interface Props {}

function LetterProvider(props: Props) {
  const [createLetter] = useMutation<GQL.CreateLetterData, GQL.CreateLetterVars>(CREATE_LETTER)

  const saveNewLetter = (from: AddressInput, to: AddressInput, content: RawDraftContentState) => {
    return createLetter({
      variables: {
        letter: {
          fromName: from.name,
          fromAddressLine1: from.line1,
          fromAddressLine2: "",
          fromAddressCity: from.city,
          fromAddressState: from.state,
          fromAddressZip: from.zip,
          toName: to.name,
          toAddressLine1: to.line1,
          toAddressLine2: to.line2 || "",
          toAddressCity: to.city,
          toAddressState: to.state,
          toAddressZip: to.zip,
          content: content,
        },
      },
    })
  }

  const getMyDrafts = () => {
    return useQuery<GQL.GetDraftLettersData, GQL.GetDraftLettersVars>(GET_DRAFT_LETTERS)
  }

  return <LetterContext.Provider value={{ saveNewLetter, getMyDrafts }} {...props} />
}

const useLetter = () => React.useContext(LetterContext)

export { LetterProvider, useLetter }
