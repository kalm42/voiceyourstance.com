/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

require("ts-node").register({ files: true })
const path = require("path")

/** @type { import("gatsby").GatsbyNode["createPages"] } */
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path.match(/^\/reps/)) {
    page.matchPath = `/reps/*`
    createPage(page)
  }
  if (page.path.match(/^\/write/)) {
    page.matchPath = `/write/*`
    createPage(page)
  }

  if (page.path.match(/^\/registered-letters/)) {
    page.matchPath = `/registered-letters/*`
    createPage(page)
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const templateResults = await graphql(`
    query PublicTemplates {
      vysapi {
        publicTemplates {
          id
        }
      }
    }
  `)
  if (templateResults.error) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
  }

  // Registry root
  const registryRootTemplate = path.resolve(`src/views/RegistryIndex/RegistryIndex.tsx`)
  createPage({
    path: `/registry`,
    component: registryRootTemplate,
  })

  // Registered letters
  const letterTemplate = path.resolve(`src/views/ViewTemplate/ViewTemplate.tsx`)
  templateResults.data.vysapi.publicTemplates.forEach(templateLetter => {
    createPage({
      path: `/registry/${templateLetter.id}`,
      component: letterTemplate,
      context: {
        templateId: templateLetter.id,
      },
    })
  })
}
