import React from "react"
import { renderToString } from "react-dom/server"
import Document, { DocumentContext } from "next/document"
import { ServerStyleSheet } from "styled-components"
import { Input } from "../src/common/elements"

export default class VYSDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({ enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />) })

      // Wasn't picking up the styling for this element.
      renderToString(sheet.collectStyles(<Input />))

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
}
