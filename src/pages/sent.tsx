import React, { useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import styled from "styled-components"
import { useMetaData } from "../context/MetaData"
import { useAnalytics } from "../context/Analytics"
import ErrorMessage from "../components/ErrorMessage"
import { useUser } from "../context/UserContext"
import AuthenticationForms from "../components/AuthenticationForms"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { GQL } from "../types"
import { format } from "date-fns"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`
const DraftWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  margin: 0 0 2rem;
  & h3 {
    margin: 0.6rem 0;
  }
`
const DraftDetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
const GET_SENT_LETTERS = gql`
  query GetSentLetters {
    getSentLetters {
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
      mail {
        id
        expectedDeliveryDate
        createdAt
      }
    }
  }
`

const SentLetters = (props: RouteComponentProps) => {
  const [localError, setLocalError] = useState<Error | undefined>(undefined)
  const MetaData = useMetaData()
  const analytics = useAnalytics()
  const user = useUser()
  const { data, loading, error } = useQuery<GQL.GetSentLettersData, GQL.GetSentLettersVars>(GET_SENT_LETTERS)

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

  const hasSentLetters = !!data?.getSentLetters.length

  return (
    <Layout>
      <SEO description="See a list of all the letters you have sent." title="Your sent letters" />
      <Wrapper>
        <h2>Sent Letters</h2>
        <ErrorMessage error={error || localError} />
        <div>
          {!hasSentLetters && <p>You have not sent a letter yet.</p>}
          {data?.getSentLetters.map(sent => (
            <DraftWrapper key={sent.id}>
              <div>
                <h3>Expected Delivery Date:</h3>
                <p>{format(new Date(sent.mail.expectedDeliveryDate), "MM/dd/yy hh:mm:ss a")}</p>
              </div>
              <DraftDetailsWrapper>
                <div>
                  <h3>To: {sent.toAddress.name}</h3>
                  <address>
                    {sent.toAddress.line1}
                    {sent.toAddress.line1 && <br />}
                    {sent.toAddress.line2}
                    {sent.toAddress.line2 && <br />}
                    {sent.toAddress.city}, {sent.toAddress.state} {sent.toAddress.zip}
                    <br />
                  </address>
                </div>
                <LetterPreview>
                  {sent.content.blocks.map(paragraph => (
                    <p key={paragraph.key}>{paragraph.text}</p>
                  ))}
                </LetterPreview>
              </DraftDetailsWrapper>
            </DraftWrapper>
          ))}
        </div>
      </Wrapper>
    </Layout>
  )
}

export default SentLetters
