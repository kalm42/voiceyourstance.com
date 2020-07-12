import React, { useRef, useCallback, useEffect } from "react"
import { faBars, faEllipsisV, faEnvelope, faCaretRight } from "@fortawesome/free-solid-svg-icons"
import { Menu, MenuItem, GoldIcon, PrimaryButton, Divider } from "./elements"
import { useAuthentication } from "../context/Authentication"

interface Props {
  close: () => void
}

const UserMenu = (props: Props) => {
  const authentication = useAuthentication()
  const ref = useRef<HTMLDivElement>(null)
  const { close } = props

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!ref.current || !event.target) return

      if (ref.current.contains(event.target as Node)) {
        return
      } else {
        close()
      }
    },
    [props],
  )

  const handleMenuClick = () => close()

  /**
   * Handle click outside close
   */
  useEffect(() => {
    document.addEventListener("mousedown", handleClick, false)
    return () => {
      document.removeEventListener("mousedown", handleClick, false)
    }
  }, [handleClick])

  return (
    <div ref={ref}>
      <Menu>
        <li>
          <MenuItem to="/write/draft" onClick={handleMenuClick}>
            Letter Drafts <GoldIcon icon={faCaretRight} />
          </MenuItem>
        </li>
        <li>
          <MenuItem to="/sent" onClick={handleMenuClick}>
            Sent Letters <GoldIcon icon={faCaretRight} />
          </MenuItem>
        </li>
        <li>
          <MenuItem to="/registered-letters" onClick={handleMenuClick}>
            Registered Letters <GoldIcon icon={faCaretRight} />
          </MenuItem>
        </li>
      </Menu>
      <Divider />
      <PrimaryButton onClick={() => authentication?.logout()}>logout</PrimaryButton>
    </div>
  )
}

export default UserMenu
