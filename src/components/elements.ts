import styled from "styled-components"
import { Link } from "@reach/router"
import { Link as GLink } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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
export const PrimaryLink = styled(Link)`
  padding: 1rem;
  background: var(--main);
  color: var(--background);
  border: 0;
  font-size: 1rem;
  text-transform: lowercase;
  transition: all 200ms ease;
  text-decoration: none;
  text-align: center;
  &:hover {
    background: var(--mainDark);
  }
  &:active {
    transform: scale(0.9);
  }
`
export const PrimaryGatsbyLink = styled(GLink)`
  padding: 1rem;
  background: var(--main);
  color: var(--background);
  border: 0;
  font-size: 1rem;
  text-transform: lowercase;
  text-decoration: none;
  text-align: center;
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
export const SecondaryGatsbyLink = styled(GLink)`
  padding: 1rem;
  font-size: 1rem;
  background: var(--background);
  border: 2px solid var(--main);
  text-transform: lowercase;
  text-decoration: none;
  text-align: center;
  color: var(--text);
  transition: all 200ms ease;
  &:hover {
    background: var(--mainDark);
    color: var(--background);
  }
  &:active {
    transform: scale(0.9);
  }
`

interface MenuProps {
  fullscreen?: boolean
}
export const Menu = styled.ul`
  align-items: center;
  display: grid;
  ${(props: MenuProps) => props.fullscreen && "height: 90vh;"}
  list-style: none;
  margin: 0 auto;
  padding: 0 40px;
  max-width: 500px;
`
export const MenuItem = styled(Link)`
  display: block;
  padding: 2rem 1rem;
  text-decoration: none;
  transition: all 200ms ease;
  color: var(--text);
  &:hover {
    background: var(--accent);
    color: var(--background);
  }
`
export const GoldIcon = styled(FontAwesomeIcon)`
  color: var(--accent);
  transition: all 200ms ease;
  ${MenuItem}:hover & {
    color: var(--background);
  }
`
export const Divider = styled.hr`
  border: 1px dashed var(--accent);
  margin: 1rem;
`
