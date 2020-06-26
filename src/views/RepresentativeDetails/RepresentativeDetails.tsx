import React, { useEffect, useMemo } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"
import { useRepresentatives } from "../../context/Representatives"
import { useAnalytics } from "../../context/Analytics"
import ErrorReportingBoundry from "../../components/ErrorReportingBoundry"
import SEO from "../../components/SEO"
import { useMetaData } from "../../context/MetaData"
import ErrorMessage from "../../components/ErrorMessage"
import { RouteComponentProps } from "@reach/router"
import AddressLink from "./AddressLink"
import PhoneLink from "./PhoneLink"
import SocialMediaChannelLink from "./SocialMediaChannelLink"

const Wrapper = styled.div`
  padding: 2rem;
`
const ProfileImage = styled.div`
  background: ${props => props.theme.main};
  height: 136px;
  margin: 0 -2rem;
  display: grid;
  align-items: center;
  justify-items: center;
`
const DefaultProfileImage = styled(FontAwesomeIcon)`
  color: ${props => props.theme.background};
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

interface Props extends RouteComponentProps {
  repid?: string
}

const RepresentativeDetails = (props: Props) => {
  const { repid } = props
  const representativeContext = useRepresentatives()
  const analytics = useAnalytics()
  const MetaData = useMetaData()

  /**
   * set the title
   */
  if (MetaData && MetaData.safeSetTitle) {
    MetaData.safeSetTitle("Representative")
  }

  const rep = useMemo(() => {
    return representativeContext && representativeContext.getRepresentativeById((repid as unknown) as number)
  }, [representativeContext])

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
      <SEO
        title={`Representative ${rep.name} | Voice Your Stance`}
        description={`${rep.name} the ${rep.title}'s contact information`}
      />
      <ErrorReportingBoundry>
        <ProfileImage>
          <DefaultProfileImage icon={faUser} />
        </ProfileImage>
        <RepNameWrapper>
          <h1>{rep.name}</h1>
          <p>
            {rep?.title} - {rep.party}
          </p>
        </RepNameWrapper>
        <div>
          <h3>Contact Information</h3>
          <div>
            <h4>Phone</h4>
            <PhoneCollection>
              {rep.phones ? (
                rep.phones.map(phone => <PhoneLink phone={phone} key={phone} />)
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
                  <AddressLink address={addr} addressId={index} repid={(repid as unknown) as number} key={index} />
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
                rep.channels.map((channel, index) => {
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

                  return <SocialMediaChannelLink channel={channel} url={url} key={index} />
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

export default RepresentativeDetails
