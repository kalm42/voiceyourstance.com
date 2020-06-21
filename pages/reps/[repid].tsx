import React, { useEffect, useMemo } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faArrowRight, faFeather, faPhoneAlt } from "@fortawesome/free-solid-svg-icons"
import { faFacebookF, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import styled from "styled-components"
import Link from "next/link"
import { useRouter } from "next/router"
import { useRepresentatives } from "../../src/context/Representatives"
import { useAnalytics } from "../../src/context/Analytics"
import ErrorReportingBoundry from "../../src/common/ErrorReportingBoundry"
import Seo from "../../src/common/Seo"
import { useMetaData } from "../../src/context/MetaData"
import ErrorMessage from "../../src/common/ErrorMessage"

const Wrapper = styled.div`
  padding: 2rem;
`
const ProfileImage = styled.div`
  background: ${(props) => props.theme.main};
  height: 136px;
  margin: 0 -2rem;
  display: grid;
  align-items: center;
  justify-items: center;
`
const DefaultProfileImage = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.background};
  height: 5rem !important;
  width: 5rem !important;
`
const RepNameWrapper = styled.div``
const PhoneCollection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
`
const AddressCollection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
`
const SocialMediaCollection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
  grid-gap: 1rem;
`
const RightArrow = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
`
const AddressDetails = styled.div`
  background: ${(props) => props.theme.main};
  display: grid;
  padding: 1rem;
  grid-template-columns: 30px 1fr 30px;
  align-items: center;
`
const Feather = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
  align-self: start;
`
const AddressLink = styled.a`
  color: ${(props) => props.theme.background};
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`
const PhoneLink = styled.a`
  color: ${(props) => props.theme.background};
  text-decoration: none;
  transition: all 200ms ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`
const PhoneIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.accent};
`
const PhoneDetails = styled.div`
  background: ${(props) => props.theme.main};
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  align-items: center;
  padding: 0.5rem 1rem;
`
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

const Representative = () => {
  const representativeContext = useRepresentatives()
  const router = useRouter()
  const { repid } = router.query
  const analytics = useAnalytics()
  const MetaData = useMetaData()

  /**
   * set the title
   */
  if (MetaData.safeSetTitle) {
    MetaData.safeSetTitle("Representative")
  }

  const rep = useMemo(() => {
    if (!representativeContext) return null
    const { civicInfo } = representativeContext
    if (!civicInfo || !repid) return null

    const reps = []

    for (const office of civicInfo.offices) {
      const title = office.name

      for (const index of office.officialIndices) {
        const official = civicInfo.officials[index]
        const { name, party, address, phones, channels } = official
        reps.push({ title, name, party, address, phones, channels })
      }
    }

    return reps[(repid as unknown) as number]
  }, [representativeContext, repid])

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  if (!rep) {
    return (
      <Wrapper>
        <ErrorMessage error={new Error("No representative was found.")} />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Seo
        title={`Representative ${rep.name}`}
        metaDescription={`${rep.name} the ${rep.title}'s contact information`}
      />
      <ErrorReportingBoundry>
        <ProfileImage>
          <DefaultProfileImage icon={faUser} />
        </ProfileImage>
        <RepNameWrapper>
          <h1>{rep.name}</h1>
          <p>
            {rep.title} - {rep.party}
          </p>
        </RepNameWrapper>
        <div>
          <h3>Contact Information</h3>
          <div>
            <h4>Phone</h4>
            <PhoneCollection>
              {rep.phones ? (
                rep.phones.map((phone) => (
                  <PhoneLink href={`tel:${phone}`} key={phone}>
                    <PhoneDetails>
                      <PhoneIcon icon={faPhoneAlt} />
                      <p>{phone}</p>
                      <RightArrow icon={faArrowRight} />
                    </PhoneDetails>
                  </PhoneLink>
                ))
              ) : (
                <p>No phone numbers listed.</p>
              )}
            </PhoneCollection>
          </div>
          <div>
            <h4>Address</h4>
            <p>Click on an address to write a letter to them.</p>
            <AddressCollection>
              {rep.address ? (
                rep.address.map((addr, index) => (
                  <Link
                    href="/reps/[repid]/write/[addressid]"
                    as={`/reps/${repid}/write/${index}`}
                    key={index}
                    passHref
                  >
                    <AddressLink>
                      <AddressDetails>
                        <Feather icon={faFeather} />
                        <address>
                          {addr.locationName} {addr.locationName && <br />}
                          {addr.line1} {addr.line1 && <br />}
                          {addr.line2} {addr.line2 && <br />}
                          {addr.line3} {addr.line3 && <br />}
                          {addr.city}, {addr.state}, {addr.zip}
                        </address>
                        <RightArrow icon={faArrowRight} />
                      </AddressDetails>
                    </AddressLink>
                  </Link>
                ))
              ) : (
                <p>No addresses provided.</p>
              )}
            </AddressCollection>
          </div>
          <div>
            <h4>Social Media</h4>
            <SocialMediaCollection>
              {rep.channels ? (
                rep.channels.map((channel) => {
                  let url = ""
                  switch (channel.type) {
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
                    <SocialMediaLink href={`${url}${channel.id}`}>
                      <SocialMedia>
                        {channel.type === "Facebook" && <SocialMediaIcon icon={faFacebookF} />}
                        {channel.type === "Twitter" && <SocialMediaIcon icon={faTwitter} />}
                        {channel.type === "YouTube" && <SocialMediaIcon icon={faYoutube} />}
                      </SocialMedia>
                    </SocialMediaLink>
                  )
                })
              ) : (
                <p>No social media accounts listed.</p>
              )}
            </SocialMediaCollection>
          </div>
        </div>
      </ErrorReportingBoundry>
    </Wrapper>
  )
}

export default Representative
