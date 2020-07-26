import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"

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
const Button = styled.button`
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 200ms ease;
  &:hover {
    border: none;
    background: var(--main);
    color: var(--background);
  }
`
const Span = styled.span`
  padding: 0.875rem 1rem;
  display: block;
  border: none;
  background: var(--main);
  color: var(--background);
`
const PlainSpan = styled.span`
  padding: 0.875rem 1rem;
  display: block;
`

interface Props {
  currentPage: number
  lastPage: number
  setPage: (N: number) => void
}

const PageControls = (props: Props) => {
  const { currentPage, lastPage, setPage } = props

  if (lastPage === 1) {
    return null
  }

  const hasPreviousPage = currentPage > 0
  const hasNextPage = lastPage > currentPage + 1
  const shouldTruncateBeginning = currentPage >= 4
  const shouldTruncateEnd = lastPage - currentPage - 1 > 3
  const shouldShowFirst = currentPage >= 3
  const shouldShowLast = lastPage - currentPage - 1 > 2

  // left side of current
  let left = new Array(currentPage).fill(null).map((_, index) => index + 1)
  if (left.length > 2) {
    left = left.slice(left.length - 2, left.length)
  }
  // right side of current
  let right = new Array(lastPage - currentPage - 1).fill(null).map((_, index) => index + currentPage + 2)

  if (right.length > 2) {
    right = right.slice(0, 2)
  }

  return (
    <PageCollection>
      {hasPreviousPage && (
        <Page>
          <Button onClick={() => setPage(currentPage - 1)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
        </Page>
      )}
      {shouldShowFirst && (
        <Page>
          <Button onClick={() => setPage(0)}>1</Button>
        </Page>
      )}
      {shouldTruncateBeginning && (
        <Page>
          <PlainSpan>...</PlainSpan>
        </Page>
      )}
      {left.map((p, index) => (
        <Page key={index}>
          <Button onClick={() => setPage(p - 1)}>{p}</Button>
        </Page>
      ))}
      <Page>
        <Span>{currentPage + 1}</Span>
      </Page>
      {right.map((p, index) => (
        <Page key={index}>
          <Button onClick={() => setPage(p - 1)}>{p}</Button>
        </Page>
      ))}
      {shouldTruncateEnd && (
        <Page>
          <PlainSpan>...</PlainSpan>
        </Page>
      )}
      {shouldShowLast && (
        <Page>
          <Button onClick={() => setPage(lastPage - 1)}>{lastPage}</Button>
        </Page>
      )}
      {hasNextPage && (
        <Page>
          <Button onClick={() => setPage(currentPage + 1)}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </Page>
      )}
    </PageCollection>
  )
}

export default PageControls
