import React, { useState, useEffect, useCallback } from "react"
import { RouteComponentProps, useLocation } from "@reach/router"
import { RawDraftContentState } from "draft-js"
import { useAnalytics } from "../../context/Analytics"
import { Address } from "../../types"
import lzString from "../../components/lzString"
import WriteLetterFromScratch from "./WriteLetterFromScratch"
import WriteLetterFromTemplate from "./WriteLetterFromTemplate"
import { useMetaData } from "../../context/MetaData"

interface To extends Address {
  name: string
  title: string
}
interface Template {
  editorState: RawDraftContentState
  to: To
}
interface Props extends RouteComponentProps {
  repid?: string
  addressid?: string
}

const WriteLetter = (props: Props) => {
  const [template, setTemplate] = useState<Template | undefined>(undefined)
  const analytics = useAnalytics()
  const location = useLocation()
  const MetaData = useMetaData()
  const urlQuery = new URLSearchParams(location.search)

  /**
   * set the title
   */
  useEffect(() => {
    MetaData?.safeSetTitle("Write a letter")
  }, [MetaData])

  /**
   * Analytics Report Page View
   */
  useEffect(() => {
    analytics?.pageView()
  }, [analytics])

  /**
   * Check for query params. If they're repsent then this is a template
   */
  const setWriteTemplate = useCallback(
    (template: string) => {
      analytics?.event("MAIL", "Load template from query params", "LOAD_TEMPLATE", true)
      const lz = new lzString()
      const decompressed = lz.decompressFromEncodedURIComponent(template)
      if (decompressed) {
        const template: Template = JSON.parse(decompressed)
        setTemplate(template)
      }
    },
    [analytics],
  )

  useEffect(() => {
    const templateSP = urlQuery.get("template")
    if (templateSP && !template) {
      setWriteTemplate(templateSP as string)
    }
  }, [urlQuery, setWriteTemplate, template])

  return template ? (
    <WriteLetterFromTemplate template={template} />
  ) : (
    <WriteLetterFromScratch
      repid={(props.repid as unknown) as number}
      addressid={(props.addressid as unknown) as number}
    />
  )
}

export default WriteLetter
