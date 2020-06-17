import React from "react"
import { Helmet } from "react-helmet"
import { useMetaData } from "../context/MetaData"
import { useLocation } from "react-router-dom"

const Seo = () => {
  const MetaData = useMetaData()
  const location = useLocation()
  if (!MetaData) return null
  const { lang, title, metaDescription, author } = MetaData
  return (
    <Helmet>
      <title>{title}</title>
      <html lang={lang} />
      <meta name="description" content={metaDescription} />
      {/* <meta property="og:image" content={} /> */}
      <meta property="og:url" content={location.pathname} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary" />
      <meta name="twitter:creator" content={author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
    </Helmet>
  )
}

export default Seo
