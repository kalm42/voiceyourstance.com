import React, { useCallback, useRef, useEffect, useState } from "react"
import styled from "styled-components"
import CloseButton from "../CloseButton"
import { TextInput, PrimaryInputSubmit } from "../elements"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { GQL } from "../../types"
import ErrorMessage from "../ErrorMessage"
import PageControls from "./PageControls"

const SEARCH_TEMPLATES = gql`
  query SearchTemplates($text: String!, $page: Int!) {
    templates(text: $text, page: $page) {
      nodes {
        id
        tags
        title
        content
      }
      meta {
        nodeCount
        pageCount
        pageCurrent
      }
    }
  }
`

interface WrapperProps {
  registry: boolean
}
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${(props: WrapperProps) => (props.registry ? "0" : "calc((90vw + 2rem) * -1)")};
  background: var(--background);
  bottom: 0;
  width: 90vw;
  z-index: 10;
  border-left: 1px solid var(--accent);
  padding: 1rem;
  transition: all 300ms ease-in;
  overflow: scroll;
`
const TitleBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 3rem;
`
const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
`
const ResultsCollection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 2rem;
  padding: 1rem 0;
`
const Result = styled.div`
  background: var(--main);
  color: var(--background);
  padding: 1rem;
`
const TagCollection = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
`
const Tag = styled.li`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 1rem;
  background: var(--mainDark);
  margin: 0.5rem;
`
const PageCollection = styled.ul`
  padding: 1rem;
  margin: 0;
  list-style: none;
  display: flex;
  justify-content: center;
`
const Page = styled.li`
  padding: 0.5rem;
`
interface Props {
  isOpen: boolean
  close: () => void
}
const RegistryDrawer = (props: Props) => {
  const { isOpen, close } = props
  const [text, setText] = useState("")
  const [page, setPage] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useQuery<GQL.SearchTemplatesData, GQL.SearchTemplatesVars>(SEARCH_TEMPLATES, {
    variables: { text, page },
  })

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!ref.current || !event.target) return

      if (ref.current.contains(event.target as Node)) {
        return
      } else {
        props.close()
      }
    },
    [props],
  )

  /**
   * Handle click outside close
   */
  useEffect(() => {
    document.addEventListener("mousedown", handleClick, false)
    return () => {
      document.removeEventListener("mousedown", handleClick, false)
    }
  }, [handleClick])

  return (
    <Wrapper registry={isOpen} ref={ref}>
      <TitleBar>
        <h2>The Registry</h2>
        <CloseButton handleClick={close} />
      </TitleBar>
      <div>
        <SearchForm method="post">
          <TextInput
            placeholder="Search"
            type="text"
            name="search"
            id="search"
            style={{ flex: 1 }}
            value={text}
            onChange={event => setText(event.target.value)}
          />
          <PrimaryInputSubmit type="button" value="Search" />
        </SearchForm>
        <p>
          <small>
            Showing {data?.templates.nodes.length} of {data?.templates.meta.nodeCount} results
          </small>
        </p>
      </div>
      <ResultsCollection>
        <ErrorMessage error={error} />
        {data?.templates.nodes.map(result => (
          <Result key={result.id}>
            <h3>{result.title}</h3>
            <TagCollection>
              {result.tags.split(" ").map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagCollection>
            <p>{result.content.blocks[0].text}</p>
          </Result>
        ))}
      </ResultsCollection>
      {data?.templates.meta && (
        <PageControls
          currentPage={data.templates.meta.pageCurrent}
          lastPage={data.templates.meta.pageCount}
          setPage={setPage}
        />
      )}
    </Wrapper>
  )
}

export default RegistryDrawer
