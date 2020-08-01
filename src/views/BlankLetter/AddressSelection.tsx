import React from "react"
import styled from "styled-components"
import { Address, Representative } from "../../types"
import { PrimaryButton } from "../../components/elements"

interface ToWrapperProps {
  selected: boolean
}
const ToWrapper = styled.div`
  justify-self: center;
  ${(props: ToWrapperProps) => props.selected && "align-self: start;"}
`

interface Props {
  openDialog: () => void
  address?: Address
  representative?: Representative
}

const AddressSelection = (props: Props) => {
  const { address, representative, openDialog } = props
  return (
    <ToWrapper selected={!!address}>
      {address ? (
        <div>
          <h2>To</h2>
          <p>
            {representative?.name} <br /> {representative?.title}
          </p>
          <address>
            {address.locationName}
            {address.locationName && <br />}
            {address.line1}
            {address.line1 && <br />}
            {address.line2}
            {address.line2 && <br />}
            {address.line3}
            {address.line3 && <br />}
            {address.city}, {address.state} {address.zip}
            <br />
          </address>
        </div>
      ) : (
        <PrimaryButton onClick={openDialog}>choose a representative</PrimaryButton>
      )}
    </ToWrapper>
  )
}

export default AddressSelection
