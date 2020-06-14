import React, { useState, useEffect, useCallback } from "react"
import { RawDraftContentState } from "draft-js"
import { useLocation } from "react-router-dom"
import { useAnalytics } from "../../context/Analytics"
import { Address } from "../../types"
import lzString from "../../common/lzString"
import WriteLetter from "./WriteLetter"
import WriteTemplateLetter from "./WriteTemplateLetter"

interface To extends Address {
  name: string
  title: string
}
interface Template {
  editorState: RawDraftContentState
  to: To
}

const Write = () => {
  const [template, setTemplate] = useState<Template | undefined>(undefined)
  const analytics = useAnalytics()
  const searchParams = new URLSearchParams(useLocation().search)

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
    const templateSP = searchParams.get("template")
    if (templateSP && !template) {
      setWriteTemplate(templateSP)
    }
  }, [searchParams, setWriteTemplate, template])

  return template ? <WriteTemplateLetter template={template} /> : <WriteLetter />
}

export default Write
