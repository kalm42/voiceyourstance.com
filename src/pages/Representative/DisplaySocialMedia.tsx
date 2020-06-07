import React from "react"
import { faFacebookF, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"

const SocialMedia = styled.div`
  display: grid;
  background: ${(props) => props.theme.main};
  padding: 1rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-items: center;
`
const SocialMediaIcon = styled(FontAwesomeIcon)`
  width: 2rem !important;
  height: 2rem !important;
`
const SocialMediaLink = styled.a`
  color: ${(props) => props.theme.background};
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
    color: ${(props) => props.theme.accent};
  }
`

interface Props {
  type?: string
  id?: string
}

const DisplaySocialMedia = (props: Props) => {
  const { type, id } = props

  let url = ""
  switch (type) {
    case "Facebook":
      url = "https://facebook.com/"
      break
    case "Youtube":
      url = "https://youtube.com/"
      break
    case "Twitter":
      url = "https://twitter.com/"
      break
    default:
      break
  }

  return (
    <SocialMediaLink href={`${url}${id}`}>
      <SocialMedia>
        {type === "Facebook" && <SocialMediaIcon icon={faFacebookF} />}
        {type === "Twitter" && <SocialMediaIcon icon={faTwitter} />}
        {type === "YouTube" && <SocialMediaIcon icon={faYoutube} />}
      </SocialMedia>
    </SocialMediaLink>
  )
}

export default DisplaySocialMedia
