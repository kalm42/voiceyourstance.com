import React, { useState } from "react"

interface MetaDataContextInterface {
  author: string
  setAuthor: (T: string) => void
  lang: string
  setLang: (T: string) => void
  metaDescription: string
  setMetaDescription: (T: string) => void
  title: string
  setTitle: (T: string) => void
}

interface Props {}

const MetaDataContext = React.createContext<MetaDataContextInterface | null>(null)

function MetaDataProvider(props: Props) {
  const [lang, setLang] = useState("en")
  const [title, setTitle] = useState("Voice Your Stance")
  const [metaDescription, setMetaDescription] = useState("")
  const [author, setAuthor] = useState("Kyle Melton & Wade Harned")

  return (
    <MetaDataContext.Provider
      value={{ lang, setLang, title, setTitle, metaDescription, setMetaDescription, author, setAuthor }}
      {...props}
    />
  )
}

const useMetaData = () => React.useContext(MetaDataContext)

export { MetaDataProvider, useMetaData }
