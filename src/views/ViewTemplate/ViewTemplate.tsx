import React, { useEffect } from "react"
import { graphql, Link } from "gatsby"
import { RawDraftContentState } from "draft-js"
import styled from "styled-components"
import SEO from "../../components/SEO"
import { useMetaData } from "../../context/MetaData"
import Layout from "../../components/Layout"

const Wrapper = styled.section`
  max-width: 900px;
  margin: 0 auto;
`
const Letter = styled.section`
  border: 1px solid var(--accent);
  padding: 1rem 2rem;
  font-family: var(--formalFont);
  margin-bottom: 2rem;
`
const TagCollection = styled.ul`
  margin: 1rem 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
`
const Tag = styled.li`
  background: var(--main);
  padding: 1rem;
  color: var(--background);
  text-align: center;
`
const CallToAction = styled(Link)`
  padding: 1rem;
  display: block;
  color: var(--text);
  text-decoration: none;
  border: 4px solid var(--main);
  margin: 1rem 0;
  text-transform: lowercase;
  text-align: center;
  transition: all 200ms ease;
  &:hover {
    color: var(--background);
    background: var(--main);
  }
`

interface Props {
  pageContext: {
    templateId: string
  }
  data: {
    vysapi: {
      getTemplateById: {
        id: string
        title: string
        tags: string
        content: RawDraftContentState
      }
    }
  }
}

const ViewTemplate = (props: Props) => {
  const { data } = props
  const MetaData = useMetaData()

  /**
   * set the title
   */
  if (MetaData && MetaData.safeSetTitle) {
    MetaData.safeSetTitle(data.vysapi.getTemplateById.title)
  }

  return (
    <Layout>
      <SEO description={data.vysapi.getTemplateById.content.blocks[0].text} title={data.vysapi.getTemplateById.title} />
      <Wrapper>
        <h1>{data.vysapi.getTemplateById.title}</h1>
        <TagCollection>
          {data.vysapi.getTemplateById.tags.split(" ").map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagCollection>
        <CallToAction to={`/write/${data.vysapi.getTemplateById.id}`}>Use this letter</CallToAction>
        <Letter>
          {data.vysapi.getTemplateById.content.blocks.map(block => (
            <p key={block.key}>{block.text}</p>
          ))}
        </Letter>
      </Wrapper>
    </Layout>
  )
}

export const query = graphql`
  query ViewTemplateQuery($templateId: String!) {
    vysapi {
      getTemplateById(id: $templateId) {
        id
        title
        tags
        content
      }
    }
  }
`

export default ViewTemplate
