import React, { useEffect } from "react"
import ReactGA from "react-ga"
const ANALYTICS_KEY = process.env.NEXT_PUBLIC_ANALYTICS_KEY

interface AnalyticsContextInterface {
  pageView: () => void
  event: (category: string, action: string, label: string, nonInteration?: boolean) => void
  modalView: (modalName: string) => void
  exception: (description: string, fatal: boolean) => void
}

interface Props {}

const AnalyticsContext = React.createContext<AnalyticsContextInterface | null>(null)

function AnalyticsProvider(props: Props) {
  const pageView = () => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  const event = (category: string, action: string, label: string, nonInteration?: boolean) => {
    if (nonInteration) {
      ReactGA.event({ category, action, label, nonInteraction: nonInteration })
    } else {
      ReactGA.event({ category, action, label })
    }
  }

  const modalView = (modalName: string) => {
    ReactGA.modalview(modalName)
  }

  const exception = (description: string, fatal: boolean) => {
    ReactGA.exception({ description, fatal })
  }

  useEffect(() => {
    if (!ANALYTICS_KEY) {
      throw new Error("No analytics key!")
    }

    ReactGA.initialize(ANALYTICS_KEY)
  }, [])
  return <AnalyticsContext.Provider value={{ pageView, event, modalView, exception }} {...props} />
}

const useAnalytics = () => React.useContext(AnalyticsContext)

export { AnalyticsProvider, useAnalytics }
