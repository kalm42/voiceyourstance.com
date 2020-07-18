import React from "react"
import { gql, ExecutionResult } from "apollo-boost"
import { useMutation } from "@apollo/react-hooks"
import { RawDraftContentState } from "draft-js"
import { GQL } from "../types"

const CREATE_LETTER = gql`
  mutation CreateLetter($letter: LetterInput!) {
    createLetter(letter: $letter) {
      id
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

  return <LetterContext.Provider value={{ saveNewLetter }} {...props} />
}

const useLetter = () => React.useContext(LetterContext)

export { LetterProvider, useLetter }
