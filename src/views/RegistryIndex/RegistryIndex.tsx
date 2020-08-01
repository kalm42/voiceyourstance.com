import React, { useEffect } from "react"
import { graphql, Link } from "gatsby"
import styled from "styled-components"
import SEO from "../../components/SEO"
import { useMetaData } from "../../context/MetaData"
import Layout from "../../components/Layout"
import { GQL } from "../../types"
import { SecondaryGatsbyLink, PrimaryGatsbyLink } from "../../components/elements"

const Wrapper = styled.section`
  max-width: 900px;
  margin: 0 auto;
`
const TagCollection = styled.ul`
  margin: 1rem 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 0.875rem;
`
const Tag = styled.li`
  background: var(--main);
  padding: 1rem;
  color: var(--background);
  text-align: center;
`
const LetterCollection = styled.ol`
  display: grid;
  grid-gap: 1rem;
`
const Letter = styled.li`
  padding: 1rem;
  border: 1px solid var(--accent);
`
const LetterWrapper = styled.div`
  padding: 1rem;
  border: 1px solid var(--accent);
`
const LinkWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`
const FullListWrapper = styled.section`
  display: grid;
  grid-gap: 1rem;
  margin-bottom: 2rem;
`

interface Props {
  data: {
    vysapi: {
      publicTemplates: GQL.Template[]
    }
  }
}

const RegistryIndex = (props: Props) => {
  const { data } = props
  const MetaData = useMetaData()

  /**
   * set the title
   */
  if (MetaData && MetaData.safeSetTitle) {
    MetaData.safeSetTitle("Top Letters")
  }

  const top10 = data.vysapi.publicTemplates.slice(0, 9)

  return (
    <Layout>
      <SEO
        description="The list of our most used letters in the letter registry. Use one of these letters as a starting point for your letter to your senator, congressmen, mayor, or any other elected representative with an address."
        title="Top Letters"
      />
      <Wrapper>
        <section>
          <h1>Top Letters</h1>
          <LetterCollection>
            {top10.map(letter => (
              <Letter>
                <h3>{letter.title}</h3>
                <TagCollection>
                  {letter.tags.split(" ").map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                  <div></div>
                </TagCollection>
                <LinkWrapper>
                  <SecondaryGatsbyLink to={`/registry/${letter.id}`}>See the full letter</SecondaryGatsbyLink>
                  <PrimaryGatsbyLink to={`/write/${letter.id}`}>Use this letter</PrimaryGatsbyLink>
                </LinkWrapper>
              </Letter>
            ))}
          </LetterCollection>
        </section>
        <section>
          <h2>Full List</h2>
          <p>See all the letters contributed by our users.</p>
          <FullListWrapper>
            {data.vysapi.publicTemplates.map(letter => (
              <LetterWrapper>
                <h3>{letter.title}</h3>
                <TagCollection>
                  {letter.tags.split(" ").map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                  <div></div>
                </TagCollection>
                <LinkWrapper>
                  <SecondaryGatsbyLink to={`/registry/${letter.id}`}>See the full letter</SecondaryGatsbyLink>
                  <PrimaryGatsbyLink to={`/write/${letter.id}`}>Use this letter</PrimaryGatsbyLink>
                </LinkWrapper>
              </LetterWrapper>
            ))}
          </FullListWrapper>
        </section>
      </Wrapper>
    </Layout>
  )
}

export const query = graphql`
  query RegistryIndexQuery {
    vysapi {
      publicTemplates {
        id
        title
        tags
      }
    }
  }
`

export default RegistryIndex
