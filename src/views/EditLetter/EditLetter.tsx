import React, { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { RouteComponentProps } from "@reach/router"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import SEO from "../../components/SEO"
import AddressController from "../../components/AddressController"
import ErrorMessage from "../../components/ErrorMessage"

const GET_LETTER_BY_ID = gql`
  query GetLetterById($id: String!) {
    getLetter(id: $id) {
      id
      fromAddress {
        hash
        name
        line1
        line2
        city
        state
        zip
      }
      toAddress {
        hash
        name
        line1
        line2
        city
        state
        zip
      }
      content
    }
  }
`

const Wrapper = styled.div`
  padding: 0 2rem;
`

interface Props extends RouteComponentProps {
  letterId?: string
}
const EditLetter = (props: Props) => {
  const { letterId } = props
  const [isBusy, setIsBusy] = useState(false)
  const { data, loading, error } = useQuery(GET_LETTER_BY_ID, { variables: { id: letterId } })
  useQuery
  // From address details
  // content
  // sending letter
  // loading a template from registry

  // set stateful data from query
  const updateStateFromQuery = useCallback(() => {}, [])
  useEffect(() => {
    if (data) {
      updateStateFromQuery()
    }
  }, [data, updateStateFromQuery])

  if (error) {
    return (
      <Wrapper>
        <ErrorMessage error={error} />
      </Wrapper>
    )
  }

  if (loading) {
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <SEO title="Mail a letter" description="Write and mail a letter." />
      {/* <AddressController disabled={isBusy} from={} to={} /> */}
      <h1>Edit Letter Page</h1>
      <p>{letterId}</p>
    </Wrapper>
  )
}

export default EditLetter
