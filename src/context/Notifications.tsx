import React, { useState, useEffect } from "react"

interface NotificationsContextInterface {
  addNotification: (S: string) => void
  notification: string | undefined
}
const NotificationsContext = React.createContext<NotificationsContextInterface>({} as NotificationsContextInterface)

interface Props {}
function NotificationsProvider(props: Props) {
  const [notification, setNotification] = useState<string | undefined>(undefined)

  const addNotification = (message: string) => {
    setNotification(message)
  }

  useEffect(() => {
    let timerId: number
    if (notification) {
      timerId = setTimeout(() => {
        setNotification(undefined)
      }, 5000)
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [notification])

  return <NotificationsContext.Provider value={{ notification, addNotification }} {...props} />
}

const useNotifications = () => React.useContext(NotificationsContext)

export { NotificationsProvider, useNotifications }
