import React, { useState } from "react"
import { RouteComponentProps } from "@reach/router"
import styled from "styled-components"
import FromForm from "../../components/FromForm"
import { PrimaryButton, SecondaryButton } from "../../components/elements"

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`
const MetaWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  align-items: center;
`
const ToWrapper = styled.div`
  justify-self: center;
`

const BlankLetter = (props: RouteComponentProps) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  return (
    <Wrapper>
      <MetaWrapper>
        <FromForm
          city={city}
          line1={line1}
          name={name}
          setCity={setCity}
          setLine1={setLine1}
          setName={setName}
          setState={setState}
          setZip={setZip}
          state={state}
          zip={zip}
          disabled={loading}
        />
        <ToWrapper>
          <PrimaryButton>choose a representative</PrimaryButton>
        </ToWrapper>
      </MetaWrapper>
      <div>
        <h2>What do you want to say?</h2>
        <SecondaryButton>use a letter from the registry</SecondaryButton>
      </div>
      <div>editor</div>
      <div>
        <div>mail</div>
        <div>save</div>
      </div>
    </Wrapper>
  )
}

export default BlankLetter
