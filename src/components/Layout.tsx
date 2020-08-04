import React, { FunctionComponent, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faEllipsisV, faEnvelope, faCaretRight } from "@fortawesome/free-solid-svg-icons"
import { faFacebookF, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { Link } from "gatsby"
import styled from "styled-components"
import { useMetaData } from "../context/MetaData"
import CloseButton from "./CloseButton"
import AuthenticationForms from "./AuthenticationForms"
import { useUser } from "../context/UserContext"
import { Menu, MenuItem, GoldIcon } from "./elements"
import UserMenu from "./UserMenu"

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
  height: 20px;
`
const MenuButton = styled(FontAwesomeIcon)`
  color: var(--accent);
  height: 20px !important;
  width: 20px !important;
`
const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
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
  z-index: 100;
`
const Main = styled.main`
  min-height: calc(100vh - 222px - 60px);
`
const Footer = styled.footer`
  background: var(--main);
  margin-bottom: -16px;
  height: 222px;
`
const FooterTitle = styled.h1`
  color: white;
  border-bottom: 1px solid var(--accent);
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
  background: var(--mainDark);
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
  color: var(--background);
  text-decoration: none;
  text-transform: lowercase;
  font-size: 1rem;
  font-family: var(--formalFont);
`
const FacebookLink = styled.a`
  color: var(--background);
  &:hover {
    color: #3b5998;
  }
`
const TwitterLink = styled.a`
  color: var(--background);
  &:hover {
    color: #00acee;
  }
`
const EmailLink = styled.a`
  color: var(--background);
  &:hover {
    color: #0072c6;
  }
`
interface AuthProps {
  open: boolean
}
const AuthenticationMenu = styled.div`
  position: absolute;
  top: ${(props: AuthProps) => (props.open ? "4rem" : "-130%")};
  right: 1rem;
  padding: 2rem;
  background: var(--background);
  border: 1px solid var(--accent);
  transition: all 200ms ease;
  z-index: 100;
`

const Layout: FunctionComponent = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [authIsOpen, setAuthIsOpen] = useState(false)
  const MetaData = useMetaData()
  const user = useUser()

  const t = MetaData?.title || "Home"

  const handleMenuClick = () => {
    setOpen(!open)
  }

  const closeAuth = () => setAuthIsOpen(false)
  const toggleAuthMenu = () => setAuthIsOpen(!authIsOpen)

  return (
    <div>
      <Header>
        <Button onClick={handleMenuClick} style={{ justifySelf: "start" }}>
          <MenuButton icon={faBars} />
        </Button>
        <Title>{t}</Title>
        <Button style={{ justifySelf: "end" }} onClick={toggleAuthMenu}>
          <MenuButton icon={faEllipsisV} />
        </Button>
        <AuthenticationMenu open={authIsOpen}>
          {user ? (
            <UserMenu close={closeAuth} />
          ) : (
            <AuthenticationForms close={closeAuth} isOpen={authIsOpen} callback={closeAuth} />
          )}
        </AuthenticationMenu>
        <Nav open={open}>
          <CloseButton handleClick={handleMenuClick} />
          <Menu fullscreen>
            <li>
              <MenuItem to="/" onClick={handleMenuClick}>
                Location <GoldIcon icon={faCaretRight} />
              </MenuItem>
            </li>
            <li>
              <MenuItem to="/write" onClick={handleMenuClick}>
                Write a letter <GoldIcon icon={faCaretRight} />
              </MenuItem>
            </li>
            <li>
              <MenuItem to="/reps" onClick={handleMenuClick}>
                Your Representatives <GoldIcon icon={faCaretRight} />
              </MenuItem>
            </li>
            <li>
              <MenuItem to="/registry" onClick={handleMenuClick}>
                Letter Registry <GoldIcon icon={faCaretRight} />
              </MenuItem>
            </li>
            <li>
              <MenuItem to="/contact-us" onClick={handleMenuClick}>
                Contact Us <GoldIcon icon={faCaretRight} />
              </MenuItem>
            </li>
            <li>
              <MenuItem to="/privacy-policy" onClick={handleMenuClick}>
                Privacy Policy <GoldIcon icon={faCaretRight} />
              </MenuItem>
            </li>
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
              <FacebookLink href="https://www.facebook.com/voiceyourstance">
                <FontAwesomeIcon icon={faFacebookF} />
              </FacebookLink>
            </li>
            <li>
              <TwitterLink href="https://twitter.com/VoiceYourStance">
                <FontAwesomeIcon icon={faTwitter} />
              </TwitterLink>
            </li>
            <li>
              <EmailLink href="mailto:me@kylemelton.com">
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
