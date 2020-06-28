import styled from "styled-components"

export const Form = styled.form`
  display: grid;
  grid-gap: 1rem;
  padding: 1rem 0;
`
export const TextInputs = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
`
export const Input = styled.input`
  font-size: 1rem;
  padding: 1rem;
  border: 1px solid var(--accent);
`
export const TextInput = styled.input`
  font-size: 1rem;
  padding: 1rem;
  border: 1px solid var(--accent);
`
export const PrimaryButton = styled.button`
  padding: 1rem;
  background: var(--main);
  color: var(--background);
  border: 0;
  font-size: 1rem;
  text-transform: lowercase;
  transition: all 200ms ease;
  &:hover {
    background: var(--mainDark);
  }
  &:active {
    transform: scale(0.9);
  }
`
export const PrimaryInputSubmit = styled.input`
  padding: 1rem;
  background: var(--main);
  color: var(--background);
  border: 0;
  font-size: 1rem;
  text-transform: lowercase;
  transition: all 200ms ease;
  &:hover {
    background: var(--mainDark);
  }
  &:active {
    transform: scale(0.9);
  }
`
export const SecondaryButton = styled.button`
  padding: 1rem;
  font-size: 1rem;
  background: white;
  border: 2px solid var(--main);
  text-transform: lowercase;
  transition: all 200ms ease;
  &:hover {
    background: var(--mainDark);
    color: var(--background);
  }
  &:active {
    transform: scale(0.9);
  }
`
