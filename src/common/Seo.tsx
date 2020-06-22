import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"

interface Props {
  lang?: string
  title?: string
  metaDescription?: string
  author?: string
}

const Seo = (props: Props) => {
  const {
    lang = "en",
    title = "Voice Your Stance",
    metaDescription = "The easiest way to find and communicate with your representatives. It's time to Voice Your Stance.",
    author = "Kyle Melton",
  } = props
  const router = useRouter()
  return (
    <Head>
      <title>{title}</title>
      <html lang={lang} />
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      <meta name="description" content={metaDescription} />
      <meta property="og:image" content="https://voiceyourstance.com/vys_logo.png" />
      <meta property="og:url" content={`https://voiceyourstance.com${router.asPath}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:image" content="https://voiceyourstance.com/vys_logo.png" />
      <meta name="twitter:creator" content={author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}

export default Seo
