import React, { useEffect, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import styled from "styled-components"
import { useMetaData } from "../../context/MetaData"
import { useTemplate } from "../../context/TemplateContext"
import ErrorMessage from "../../components/ErrorMessage"
import Layout from "../../components/Layout"
import SEO from "../../components/SEO"
import { format } from "date-fns"
import { PrimaryButton, SecondaryButton } from "../../components/elements"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`
const TemplateList = styled.div`
  display: grid;
  grid-gap: 1rem;
`
const TemplateWrapper = styled.div`
  border: 1px solid var(--accent);
  padding: 1rem;
`
const TemplateDate = styled.p`
  margin: 0 0 1rem;
`
const TemplatePanel = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  grid-gap: 1rem;
`
const TemplateControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const TemplateDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`
const TemplateTagsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  align-items: center;
`
const TemplateTag = styled.li`
  background: var(--main);
  padding: 1rem;
  color: var(--background);
  font-size: 0.8rem;
`
const TemplatePreview = styled.div`
  flex: 0 0 100%;
  & h4 {
    margin: 0;
  }
`

const ListTemplateLetters = (props: RouteComponentProps) => {
  const [localError, setLocalError] = useState<Error | undefined>(undefined)
  const MetaData = useMetaData()
  const template = useTemplate()

  /**
   * set the title
   */
  useEffect(() => {
    MetaData?.safeSetTitle("Registry")
  }, [MetaData])

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

  const templates = template?.getUsersTemplates()

  const hasTemplates = !!templates?.data?.getUsersTemplates?.length
  const usersTemplates = templates?.data?.getUsersTemplates
  const error = templates?.error

  return (
    <div>
      <SEO description="See a list of all the letters you have registered." title="Your registered letters" />
      <Wrapper>
        <h2>Registered letters</h2>
        <ErrorMessage error={error || localError} />
        <TemplateList>
          {!hasTemplates && <p>You have not added any letters to the registry.</p>}
          {usersTemplates &&
            usersTemplates.map(t => (
              <TemplateWrapper key={t.id}>
                <TemplateDate>
                  <small>{format(new Date(t.updatedAt), "MM/dd/yy @ hh:mm:ss a")}</small>
                </TemplateDate>
                <TemplatePanel>
                  <TemplateControls>
                    <PrimaryButton>Edit</PrimaryButton>
                    <SecondaryButton>Delete</SecondaryButton>
                  </TemplateControls>
                  <TemplateDetails>
                    <h3>{t.title}</h3>
                    <TemplateTagsList>
                      {t.tags.split(" ").map((tag, index) => (
                        <TemplateTag key={index}>{tag}</TemplateTag>
                      ))}
                    </TemplateTagsList>
                    <TemplatePreview>
                      <h4>Preview:</h4>
                      {t.content.blocks[0].text}
                    </TemplatePreview>
                  </TemplateDetails>
                </TemplatePanel>
              </TemplateWrapper>
            ))}
        </TemplateList>
      </Wrapper>
    </div>
  )
}

export default ListTemplateLetters
