import styled from "styled-components"

export const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`
export const AddressDetails = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 1rem;
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`
export const From = styled.div`
  display: grid;
  grid-gap: 1rem;
`
export const EditorWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.accent};
  margin: 2rem 0;
  padding: 1rem;
  font-family: ${(props) => props.theme.formalFont};
`
interface PageWrapperProps {
  pay: boolean
}
export const PageWrapper = styled.div`
  transition: all 200ms ease;
  ${(props: PageWrapperProps) => {
    if (props.pay) {
      return `
        filter: blur(5px) grayscale(50%);
        transform: scale(0.9);
      `
    }
  }}
`
