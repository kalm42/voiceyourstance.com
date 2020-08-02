/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"

interface Props {
  description?: string
  lang?: string
  meta?: React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>[]
  title?: string
  image?: string
}

function SEO(props: Props) {
  const { pathname } = useLocation()
  const {
    description = "The easiest way to find and contact your elected representatives.",
    lang = "en",
    meta = [],
    title = "Voice Your Stance",
    image = "",
  } = props
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            url
            twitterUsername
            image
          }
        }
      }
    `,
  )

  const metaDescription = description || site.siteMetadata.description

  const metaData = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:url`,
      content: `${site.siteMetadata.url}${pathname}`,
    },
    {
      property: `og:image`,
      content: `${site.siteMetadata.url}${site.siteMetadata.image}`,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: `twitter:card`,
      content: `summary_large_image`,
    },
    {
      name: `twitter:creator`,
      content: site.siteMetadata.twitterUsername,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: metaDescription,
    },
  ] as React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>[]

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={metaData.concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
