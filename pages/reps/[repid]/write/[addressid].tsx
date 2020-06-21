import React, { useState, useEffect, useCallback } from "react"
import { RawDraftContentState } from "draft-js"
import { useRouter } from "next/router"
import { useAnalytics } from "../../../../src/context/Analytics"
import { Address } from "../../../../src/types"
import lzString from "../../../../src/common/lzString"
import { WriteLetter, WriteTemplateLetter } from "../../../../src/views"
import { useMetaData } from "../../../../src/context/MetaData"

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
  const router = useRouter()
  const searchParams = router.query
  const MetaData = useMetaData()

  /**
   * set the title
   */
  if (MetaData.safeSetTitle) {
    MetaData.safeSetTitle("Write a letter")
  }

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
    const templateSP = searchParams.template
    if (templateSP && !template) {
      setWriteTemplate(templateSP as string)
    }
  }, [searchParams, setWriteTemplate, template])

  return template ? <WriteTemplateLetter template={template} /> : <WriteLetter />
}

export default Write
