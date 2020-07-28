require("ts-node").register({ files: true })
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}.local`,
})

module.exports = {
  siteMetadata: {
    title: `Voice Your Stance`,
    description: `The easiest way to find and contact your representatives about the issues that you care about.`,
    author: `@kalm42`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: `VYSAPI`,
        fieldName: `vysapi`,
        url: `${process.env.GATSBY_BACKEND}/graphql`,
      },
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: `GTM-N8KWLC9`,
        includeInDevelopment: true,
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Voice Your Stance`,
        short_name: `VYS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#344051`,
        display: `minimal-ui`,
        icon: `src/images/vys-logo.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
