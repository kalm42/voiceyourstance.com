import React from "react"
import { RouteComponentProps } from "@reach/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"
import { useRepresentatives } from "../../context/Representatives"
import DisplayPhone from "./DisplayPhone"
import DisplayAddress from "./DisplayAddress"
import DisplaySocialMedia from "./DisplaySocialMedia"

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

interface Props extends RouteComponentProps {
  repId?: string
}

const Representative = (props: Props) => {
  const representativeContext = useRepresentatives()
  if (!representativeContext) {
    return null
  }
  const { civicInfo } = representativeContext
  if (!civicInfo) {
    return null
  }
  if (!props.repId) return null

  const reps = []

  for (const office of civicInfo.offices) {
    const title = office.name

    for (const index of office.officialIndices) {
      const official = civicInfo.officials[index]
      const { name, party, address, phones, channels } = official
      reps.push({ title, name, party, address, phones, channels })
    }
  }

  const rep = reps[(props.repId as unknown) as number]
  return (
    <Wrapper>
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
              rep.phones.map((phone) => <DisplayPhone phoneNumber={phone} />)
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
              rep.address.map((addr, index) => <DisplayAddress address={addr} repId={props.repId} addrId={index} />)
            ) : (
              <p>No addresses provided.</p>
            )}
          </AddressCollection>
        </div>
        <div>
          <h4>Social Media</h4>
          <SocialMediaCollection>
            {rep.channels ? (
              rep.channels.map((channel) => <DisplaySocialMedia {...channel} />)
            ) : (
              <p>No social media accounts listed.</p>
            )}
          </SocialMediaCollection>
        </div>
      </div>
    </Wrapper>
  )
}

export default Representative
