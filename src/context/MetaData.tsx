import React, { useState, useCallback } from "react"

interface MetaDataContextInterface {
  title: string
  safeSetTitle: (T: string) => void
}

interface Props {}

const MetaDataContext = React.createContext<MetaDataContextInterface | null>(null)

function MetaDataProvider(props: Props) {
  const [title, setTitle] = useState("Voice Your Stance")

  const safeSetTitle = useCallback((newTitle: string) => {
    setTitle(newTitle)
  }, [])

  return <MetaDataContext.Provider value={{ title, safeSetTitle }} {...props} />
}

const useMetaData = () => React.useContext(MetaDataContext)

export { MetaDataProvider, useMetaData }
