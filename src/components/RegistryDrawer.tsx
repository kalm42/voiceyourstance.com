import React, { useCallback, useRef, useEffect } from "react"
import styled from "styled-components"
import CloseButton from "./CloseButton"
import { TextInput, PrimaryInputSubmit } from "./elements"

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
  const ref = useRef<HTMLDivElement>(null)

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
          <TextInput placeholder="Search" type="text" name="search" id="search" style={{ flex: 1 }} />
          <PrimaryInputSubmit type="button" value="Search" />
        </SearchForm>
        <p>
          <small>Showing 10 of 300 results</small>
        </p>
      </div>
      <ResultsCollection>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
        <Result>
          <h3>Letter Title</h3>
          <TagCollection>
            <Tag>#tag</Tag>
            <Tag>#another</Tag>
            <Tag>#one</Tag>
            <Tag>#Laborumelitexercitationestaliquaaliqua</Tag>
          </TagCollection>
          <p>Officia laborum fugiat fugiat sint aute adipisicing.</p>
        </Result>
      </ResultsCollection>
      <PageCollection>
        <Page>Previous</Page>
        <Page>1</Page>
        <Page>2</Page>
        <Page>3</Page>
        <Page>4</Page>
        <Page>...</Page>
        <Page>Next</Page>
      </PageCollection>
    </Wrapper>
  )
}

export default RegistryDrawer
