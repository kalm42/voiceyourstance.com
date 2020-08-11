import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookF, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import styled from "styled-components"
import { SocialMediaChannel } from "../../types"

const SocialMedia = styled.div`
  display: grid;
  background: var(--main);
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
  color: var(--background);
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
    color: var(--accent);
  }
`

interface Props {
  url: string
  channel: SocialMediaChannel
}

const SocialMediaChannelLink = (props: Props) => {
  const { url, channel } = props
  return (
    <SocialMediaLink href={`${url}${channel.id}`} id={`social-media-chanel-link-${channel.type}`}>
      <SocialMedia>
        {channel.type === "Facebook" && <SocialMediaIcon icon={faFacebookF} />}
        {channel.type === "Twitter" && <SocialMediaIcon icon={faTwitter} />}
        {channel.type === "YouTube" && <SocialMediaIcon icon={faYoutube} />}
      </SocialMedia>
    </SocialMediaLink>
  )
}

export default SocialMediaChannelLink
