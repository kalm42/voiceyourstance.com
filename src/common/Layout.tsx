import React, { FunctionComponent, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faEllipsisV, faEnvelope, faTimes, faCaretRight } from "@fortawesome/free-solid-svg-icons"
import { faFacebookF, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { Link } from "@reach/router"
import styled from "styled-components"

const Title = styled.h1`
  padding: 0;
  margin: 0;
  text-transform: uppercase;
  font-size: 1rem;
  font-variation-settings: "wght" 400;
`
const Header = styled.header`
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  padding: 20px;
  align-items: center;
  justify-items: center;
`
const MenuButton = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
  height: 20px !important;
  width: 20px !important;
`
const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`
const Menu = styled.ul`
  align-items: center;
  display: grid;
  height: 90vh;
  list-style: none;
  margin: 0 auto;
  padding: 0 40px;
  max-width: 500px;
`
const MenuItem = styled(Link)`
  display: block;
  padding: 2rem 1rem;
  text-decoration: none;
  transition: all 200ms ease;
  color: ${(props) => props.theme.text};
  &:hover {
    background: ${(props) => props.theme.accent};
    color: ${(props) => props.theme.background};
  }
`
interface NavProps {
  open: boolean
}

const Nav = styled.nav`
  display: ${(props: NavProps) => (props.open ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  padding: 20px;
`
const Main = styled.main`
  min-height: calc(100vh - 300px);
`
const Footer = styled.footer`
  background: ${(props) => props.theme.main};
  margin-bottom: -16px;
`
const FooterTitle = styled.h1`
  color: white;
  border-bottom: 1px solid ${(props) => props.theme.accent};
  margin: 0;
  padding: 20px 0;
  font-variation-settings: "wght" 400;
`
const FooterGroup = styled.div`
  display: grid;
  justify-items: center;
`
const FooterNav = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`
const FooterSocial = styled.div`
  background: ${(props) => props.theme.main_dark};
  padding: 1rem;
  display: grid;
  justify-items: center;
`
const SocialNav = styled.ul`
  display: grid;
  list-style: none;
  padding: 0;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2rem;
`
const FooterNavLinks = styled(Link)`
  color: ${(props) => props.theme.background};
  text-decoration: none;
  text-transform: lowercase;
  font-size: 1rem;
  font-family: ${(props) => props.theme.formalFont};
`
const FacebookLink = styled.a`
  color: ${(props) => props.theme.background};
  &:hover {
    color: #3b5998;
  }
`
const TwitterLink = styled.a`
  color: ${(props) => props.theme.background};
  &:hover {
    color: #00acee;
  }
`
const EmailLink = styled.a`
  color: ${(props) => props.theme.background};
  &:hover {
    color: #0072c6;
  }
`
const GoldIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
  transition: all 200ms ease;
  ${MenuItem}:hover & {
    color: ${(props) => props.theme.background};
  }
`

const Layout: FunctionComponent = ({ children }) => {
  const [open, setOpen] = useState(false)

  const handleMenuClick = () => {
    setOpen(!open)
  }

  return (
    <div>
      <Header>
        <Button onClick={handleMenuClick} style={{ justifySelf: "start" }}>
          <MenuButton icon={faBars} />
        </Button>
        <Title>Home</Title>
        <Button style={{ justifySelf: "end" }}>
          <MenuButton icon={faEllipsisV} />
        </Button>
        <Nav open={open}>
          <Button onClick={handleMenuClick}>
            <MenuButton icon={faTimes} />
          </Button>
          <Menu>
            <li>
              <MenuItem to="/" onClick={handleMenuClick}>
                Location <GoldIcon icon={faCaretRight} />
              </MenuItem>
            </li>
            <li>
              <MenuItem to="/reps" onClick={handleMenuClick}>
                Your Representatives <GoldIcon icon={faCaretRight} />
              </MenuItem>
            </li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </Menu>
        </Nav>
      </Header>
      <Main>{children}</Main>
      <Footer>
        <FooterGroup>
          <FooterTitle>Voice Your Stance</FooterTitle>
          <FooterNav>
            <li>
              <FooterNavLinks to="/contact-us">Contact Us</FooterNavLinks>
            </li>
            <li>
              <FooterNavLinks to="/privacy-policy">Privacy Policy</FooterNavLinks>
            </li>
          </FooterNav>
        </FooterGroup>
        <FooterSocial>
          <SocialNav>
            <li>
              <FacebookLink href="http://facebook.com">
                <FontAwesomeIcon icon={faFacebookF} />
              </FacebookLink>
            </li>
            <li>
              <TwitterLink href="https://twitter.com">
                <FontAwesomeIcon icon={faTwitter} />
              </TwitterLink>
            </li>
            <li>
              <EmailLink href="mailto:someone@somewhere.com">
                <FontAwesomeIcon icon={faEnvelope} />
              </EmailLink>
            </li>
          </SocialNav>
        </FooterSocial>
      </Footer>
    </div>
  )
}

export default Layout
