import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCircle, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useRepresentatives } from "../../context/Representatives"
import styled, { StyledComponent } from "styled-components"
import { Representative, Address } from "../../types"

const Wrapper = styled.div`
  position: fixed;
  top: 4rem;
  left: 10vw;
  background: var(--background);
  padding: 2rem;
  height: 80vh;
  width: 80vw;
  border: 1px solid var(--accent);
  overflow-x: scroll;
`
const RepsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
`
interface RepWrapperProps {
  disabled?: boolean
}
const RepWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--accent);
  padding: 1rem;
  color: ${(props: RepWrapperProps) => (props.disabled ? "grey" : "inheirt")};
`
const RepProfile = styled(FontAwesomeIcon)`
  width: 3rem !important;
  height: 3rem !important;
`
const AddressListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1rem;
`
const AddressButton = styled.button`
  border: 1px solid var(--accent);
  padding: 1rem;
  background: none;
  font-size: 1rem;
`
const BackButton = styled.button`
  background: var(--main);
  border: none;
  padding: 1rem;
  color: var(--background);
  font-size: 1rem;
  min-width: 200px;
`
const BackButtonWrapper = styled.div`
  margin: 0 0 1rem;
`

interface Props {
  setToAddress: (Addr: Address) => void
  setToRepresentative: (R: Representative) => void
  close: () => void
}

const ChooseRepresentative = (props: Props) => {
  const { setToAddress, setToRepresentative, close } = props
  const [rep, setRep] = useState<Representative | undefined>(undefined)
  const representativeContext = useRepresentatives()

  const rgbd = representativeContext?.getRepresentativesGroupedByDivision()
  if (!rgbd || !rgbd.length) {
    return (
      <div>
        <p>No representatives found.</p>
      </div>
    )
  }

  const handleSelectAddress = (address: Address) => {
    if (rep && address) {
      setToRepresentative(rep)
      setToAddress(address)
      close()
    }
  }

  if (rep) {
    return (
      <Wrapper>
        <BackButtonWrapper>
          <BackButton onClick={() => setRep(undefined)}>&lt; Back</BackButton>
        </BackButtonWrapper>
        <AddressListWrapper>
          {rep.address.map((addr, index) => (
            <AddressButton key={index} onClick={() => handleSelectAddress(addr)}>
              <address>
                {addr.locationName}
                {addr.locationName && <br />}
                {addr.line1}
                {addr.line1 && <br />}
                {addr.line2}
                {addr.line2 && <br />}
                {addr.line3}
                {addr.line3 && <br />}
                {addr.city}, {addr.state} {addr.zip}
                <br />
              </address>
            </AddressButton>
          ))}
        </AddressListWrapper>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {rgbd.map(division => (
        <div key={division.id}>
          <h2>{division.name}</h2>
          <RepsWrapper>
            {division.reps.map(rep => (
              <RepWrapper
                key={rep.index}
                onClick={() => !!rep?.address?.length && setRep(rep)}
                disabled={!!!rep?.address?.length}
              >
                <RepProfile icon={faUserCircle} />
                <div style={{ flex: 1 }}>
                  <p>{rep.title}</p>
                  <p>
                    {rep.name} - {rep.party}
                  </p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} />
              </RepWrapper>
            ))}
          </RepsWrapper>
        </div>
      ))}
    </Wrapper>
  )
}

export default ChooseRepresentative
