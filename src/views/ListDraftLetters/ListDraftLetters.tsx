import React, { useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import styled from "styled-components"
import { useMetaData } from "../../context/MetaData"
import { useAnalytics } from "../../context/Analytics"
import ErrorMessage from "../../components/ErrorMessage"
import { useUser } from "../../context/UserContext"
import AuthenticationForms from "../../components/AuthenticationForms"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { GQL } from "../../types"
import { format } from "date-fns"
import { PrimaryButton, PrimaryLink } from "../../components/elements"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`
const DraftWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  margin: 0 0 2rem;
`
const DraftDetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  & h3 {
    margin: 0.6rem 0;
  }
`
const LetterPreview = styled.div`
  border: 1px solid var(--accent);
  padding: 1rem;
  max-height: 150px;
  overflow-x: scroll;
  transform: scale(0.75);
`

/**
 * Graph QL
 */
const GET_DRAFT_LETTERS = gql`
  query GetDraftLetters {
    getDraftLetters {
      id
      content
      updatedAt
      toAddress {
        hash
        name
        line1
        line2
        city
        state
        zip
      }
    }
  }
`

const ListDraftLetters = (props: RouteComponentProps) => {
  const [localError, setLocalError] = useState<Error | undefined>(undefined)
  const MetaData = useMetaData()
  const analytics = useAnalytics()
  const user = useUser()
  const { data, loading, error } = useQuery<GQL.GetDraftLettersData, GQL.GetDraftLettersVars>(GET_DRAFT_LETTERS)

  /**
   * set the title
   */
  useEffect(() => {
    MetaData?.safeSetTitle("Drafts")
  }, [MetaData])

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  /**
   * Clear error after some time
   */
  useEffect(() => {
    let timeoutId: number
    if (localError) {
      timeoutId = setTimeout(() => setLocalError(undefined), 10000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [localError])

  // TODO: Maybe change this to be an actual dialog like it wants to be
  if (!user) {
    return (
      <AuthenticationForms
        close={() => {
          return
        }}
        isOpen={true}
      />
    )
  }

  console.log({ data, error })

  return (
    <Wrapper>
      <h2>Letter Drafts</h2>
      <ErrorMessage error={error || localError} />
      <div>
        {data?.getDraftLetters.map(draft => (
          <DraftWrapper key={draft.id}>
            <div>
              <p>{format(new Date(draft.updatedAt), "MM/dd/yy hh:mm:ss a")}</p>
              <PrimaryLink to={`/write/draft/${draft.id}`}>Edit</PrimaryLink>
            </div>
            <DraftDetailsWrapper>
              <div>
                <h3>To: {draft.toAddress.name}</h3>
                <address>
                  {draft.toAddress.line1}
                  {draft.toAddress.line1 && <br />}
                  {draft.toAddress.line2}
                  {draft.toAddress.line2 && <br />}
                  {draft.toAddress.city}, {draft.toAddress.state} {draft.toAddress.zip}
                  <br />
                </address>
              </div>
              <LetterPreview>
                {draft.content.blocks.map(paragraph => (
                  <p key={paragraph.key}>{paragraph.text}</p>
                ))}
              </LetterPreview>
            </DraftDetailsWrapper>
          </DraftWrapper>
        ))}
      </div>
    </Wrapper>
  )
}

export default ListDraftLetters
