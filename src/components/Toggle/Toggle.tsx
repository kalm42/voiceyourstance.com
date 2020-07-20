import React, { useCallback } from "react"
import "./toggle.css"

interface Props {
  toggleId: string
  labelText: string
  toggleName: string
  disabled?: boolean
  checked: boolean | undefined
  handleCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void
}
const Toggle = (props: Props) => {
  const { toggleId, labelText, toggleName, disabled = false, checked, handleCheckbox } = props

  const indeterminateCheckbox = useCallback(
    (checkbox: HTMLInputElement) => {
      if (checkbox) {
        checkbox.indeterminate = checked === undefined
      }
    },
    [checked],
  )

  return (
    <section className="toggles flip">
      <input
        type="checkbox"
        name={toggleName}
        id={toggleId}
        disabled={disabled}
        checked={checked}
        ref={indeterminateCheckbox}
        onChange={handleCheckbox}
      />
      <label htmlFor={toggleId}>{labelText}</label>
    </section>
  )
}

export default Toggle
